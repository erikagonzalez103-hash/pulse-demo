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
    '.pulse-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}' +
    '.review-nav{position:fixed;top:14px;left:14px;z-index:9998;display:flex;gap:8px;}' +
    '.review-nav button,.review-nav a{font-family:var(--font-body,sans-serif);font-size:12px;color:var(--text-dim,#95A0AE);' +
    'background:var(--bg-elev,#0E1420);border:1px solid var(--border-soft,rgba(255,255,255,.08));border-radius:999px;' +
    'padding:7px 13px;cursor:pointer;text-decoration:none;transition:all .2s;line-height:1;}' +
    '.review-nav button:hover,.review-nav a:hover{color:var(--gold,#CAA871);border-color:var(--gold-deep,#A37E4F);}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  var el, timer;
  window.go = function (url) { window.location.href = url; };
  window.sendPrompt = function () {
    if (!el) { el = document.createElement('div'); el.className = 'pulse-toast'; document.body.appendChild(el); }
    el.textContent = 'Prototype stub · this screen is planned';
    el.classList.add('show');
    clearTimeout(timer); timer = setTimeout(function () { el.classList.remove('show'); }, 1700);
  };

  /* Review navigation — a Back + All-screens control in the preview chrome (outside the app UI),
     added to every screen automatically since each loads nav.js. The flow map (index.html) omits it. */
  var nav = document.createElement('div');
  nav.className = 'review-nav';
  var back = document.createElement('button');
  back.type = 'button'; back.innerHTML = '&#8249; Back';
  back.onclick = function () { history.back(); };
  var map = document.createElement('a');
  map.href = '../index.html'; map.innerHTML = '&#8962; All screens';
  nav.appendChild(back); nav.appendChild(map);
  document.body.appendChild(nav);

  /* — APP MODE (the PWA shell) —
     Standalone install, ?app=1, or a prior app-mode visit this tab → the
     preview chrome collapses (see components.css) and the screen IS the app. */
  var isStandalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) ||
                     window.navigator.standalone === true;
  var wantsApp = /[?&]app=1/.test(location.search);
  try {
    if (wantsApp) sessionStorage.setItem('pulse-app-mode', '1');
    if (isStandalone || sessionStorage.getItem('pulse-app-mode') === '1') {
      document.body.classList.add('app-mode');
    }
  } catch (e) { if (isStandalone || wantsApp) document.body.classList.add('app-mode'); }

  /* Manifest + theme-color injected once here instead of edited into 33 screens. */
  var root = /\/screens\//.test(location.pathname) ? '../' : '';
  var mf = document.createElement('link'); mf.rel = 'manifest'; mf.href = root + 'manifest.webmanifest';
  document.head.appendChild(mf);
  var th = document.createElement('meta'); th.name = 'theme-color'; th.content = '#06090F';
  document.head.appendChild(th);
  var fav = document.createElement('link'); fav.rel = 'icon'; fav.type = 'image/png';
  fav.href = root + 'images/favicon-32.png'; document.head.appendChild(fav);
  var ati = document.createElement('link'); ati.rel = 'apple-touch-icon';
  ati.href = root + 'images/icon-180.png'; document.head.appendChild(ati);

  /* Service worker: https or localhost only (file:// preview stays untouched). */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register(root + 'sw.js').catch(function () {});
  }
})();
