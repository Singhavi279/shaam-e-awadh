// Builds the three standalone Meta-ads landing pages from index.html.
// Usage: node tools/build-micro.mjs   (writes tickets-micro/, awards-micro/, partner-micro/)
import fs from 'node:fs';
const src = fs.readFileSync('index.html', 'utf8');
const lines = src.split('\n');
const between = (a, b, from = 0) => { const i = src.indexOf(a, from); if (i < 0) throw new Error('missing ' + a); const j = src.indexOf(b, i); if (j < 0) throw new Error('missing ' + b); return src.slice(i, j + b.length) };

const css = between('<style>', '</style>');
const svgDefs = between('<svg width="0" height="0"', '</svg>\n');
const hero = between('<section class="hero"', '</section>');
const voices = between('<section id="voices"', '</section>');
const visit = between('<section id="visit"', '</section>');
const dlgReg = between('<dialog class="mdl" id="m-register"', '</dialog>');
const dlgNom = between('<dialog class="mdl" id="m-nominate"', '</dialog>');
const dlgPar = between('<dialog class="mdl" id="m-partner"', '</dialog>');

// ---- script: reuse the site script, minus the programme filter and calendar blocks
let js = between('<script>\n      (function () {\n        var d = document, root', '</script>');
const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b); if (i < 0 || j < 0 || j < i) throw new Error('cut ' + a); return s.slice(0, i) + s.slice(j) };
js = cut(js, '/* programme: day + category filter */', '/* artists: refresh');
js = cut(js, '/* add to calendar', '/* ===== forms');
// inline forms: no auto-focus/scroll on first paint, smooth scroll to the form on later steps
js = js.replace("if (f) setTimeout(function () { f.focus() }, 30);",
  "if (dlg._quiet) { dlg.scrollTop = 0; return } if (f) setTimeout(function () { f.focus() }, 30); if (dlg.classList.contains('inl')) dlg.scrollIntoView({ block: 'start', behavior: 'smooth' });");
js = js.replace("$('.mdl').forEach(wire);",
  "$('.mdl').forEach(wire);\n        $('.mdl.inl').forEach(function (dlg) { dlg._quiet = true; resetDlg(dlg); dlg._quiet = false });");
js = js.replace("function closeDlg(dlg) {", "function closeDlg(dlg) {\n          if (dlg.classList.contains('inl')) { resetDlg(dlg); return }");
if (!js.includes('dlg._quiet') || !js.includes("classList.contains('inl')")) throw new Error('patch failed');

// ---- ticket prices from the event hub API (list slug "tickets"); markup values stay as the fallback
const priceJs = `
        /* ticket pricing: event hub API list "tickets" (custom_fields: tier s|g, price, original_price). Fallback = markup. */
        (function () {
          var API = 'https://api.indiatimes.com/eventhub/api/public/events/6abe319413badc345e14a0fb/custom-lists';
          function apply(p) {
            PRODUCTS.registration.price = function (q) { return q >= 4 ? p.g.price : p.s.price };
            ['s', 'g'].forEach(function (t) {
              var v = p[t];
              $('.pq[data-price]').forEach(function (pq, i) {
                if ((i === 0 ? 's' : 'g') !== t) return; pq.setAttribute('data-price', v.price);
                q1('[data-pt]', pq).textContent = money(+q1('output', pq).textContent * v.price);
                var card = pq.closest('.pass'); q1('.now', card).textContent = money(v.price);
                if (v.orig) q1('del', card).textContent = money(v.orig);
              });
              $('.mcard[data-tier="' + t + '"]').forEach(function (c) { c.setAttribute('data-price', v.price); q1('.mpr b', c).textContent = money(v.price); if (v.orig) q1('.mpr del', c).lastChild.textContent = money(v.orig) });
            });
            $('.mdl[data-type="registration"]').forEach(function (dlg) { if (dlg._s) renderQty(dlg) });
          }
          function run() {
            fetch(API + '?upcache=' + Math.floor(Date.now() / 3600000)).then(function (r) { return r.ok ? r.json() : null }).then(function (j) {
              var ls = (j && j.data) || [], l = ls.filter(function (x) { return x.slug === 'tickets' })[0]; if (!l || !l.items) return;
              var p = {}; l.items.forEach(function (it, i) {
                var c = it.custom_fields || {}, t = c.tier === 'g' || c.tier === 's' ? c.tier : (i === 0 ? 's' : 'g'), pr = parseInt(c.price, 10), og = parseInt(c.original_price, 10);
                if (pr > 0) p[t] = { price: pr, orig: og > 0 ? og : 0 };
              });
              if (p.s && p.g) apply(p);
            }).catch(function () { });
          }
          if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 3000 }); else setTimeout(run, 1500);
        })();
`;

const extraCss = `
  <style>
    :root{--sbar-h:69px}
    .hdr .nav{gap:10px}
    .hdr .nav .btn{white-space:nowrap}
    .mdl.inl{position:static;display:block;margin:0 auto;width:min(640px,100%);max-height:none;overflow:visible;animation:none;box-shadow:0 24px 60px -30px #0007;border:1px solid var(--line)}
    .mdl.inl[open]{animation:none}
    .mdl.inl .mx,.mdl.inl .res [data-close]{display:none!important}
    #lead,#visit,#voices{scroll-margin-top:calc(var(--hdr) + 8px)}
    #lead{padding:clamp(40px,6vw,72px) 0}
    #lead .lead-h{text-align:center;margin-bottom:24px}
    #lead .lead-h h2{margin:0 auto}
    #lead .lead-h h2::after{margin-left:auto;margin-right:auto}
    .mfoot{padding:28px 0 calc(var(--sbar-h) + 20px);text-align:center;font-size:.85rem;color:var(--muted)}
    @media (max-width:600px){.mdl.inl{width:100%;height:auto;max-height:none;border-radius:18px}}
  </style>`;

const header = (cta) => `<header class="hdr">
    <div class="wrap">
      <a class="logo" href="https://timeslanguages.in/shaam-e-awadh/" aria-label="Grand Shaam-e-Awadh, Lucknow Edition">
        <img src="../img/logo.webp" width="88" height="60" alt="Grand Shaam-e-Awadh, Lucknow Edition" decoding="async" fetchpriority="high">
      </a>
      <nav class="nav" aria-label="Main">
        <div class="lang" role="group" aria-label="Language">
          <button type="button" data-lang="en" aria-pressed="true" lang="en">EN</button>
          <button type="button" data-lang="hi" aria-pressed="false" lang="hi">हिन्दी</button>
        </div>
        ${cta}
      </nav>
    </div>
  </header>`;

const heroCta = (primary, secondary) => hero.replace(/<div class="cta">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/, `<div class="cta">\n          ${primary}\n          ${secondary}\n        </div>\n      `);
const artistsBtn = '<a class="btn ghost" href="#voices" data-hi="कलाकार देखें">See the artists</a>';

const pages = {
  'tickets-micro': {
    title: 'Grand Shaam-e-Awadh 2027: Buy Tickets, Lucknow, 16–17 Jan',
    desc: 'Two-day passes for Grand Shaam-e-Awadh, Lucknow, 16–17 January 2027. Passes from ₹499 + GST.',
    cta: '<a class="btn" href="#visit" data-modal="register" data-hi="टिकट खरीदें">Buy Tickets</a>',
    hero: heroCta('<a class="btn gold" href="#visit" data-modal="register" data-hi="टिकट खरीदें">Buy Tickets</a>', artistsBtn),
    body: visit + '\n    ' + voices, dialogs: dlgReg, price: true,
    sbar: '<a class="btn" href="#visit" data-modal="register" data-hi="टिकट खरीदें">Buy Tickets</a>'
  },
  'awards-micro': {
    title: 'Lucknow Ratna Samman Nominations | Grand Shaam-e-Awadh 2027',
    desc: 'Nominate an individual, institution or enterprise for the Lucknow Ratna Samman at Grand Shaam-e-Awadh, 16–17 January 2027.',
    cta: '<a class="btn" href="#lead" data-hi="नामांकन करें">Nominate</a>',
    hero: heroCta('<a class="btn gold" href="#lead" data-hi="नामांकन करें">Nominate Now</a>', artistsBtn),
    body: `<section id="lead" class="parch" aria-labelledby="lead-h">
      <div class="wrap">
        <div class="lead-h"><p class="eyebrow" data-hi="लखनऊ रत्न सम्मान">Lucknow Ratna Samman</p>
        <h2 id="lead-h" data-hi="किसी को सम्मानित करने के लिए नामांकित करें।">Nominate someone worth honouring.</h2></div>
        ${dlgNom.replace('<dialog class="mdl"', '<dialog class="mdl inl" open')}
      </div>
    </section>
    ` + voices, dialogs: '',
    sbar: '<a class="btn" href="#lead" data-hi="नामांकन करें">Nominate Now</a>'
  },
  'partner-micro': {
    title: 'Partner with Grand Shaam-e-Awadh 2027: Sponsorship, Expo, Food Court',
    desc: 'Sponsorship, exhibition, booth space and food-court partnerships at Grand Shaam-e-Awadh, Lucknow, 16–17 January 2027.',
    cta: '<a class="btn" href="#lead" data-hi="अभी साझेदार बनें">Partner Now</a>',
    hero: heroCta('<a class="btn gold" href="#lead" data-hi="अभी साझेदार बनें">Partner Now</a>', artistsBtn),
    body: `<section id="lead" class="parch" aria-labelledby="m-partner-t">
      <div class="wrap">
        <div class="lead-h"><p class="eyebrow" data-hi="साझेदारी · प्रायोजन · प्रदर्शनी · फ़ूड कोर्ट">Sponsorship · Expo · Food Court</p></div>
        ${dlgPar.replace('<dialog class="mdl"', '<dialog class="mdl inl" open')}
      </div>
    </section>
    ` + voices, dialogs: '',
    sbar: '<a class="btn" href="#lead" data-hi="अभी साझेदार बनें">Partner Now</a>'
  }
};

for (const [dir, p] of Object.entries(pages)) {
  let body = p.body;
  let h = p.hero.replace(/class="cv /g, 'class="');
  let all = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}">
  <meta name="robots" content="noindex, follow">
  <meta name="theme-color" content="#f7f0df">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.desc}">
  <meta property="og:image" content="https://timeslanguages.in/shaam-e-awadh/share.jpg">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%236b1a2a'/%3E%3Cpath d='M8 26V15a8 8 0 0 1 16 0v11' fill='none' stroke='%23c9a24e' stroke-width='2.4'/%3E%3Ccircle cx='16' cy='15' r='2.6' fill='%23c9a24e'/%3E%3C/svg%3E">
  <link rel="preload" as="image" href="../video/poster-960.jpg" imagesrcset="../video/poster-480.jpg 480w, ../video/poster-960.jpg 960w, ../video/poster-1280.jpg 1280w" imagesizes="100vw" fetchpriority="high">
  ${css}${extraCss}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  ${svgDefs}
  ${header(p.cta)}
  <main id="main">
    ${h}
    ${body}
  </main>
  <p class="mfoot">© Times Internet Languages Live · Grand Shaam-e-Awadh, 16–17 January 2027, Lucknow</p>
  <div class="sbar" role="region" aria-label="Quick actions">
    <div class="sbar-info">
      <strong data-hi="ग्रैंड शाम-ए-अवध">Grand Shaam-e-Awadh</strong>
      <span data-hi="शनि–रवि · 16–17 जनवरी 2027">Sat–Sun · 16–17 Jan 2027</span><span class="lk" data-hi=" · लखनऊ"> · Lucknow</span>
    </div>
    <div class="sbar-cta">
      ${p.sbar}
    </div>
  </div>
  ${p.dialogs}
  ${p.price ? js.replace("window.SEA = {", priceJs + "        window.SEA = {") : js}
</body>
</html>
`;
  all = all.replace(/(src|href|srcset)="(img|video)\//g, '$1="../$2/').replace(/(\d+w, )(video)\//g, '$1../$2/').replace(/'video\/hero-/g, "'../video/hero-");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + '/index.html', all);
  console.log(dir + '/index.html', (all.length / 1024).toFixed(0) + ' KB');
}
