/* Pulse prototype — tiny navigation helper.
   go(file)  → real click-through between screens (relative to /screens/).
   sendPrompt(msg) → graceful fallback for buttons whose screen isn't built yet:
                     shows a subtle "planned" toast instead of throwing.
   Tokens (var(--…)) resolve because tokens.css is loaded on every screen. */
(function () {
  var css = '.pulse-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);' +
    'background:var(--bg-elev,#0E1420);color:var(--gold,#CAA871);border:1px solid var(--border,rgba(202,168,113,.22));' +
    'font-family:var(--font-body,sans-serif);font-size:12.5px;letter-spacing:.01em;padding:11px 18px;border-radius:999px;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.5);opacity:0;transition:opacity .25s,transform .25s;z-index:9999;' +
    'pointer-events:none;max-width:320px;text-align:center;}' +
    '.pulse-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  var el, timer;
  window.go = function (url) { window.location.href = url; };
  window.sendPrompt = function () {
    if (!el) { el = document.createElement('div'); el.className = 'pulse-toast'; document.body.appendChild(el); }
    el.textContent = 'Prototype stub · this screen is planned';
    el.classList.add('show');
    clearTimeout(timer); timer = setTimeout(function () { el.classList.remove('show'); }, 1700);
  };
})();
