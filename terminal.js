/* ============================================================
   TERMINAL EASTER EGG — SoloSuccess Solutions
   Hidden commands: origin, story, help, clear, matrix, glitch
   Triggered by clicking the terminal and typing.
   CRT flicker + ASCII art reveal on secret commands.
   ============================================================ */

(function () {
  'use strict';

  /* ── ASCII Art ──────────────────────────────────────────── */
  var ASCII = {

    logo: [
      ' ___  ___  _     ___  ___  _   _  ___  ___  ___  ___ ',
      '/ __>/ _ \\| |   / _ \\/ __>| | | |/ __>/ __>/ __>/ __>',
      '\\__ \\| | || |_ | | | \\__ \\| |_| |\\__ \\\\__ \\\\__ \\\\__ \\',
      '<___/\\___/|___||_| |_/<___/ \\___/ <___/<___/<___/<___/',
      '',
      ' ___  ___  _     _  _  _____  _  ___  _  _  ___ ',
      '/ __>/ _ \\| |   | || ||_   _|| |/ _ \\| \\| |/ __>',
      '\\__ \\| | || |_  | || |  | |  | | | | | .  |\\__ \\',
      '<___/\\___/|___| |____|  |_|  |_|\\___/|_|\\_|<___/',
    ],

    diamond: [
      '        ◆',
      '      ◆◆◆◆◆',
      '    ◆◆◆◆◆◆◆◆◆',
      '  ◆◆◆◆◆  S  ◆◆◆◆◆',
      '    ◆◆◆◆◆◆◆◆◆',
      '      ◆◆◆◆◆',
      '        ◆',
    ],

    year: [
      '██████╗  ██████╗ ██████╗ ██╗  ██╗',
      '╚════██╗██╔═████╗╚════██╗██║  ██║',
      ' █████╔╝██║██╔██║ █████╔╝███████║',
      '██╔═══╝ ████╔╝██║██╔═══╝ ╚════██║',
      '███████╗╚██████╔╝███████╗     ██║',
      '╚══════╝ ╚═════╝ ╚══════╝     ╚═╝',
    ],

    divider: '─────────────────────────────────────────────────────',
  };

  /* ── Command registry ────────────────────────────────────── */
  var COMMANDS = {

    help: {
      hint: 'List available commands',
      run: function (term) {
        term.print('');
        term.printHolo('  Available commands:');
        term.print('');
        term.printRow('  origin',  'Reveal the founding story');
        term.printRow('  story',   'Same as origin');
        term.printRow('  mission', 'Print the core mission');
        term.printRow('  year',    'Display founding year in ASCII');
        term.printRow('  matrix',  'You already know.');
        term.printRow('  glitch',  'Trigger a terminal glitch event');
        term.printRow('  clear',   'Clear terminal output');
        term.printRow('  help',    'Show this message');
        term.print('');
        term.printMuted('  → Type a command and press Enter');
        term.print('');
        return Promise.resolve();
      },
    },

    origin: {
      hint: 'The founding story',
      run: function (term) { return runOriginSequence(term); },
    },

    story: {
      hint: 'Alias for origin',
      run: function (term) { return runOriginSequence(term); },
    },

    mission: {
      hint: 'Core mission',
      run: function (term) {
        return term.crtFlicker(1).then(function () {
          term.print('');
          term.printHolo('  MISSION STATEMENT');
          term.print('  ' + ASCII.divider.slice(0, 40));
          return term.typeLines([
            '',
            '  Give solo founders the tools',
            '  that used to require a team.',
            '',
            '  We build at the intersection of AI',
            '  and human ambition.',
            '',
            '  The future belongs to people who',
            '  move fast, think clearly, and',
            '  refuse to wait for permission.',
            '',
          ], 28);
        });
      },
    },

    year: {
      hint: 'Founding year in ASCII',
      run: function (term) {
        return term.crtFlicker(2).then(function () {
          term.print('');
          term.printMuted('  FOUNDED:');
          term.print('');
          ASCII.year.forEach(function (line) { term.printHolo('  ' + line); });
          term.print('');
          term.printMuted('  The year one founder said: enough waiting.');
          term.print('');
          return Promise.resolve();
        });
      },
    },

    matrix: {
      hint: 'You already know.',
      run: function (term) { return runMatrixSequence(term); },
    },

    glitch: {
      hint: 'Trigger a terminal glitch',
      run: function (term) { return runGlitchSequence(term); },
    },

    clear: {
      hint: 'Clear terminal',
      run: function (term) {
        term.clearOutput();
        return Promise.resolve();
      },
    },
  };

  /* ── Timing helpers ──────────────────────────────────────── */
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ── Terminal class ──────────────────────────────────────── */
  function Terminal(bodyEl, wrapEl) {
    this.body   = bodyEl;   // .terminal__body
    this.wrap   = wrapEl;   // .terminal (outer wrapper)
    this.output = null;     // injected output container
    this.inputLine = null;  // the prompt+input line
    this.inputEl   = null;  // the <input> element
    this.history   = [];
    this.histIdx   = -1;
    this.busy      = false;
    this._build();
  }

  Terminal.prototype._build = function () {
    var self = this;

    /* Output area appended AFTER the existing static content */
    var outputWrap = document.createElement('div');
    outputWrap.className = 'te-output';
    outputWrap.setAttribute('aria-live', 'polite');
    outputWrap.setAttribute('aria-atomic', 'false');
    this.body.appendChild(outputWrap);
    this.output = outputWrap;

    /* Separator */
    var sep = document.createElement('div');
    sep.className = 'te-sep';
    sep.setAttribute('aria-hidden', 'true');
    this.body.appendChild(sep);

    /* Input line */
    var inputLine = document.createElement('div');
    inputLine.className = 'te-input-line';

    var prompt = document.createElement('span');
    prompt.className = 'te-prompt';
    prompt.setAttribute('aria-hidden', 'true');
    prompt.textContent = '→ ';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'te-input';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'none');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Terminal input — type help for commands');
    input.placeholder = 'type a command…';

    inputLine.appendChild(prompt);
    inputLine.appendChild(input);
    this.body.appendChild(inputLine);
    this.inputLine = inputLine;
    this.inputEl   = input;

    /* Click anywhere on terminal to focus input */
    this.wrap.addEventListener('click', function () { self.inputEl.focus(); });

    /* Key handlers */
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        self._submit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        self._historyUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        self._historyDown();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        self._autocomplete();
      }
    });

    /* Hint line */
    var hint = document.createElement('div');
    hint.className = 'te-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = '  click to focus · type help · ↑↓ history · tab autocomplete';
    this.body.appendChild(hint);
  };

  Terminal.prototype._submit = function () {
    if (this.busy) return;
    var raw = this.inputEl.value.trim();
    this.inputEl.value = '';
    this.histIdx = -1;
    if (!raw) return;

    /* Save history */
    this.history.unshift(raw);
    if (this.history.length > 20) this.history.pop();

    /* Echo the command */
    var cmd = raw.toLowerCase().split(' ')[0];
    this.printCommand(raw);

    /* Lookup and run */
    var handler = COMMANDS[cmd];
    if (!handler) {
      this.print('');
      this.printErr('  command not found: ' + raw);
      this.printMuted('  → type help for available commands');
      this.print('');
      this._scroll();
      return;
    }

    this.busy = true;
    var self = this;
    handler.run(this).then(function () {
      self.busy = false;
      self._scroll();
      self.inputEl.focus();
    });
    this._scroll();
  };

  Terminal.prototype._historyUp = function () {
    if (!this.history.length) return;
    this.histIdx = Math.min(this.histIdx + 1, this.history.length - 1);
    this.inputEl.value = this.history[this.histIdx];
  };
  Terminal.prototype._historyDown = function () {
    this.histIdx = Math.max(this.histIdx - 1, -1);
    this.inputEl.value = this.histIdx >= 0 ? this.history[this.histIdx] : '';
  };
  Terminal.prototype._autocomplete = function () {
    var val = this.inputEl.value.toLowerCase();
    if (!val) { this.inputEl.value = 'help'; return; }
    var matches = Object.keys(COMMANDS).filter(function (k) { return k.startsWith(val); });
    if (matches.length === 1) this.inputEl.value = matches[0];
  };

  Terminal.prototype._scroll = function () {
    var self = this;
    requestAnimationFrame(function () {
      // The .terminal wrapper has overflow-y:auto and fixed maxHeight
      self.wrap.scrollTop = self.wrap.scrollHeight;
    });
  };

  /* ── Print helpers ───────────────────────────────────────── */
  Terminal.prototype._line = function (cls, text) {
    var el = document.createElement('div');
    el.className = 'te-line ' + (cls || '');
    el.textContent = text || '';
    this.output.appendChild(el);
    return el;
  };

  Terminal.prototype.print      = function (t) { return this._line('', t || ''); };
  Terminal.prototype.printHolo  = function (t) { return this._line('te-holo', t); };
  Terminal.prototype.printMuted = function (t) { return this._line('te-muted', t); };
  Terminal.prototype.printErr   = function (t) { return this._line('te-err', t); };
  Terminal.prototype.printCommand = function (t) {
    var el = this._line('te-cmd-echo', '');
    var prompt = document.createElement('span');
    prompt.className = 'te-prompt';
    prompt.textContent = '→ ';
    var text = document.createElement('span');
    text.textContent = t;
    el.appendChild(prompt);
    el.appendChild(text);
    return el;
  };
  Terminal.prototype.printRow = function (cmd, desc) {
    var el = this._line('te-row', '');
    var c = document.createElement('span');
    c.className = 'te-row-cmd';
    c.textContent = cmd;
    var d = document.createElement('span');
    d.className = 'te-row-desc';
    d.textContent = desc;
    el.appendChild(c);
    el.appendChild(d);
    return el;
  };

  Terminal.prototype.clearOutput = function () {
    this.output.innerHTML = '';
  };

  /* ── Typewriter ──────────────────────────────────────────── */
  Terminal.prototype.typeLines = function (lines, delayMs) {
    var self = this;
    var delay = delayMs || 35;
    var i = 0;
    return new Promise(function (resolve) {
      function next() {
        if (i >= lines.length) { resolve(); return; }
        self.print(lines[i]);
        self._scroll();
        i++;
        setTimeout(next, delay + Math.random() * 18);
      }
      next();
    });
  };

  Terminal.prototype.typeChars = function (text, targetEl, charMs) {
    var delay = charMs || 40;
    var i = 0;
    targetEl.textContent = '';
    return new Promise(function (resolve) {
      function next() {
        if (i >= text.length) { resolve(); return; }
        targetEl.textContent += text[i];
        i++;
        setTimeout(next, delay + Math.random() * 20);
      }
      next();
    });
  };

  /* ── CRT Flicker ─────────────────────────────────────────── */
  Terminal.prototype.crtFlicker = function (intensity) {
    var self = this;
    intensity = intensity || 1;
    this.wrap.classList.add('crt-flicker');

    return new Promise(function (resolve) {
      /* Schedule flicker pulses */
      var pulses = intensity === 1 ? 3 : 6;
      var fired  = 0;

      function pulse() {
        self.wrap.classList.add('crt-pulse');
        setTimeout(function () {
          self.wrap.classList.remove('crt-pulse');
          fired++;
          if (fired < pulses) {
            setTimeout(pulse, 80 + Math.random() * 120);
          } else {
            setTimeout(function () {
              self.wrap.classList.remove('crt-flicker');
              resolve();
            }, 200);
          }
        }, 60 + Math.random() * 80);
      }

      setTimeout(pulse, 100);
    });
  };

  /* ── ORIGIN SEQUENCE ─────────────────────────────────────── */
  function runOriginSequence(term) {
    return wait(120)
      .then(function () { return term.crtFlicker(2); })
      .then(function () {
        term.print('');
        /* Diamond ASCII */
        ASCII.diamond.forEach(function (line) { term.printHolo('  ' + line); });
        return wait(400);
      })
      .then(function () {
        term.print('');
        term.printHolo('  ╔══════════════════════════════════════════╗');
        term.printHolo('  ║         SOLOSUCCESS  SOLUTIONS           ║');
        term.printHolo('  ║         ORIGIN  RECORD  //  2024         ║');
        term.printHolo('  ╚══════════════════════════════════════════╝');
        term.print('');
        return wait(300);
      })
      .then(function () {
        return term.typeLines([
          '  FOUNDED .........  2024',
          '  FOUNDER ......... 1x solo builder, no team',
          '  LOCATION ......... Albany, Georgia, US',
          '  TYPE ............. AI-first · Solo-founded',
          '  PRODUCTS ......... 7 (and counting)',
        ], 60);
      })
      .then(function () {
        term.print('');
        term.print('  ' + ASCII.divider);
        term.print('');
        return wait(200);
      })
      .then(function () {
        term.printMuted('  FOUNDING THESIS:');
        term.print('');
        return term.typeLines([
          '  "The best businesses of the next',
          '   decade will be built by a single',
          '   person with the right tools."',
        ], 45);
      })
      .then(function () {
        term.print('');
        term.print('  ' + ASCII.divider);
        term.print('');
        return wait(300);
      })
      .then(function () {
        term.printMuted('  WHY IT EXISTS:');
        return term.typeLines([
          '',
          '  Solo founders have always had to choose:',
          '  → Work 80hr weeks trying to do everything,',
          '  → Or give up equity for a team they can\'t',
          '    afford, manage, or always trust.',
          '',
          '  SoloSuccess Solutions was built to destroy',
          '  that false choice.',
          '',
          '  7 AI-powered products. One parent company.',
          '  Zero excuses.',
          '',
        ], 32);
      })
      .then(function () {
        /* Final year reveal */
        return term.crtFlicker(1);
      })
      .then(function () {
        term.print('');
        ASCII.year.forEach(function (line) { term.printHolo('  ' + line); });
        term.print('');
        term.printMuted('  ✦ The year everything changed. ✦');
        term.print('');
        return wait(200);
      });
  }

  /* ── MATRIX SEQUENCE ─────────────────────────────────────── */
  function runMatrixSequence(term) {
    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    return term.crtFlicker(2).then(function () {
      term.print('');
      term.printHolo('  DECODING MATRIX...');
      term.print('');

      /* Scramble lines */
      var scrambleLines = [];
      for (var i = 0; i < 5; i++) {
        var line = '  ';
        for (var j = 0; j < 48; j++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        scrambleLines.push(line);
      }

      return term.typeLines(scrambleLines, 50).then(function () {
        return term.crtFlicker(1);
      }).then(function () {
        term.print('');
        return term.typeLines([
          '  TRANSLATION COMPLETE:',
          '',
          '  → You found the hidden terminal.',
          '  → Try: origin, mission, year, glitch',
          '  → Nice one.',
          '',
        ], 40);
      });
    });
  }

  /* ── GLITCH SEQUENCE ─────────────────────────────────────── */
  function runGlitchSequence(term) {
    var glitchChars = '▓▒░█▄▀■□▪▫◘○●◙';
    return new Promise(function (resolve) {
      term.print('');

      var lineEls = [];
      var texts = [
        '  SYSTEM_INTEGRITY.....',
        '  MEMORY_DUMP.........',
        '  PIXEL_FAULT.........',
        '  RGB_OFFSET..........',
        '  CRT_SYNC............',
      ];
      texts.forEach(function (t) { lineEls.push(term.printMuted(t)); });

      /* Animate each bar from left to right */
      var delay = 0;
      lineEls.forEach(function (el, i) {
        setTimeout(function () {
          var base = texts[i];
          var filled = base + ' [';
          var barLen = 12;
          var tick = 0;
          var iv = setInterval(function () {
            if (tick >= barLen) {
              clearInterval(iv);
              /* Flash to error or OK */
              var ok = Math.random() > 0.35;
              el.textContent = base + (ok ? ' [  OK  ]' : ' [ ERR  ]');
              el.className = 'te-line ' + (ok ? 'te-muted' : 'te-err');
            } else {
              var bar = '█'.repeat(tick) + glitchChars[Math.floor(Math.random() * glitchChars.length)] + '░'.repeat(barLen - tick - 1);
              el.textContent = base + ' [' + bar + ']';
              tick++;
            }
          }, 55);
        }, delay);
        delay += 160;
      });

      setTimeout(function () {
        term.print('');
        term.printHolo('  GLITCH PROTOCOL COMPLETE');
        term.printMuted('  System integrity: nominal. Probably.');
        term.print('');
        resolve();
      }, delay + 800);
    });
  }

  /* ── CSS injection ───────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [

    /* Terminal wrapper becomes scrollable, grows up to 520px */
    '.terminal { max-height: 520px; overflow-y: auto; scroll-behavior: smooth; }',
    '.terminal::-webkit-scrollbar { width: 4px; }',
    '.terminal::-webkit-scrollbar-track { background: transparent; }',
    '.terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }',
    '.terminal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }',


    /* Output container */
    '.te-output { font-family: "JetBrains Mono","Courier New",monospace; font-size: 13px; line-height: 1.85; }',

    /* Individual lines */
    '.te-line { display: block; white-space: pre; color: #c8c8d8; }',
    '.te-holo { display: block; white-space: pre;',
    '  background: linear-gradient(105deg,#ff4ec8 0%,#ff9a00 15%,#ffe800 30%,#00e676 45%,#00cfff 60%,#7c4dff 80%,#ff4ec8 100%);',
    '  background-size: 300% 300%; animation: te-holo-pan 5s linear infinite;',
    '  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }',
    '@keyframes te-holo-pan { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }',
    '.te-muted { display: block; white-space: pre; color: #666680; }',
    '.te-err   { display: block; white-space: pre; color: #ff4444; }',
    '.te-cmd-echo { display: block; color: #e0e0f0; margin-top: 6px; }',
    '.te-prompt { color: #56d364; }',

    /* Command help row */
    '.te-row { display: flex; gap: 16px; padding: 1px 0; }',
    '.te-row-cmd  { color: #79c0ff; font-weight: 700; min-width: 80px; flex-shrink: 0; }',
    '.te-row-desc { color: #666680; }',

    /* Separator between dynamic output and static content */
    '.te-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 8px 0; }',

    /* Input line */
    '.te-input-line { display: flex; align-items: center; gap: 0; margin-top: 4px; }',
    '.te-input {',
    '  flex: 1; background: transparent; border: none; outline: none;',
    '  font-family: "JetBrains Mono","Courier New",monospace; font-size: 13px;',
    '  color: #e0e0f0; caret-color: #56d364; padding: 0; margin: 0;',
    '  line-height: 1.85;',
    '}',
    '.te-input::placeholder { color: rgba(255,255,255,0.18); }',

    /* Hint */
    '.te-hint {',
    '  font-family: "JetBrains Mono","Courier New",monospace; font-size: 10px;',
    '  color: rgba(255,255,255,0.15); letter-spacing: 0.06em;',
    '  margin-top: 8px; padding-top: 6px;',
    '  border-top: 1px solid rgba(255,255,255,0.05);',
    '}',

    /* ── CRT FLICKER ANIMATIONS ── */

    /* Base flicker: subtle brightness oscillation on the whole terminal */
    '.crt-flicker {',
    '  animation: crt-flicker-base 0.08s steps(1) infinite !important;',
    '}',
    '@keyframes crt-flicker-base {',
    '  0%   { filter: brightness(1)   contrast(1)    blur(0px); }',
    '  12%  { filter: brightness(0.6) contrast(1.4)  blur(0.5px); }',
    '  24%  { filter: brightness(1.2) contrast(0.9)  blur(0px); }',
    '  36%  { filter: brightness(0.3) contrast(1.8)  blur(1px); }',
    '  48%  { filter: brightness(1.1) contrast(1.1)  blur(0px); }',
    '  60%  { filter: brightness(0.7) contrast(1.3)  blur(0.5px); }',
    '  72%  { filter: brightness(1)   contrast(1)    blur(0px); }',
    '  84%  { filter: brightness(0.5) contrast(1.5)  blur(0.8px); }',
    '  100% { filter: brightness(1)   contrast(1)    blur(0px); }',
    '}',

    /* Pulse: a hard white-flash pop then black-out */
    '.crt-pulse {',
    '  animation: crt-pulse-anim 0.06s steps(1) 1 forwards !important;',
    '}',
    '@keyframes crt-pulse-anim {',
    '  0%  { filter: brightness(3) contrast(0.3) invert(0.1); }',
    '  30% { filter: brightness(0) contrast(2)   invert(0); }',
    '  60% { filter: brightness(1.8) contrast(1.2) blur(1px); }',
    '  100%{ filter: brightness(1) contrast(1) blur(0px); }',
    '}',

    /* Scanline intensification during flicker */
    '.crt-flicker .scrap-card__scanlines,',
    '.crt-flicker .terminal { background: #080810; }',

    /* Extra: horizontal jump glitch on the terminal body during pulse */
    '.crt-pulse .terminal__body {',
    '  animation: crt-body-jump 0.06s steps(1) 1 forwards;',
    '}',
    '@keyframes crt-body-jump {',
    '  0%  { transform: translateX(0); }',
    '  25% { transform: translateX(-4px) scaleX(1.01); }',
    '  50% { transform: translateX(3px); }',
    '  75% { transform: translateX(-2px); }',
    '  100%{ transform: translateX(0); }',
    '}',

    /* Reduced motion: kill all CRT animations */
    '@media (prefers-reduced-motion: reduce) {',
    '  .crt-flicker, .crt-pulse { animation: none !important; filter: none !important; }',
    '  .crt-pulse .terminal__body { animation: none !important; transform: none !important; }',
    '}',

  ].join('\n');
  document.head.appendChild(style);

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    var termBody = document.querySelector('.terminal__body');
    var termWrap = document.querySelector('.terminal');
    if (!termBody || !termWrap) return;

    new Terminal(termBody, termWrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
