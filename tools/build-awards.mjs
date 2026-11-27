// Builds /awards/index.html (dedicated Lucknow Ratna Samman page) from index.html's CSS, hero and form engine.
// Editorial copy below is verbatim from the editorial team: do not edit wording.
import fs from 'node:fs';
const src = fs.readFileSync('index.html', 'utf8');
const between = (a, b) => { const i = src.indexOf(a); const j = src.indexOf(b, i); if (i < 0 || j < 0) throw new Error('missing ' + a); return src.slice(i, j + b.length) };
const css = between('<style>', '</style>');
const svgDefs = between('<svg width="0" height="0"', '</svg>\n');
let hero = between('<section class="hero"', '</section>').replace(/<div class="cta">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/, `<div class="cta">
          <a class="btn gold" href="#enquiry">Nominate Now</a>
          <a class="btn ghost" href="#packages">Price Packages</a>
        </div>
      `);
const footer = between('<footer class="ftr">', '</footer>').replace('href="#about"', 'href="../#about"').replace('href="#programme"', 'href="../#programme"').replace('href="#voices"', 'href="../#voices"').replace('href="#contact"', 'href="#contact"');
let js = between('<script>\n      (function () {\n        var d = document, root', '</script>');
const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b); if (i < 0 || j < 0 || j < i) throw new Error('cut ' + a); return s.slice(0, i) + s.slice(j) };
js = cut(js, '/* programme: day + category filter */', '/* artists: refresh');
js = cut(js, '/* add to calendar', '/* ===== forms');
js = cut(js, '/* artists: refresh', '/* ===== forms');
const rep = (a, b) => { if (!js.includes(a)) throw new Error('patch ' + a); js = js.replace(a, b) };
rep("var v = el.value.trim(), r =", "var v = el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value.trim(), r =");
rep("$('.mdl').forEach(wire);", `$('.mdl').forEach(wire);
        $('.mdl.inl').forEach(function (dlg) { dlg._quiet = true; resetDlg(dlg); dlg._quiet = false });
        d.addEventListener('click', function (e) { var b = e.target.closest('[data-plan]'); if (b) { var s = d.getElementById('a_plan'); if (s) s.value = b.getAttribute('data-plan') } });`);
rep("if (f) setTimeout(function () { f.focus() }, 30);", "if (dlg._quiet) { dlg.scrollTop = 0; return } if (f) setTimeout(function () { f.focus() }, 30);");
rep("function closeDlg(dlg) {", "function closeDlg(dlg) {\n          if (dlg.classList.contains('inl')) { resetDlg(dlg); return }");

const segs = ['Business & Enterprise Excellence', 'Healthcare Excellence', 'Education & Academic Leadership', 'Law, Governance & Public Service', 'Arts, Culture & Entertainment', 'Literature & Language', 'Real Estate, Infrastructure & Urban Development', 'Jewellery, Lifestyle & Design Excellence', 'Social Impact & Community Development', 'Special Recognition: Women, Young Achievers & Legacy'];
const esc = s => s.replace(/&/g, '&amp;');
const pk = [
  { n: 'Package 1', p: 'Rs. 24,999', f: ['Single Category Nomination', 'Digital Certificate', 'Social Media Post', '1 Complementary Event Pass'] },
  { n: 'Package 2', p: 'Rs. 49,999', pop: 1, f: ['Single Category Nomination', 'Digital Certificate', '2 Social Media Posts', '5 Complimentary Event Passes', 'Winner Video Byte'] },
  { n: 'Package 3', p: 'Rs. 99,999', f: ['Single Category Nomination', 'Digital Certificate', '4 Exclusive Social Media Posts', '1 Exclusive Article', 'Digital Interview', 'Podcast', '10 Complimentary Event Passes'] }
];
const why = [
  ['Celebrate Excellence and Achievement', 'Recognise individuals and organisations whose exceptional work, dedication and achievements have made a meaningful difference to Lucknow.'],
  ['Gain Recognition and Prestige', 'Bring your journey, accomplishments and contributions into the spotlight through a prestigious platform celebrating the spirit of Awadh.'],
  ['Inspire the Next Generation', 'Let your story inspire aspiring achievers and future leaders. Your success can become a source of motivation for generations to come.'],
  ["Be Part of Lucknow's Legacy", "Join a celebration of the people shaping the city's future while preserving its rich heritage, culture, values and traditions."]
];
const faqs = [
  ['What is the Lucknow Ratna Samman?', "<p>The Lucknow Ratna Samman recognises and celebrates individuals, institutions and enterprises for their outstanding contributions to Lucknow across various fields, honouring excellence, achievements and their impact on the city's growth and heritage.</p>"],
  ['Who can nominate themselves or others for the awards?', '<p>Individuals, professionals, entrepreneurs, business owners, institutions and organisations with notable achievements or contributions in their respective fields can be nominated.</p>'],
  ['Is there an application fee?', '<p>We offer three nomination packages to suit different recognition and visibility requirements:<br>Package 1 – ₹24,999 + GST<br>Package 2 – ₹49,999 + GST (Most Popular)<br>Package 3 – ₹99,999 + GST</p><p>Each package includes a single-category nomination, digital certificate and different promotional and event benefits.</p>'],
  ['How can I proceed with my nomination?', '<p>You can submit your nomination through the official Grand Shaam-e-Awadh website by selecting your preferred award category and nomination package, and completing the required application details and contact our team for further details.</p>'],
  ['When and where will the award ceremony take place?', '<p>The awards will be presented on stage during Grand Shaam-e-Awadh, taking place on 16–17 January 2027 at Dr. B. R. Ambedkar Memorial Park, Lucknow.</p><p>The event will be held in two parts:</p><p>Part 1: Saturday, 16 January 2027<br>Part 2: Sunday, 17 January 2027</p>']
];
const contacts = [['Zameer Siddiqui', '+91 9919759480', 'zameer.siddiqui@timesinternet.in'], ['Simran Singh', '+91 7838788554', 'simran1@timesinternet.in']];
const fld = (id, label, name, type, v, extra = '') => `<div class="fld"><label for="${id}"><span>${label}</span> <i aria-hidden="true">*</i></label>
          <input id="${id}" name="${name}" type="${type}" data-v="${v}" ${extra}>
          <p class="err" id="${id}-e" hidden></p></div>`;
const form = `<dialog class="mdl inl" open id="m-awards" data-type="nomination" aria-labelledby="m-awards-t">
    <form novalidate>
      <header class="mh"><div>
        <h2 id="m-awards-t">Nomination Enquiry for Grand Shaam-e-Awadh 2027</h2>
        <p class="msub">Share your details and our awards team will get in touch with nomination information.</p>
      </div></header>
      <section class="pane" data-pane="1">
        ${fld('a_mobile', 'Mobile number', 'mobile', 'tel', 'req tel', 'autocomplete="tel" inputmode="numeric"')}
        <div class="otp" data-mobile="a_mobile">
          <button type="button" class="btn ghost sm" data-otp="send">Send OTP</button>
          <div class="otp-box" hidden><label for="a_otp"><span>Enter the 4-digit OTP</span></label>
            <div class="otp-row"><input id="a_otp" name="otp_code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]*"><button type="button" class="btn sm" data-otp="verify">Verify</button></div></div>
          <p class="otp-msg" role="status" aria-live="polite" hidden></p>
        </div>
        ${fld('a_name', 'Full name', 'name', 'text', 'req', 'autocomplete="name"')}
        ${fld('a_email', 'Email', 'email', 'email', 'req email', 'autocomplete="email"')}
        ${fld('a_desig', 'Designation', 'designation', 'text', 'req', 'autocomplete="organization-title"')}
        ${fld('a_org', 'Organisation', 'organisation', 'text', 'req', 'autocomplete="organization"')}
        <div class="fld"><label for="a_plan"><span>Nomination plan</span> <i aria-hidden="true">*</i></label>
          <select id="a_plan" name="nomination_plan" data-v="req"><option value="">Select…</option>${pk.map((p, i) => `<option value="Package ${i + 1}">Package ${i + 1} – ₹${p.p.slice(4)} + GST${p.pop ? ' (Most Popular)' : ''}</option>`).join('')}</select>
          <p class="err" id="a_plan-e" hidden></p></div>
        <div class="fld"><label for="a_why"><span>Brief description of your work</span> <i aria-hidden="true">*</i></label>
          <textarea id="a_why" name="description" rows="4" data-v="req"></textarea><p class="err" id="a_why-e" hidden></p></div>
        <fieldset class="segs"><legend>Segments of interest</legend>
          ${segs.map((s, i) => `<label class="chk"><input type="checkbox" name="segment_${i + 1}" value="${esc(s)}"><span>${esc(s)}</span></label>`).join('\n          ')}
        </fieldset>
        <label class="chk"><input type="checkbox" id="a_tc" name="consent_terms" data-v="req"><span>I agree to the <a href="https://timeslanguages.in/termsandconditions" target="_blank" rel="noopener">Terms and Conditions</a>, <a href="https://timeslanguages.in/privacypolicy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="https://timeslanguages.in/cancellationpolicy" target="_blank" rel="noopener">Cancellation Policy</a>.</span></label>
        <p class="err" id="a_tc-e" hidden></p>
        <label class="chk"><input type="checkbox" name="consent_contact"><span>I agree to be contacted by email and on my contact number (including WhatsApp) about my nomination enquiry and to receive updates about Grand Sham-e-Awadh 2027.</span></label>
        <div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>
        <div class="act"><button type="button" class="btn gold" data-submit>Submit</button></div>
        <p class="mft">Need help? Call <a href="tel:+919919759480">Zameer Siddiqui · +91 9919759480</a></p>
      </section>
      <section class="pane res" data-pane="res" hidden>
        <div class="tick" aria-hidden="true">✓</div>
        <h3 class="res-t" tabindex="-1"></h3><p class="res-b"></p><p class="res-ref"></p>
        <p class="res-c">For any questions, call <a href="tel:+919919759480">Zameer Siddiqui · +91 9919759480</a></p>
      </section>
      <p class="fail" role="alert" hidden></p>
    </form>
  </dialog>`;

const extraCss = `
  <style>
    :root{--sbar-h:69px}
    html{scroll-behavior:smooth}
    #overview,#segments,#packages,#why,#faqs,#enquiry,#contact{scroll-margin-top:calc(var(--hdr) + 8px)}
    .hdr .nav{gap:10px}.hdr .nav .btn{white-space:nowrap}
    .ov{max-width:860px}.ov p{font-size:1.1rem;line-height:1.75;margin-top:16px}
    .dark h2,#faq-h,#why-h,#pk-h{max-width:none}
    .segh{font:700 .85rem/1.4 var(--sans);letter-spacing:.14em;color:var(--gold);margin-top:20px}
    .segs-g{list-style:none;margin:20px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
    .segs-g li{display:flex;gap:14px;align-items:center;padding:18px 20px;border:1px solid rgba(255,255,255,.18);border-radius:14px;background:rgba(255,255,255,.05);font:600 1.02rem/1.35 var(--sans)}
    .segs-g li b{font:700 1.4rem var(--serif);color:var(--gold);min-width:2ch}
    .pkgs{margin-top:34px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px;max-width:1100px;align-items:stretch}
    .pkgs .pass{position:relative}
    .pkgs .pass .price{font-size:2.3rem}
    .pk{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:10px}
    .pk li{position:relative;padding-left:26px}
    .pk li::before{content:"✓";position:absolute;left:0;color:var(--gold);font-weight:700}
    .pkgs .pass.pop{outline:3px solid var(--gold);outline-offset:3px}
    .whyg{margin-top:30px;display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
    .whyg article{padding:24px;border:1px solid var(--line);border-radius:18px;background:#fff}
    .whyg b{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--emerald);color:#fff;font:700 1.05rem var(--serif)}
    .whyg h3{margin:12px 0 8px;font-size:1.25rem}
    .faq p+p{margin-top:10px}
    .mdl.inl{position:static;display:block;margin:0 auto;width:min(680px,100%);max-height:none;overflow:visible;animation:none;box-shadow:0 24px 60px -30px #0007;border:1px solid var(--line)}
    .mdl.inl .res [data-close]{display:none!important}
    .segs{border:0;padding:0;margin:18px 0 0;display:grid;gap:8px}
    .segs legend{font-weight:600;margin-bottom:6px}
    #enquiry{padding:clamp(40px,6vw,72px) 0}
    .crows .crow{grid-template-columns:1fr 1fr;gap:12px 48px}@media (max-width:700px){.crows .crow{grid-template-columns:1fr}}
    @media (max-width:900px){.pkgs{grid-template-columns:1fr}.whyg,.segs-g{grid-template-columns:1fr}}
    @media (max-width:600px){.mdl.inl{width:100%;height:auto;max-height:none;border-radius:18px}}
  </style>`;

const links = [['overview', 'Awards Overview'], ['segments', 'Awards Segments'], ['packages', 'Price Packages'], ['why', 'Why Nominate?'], ['faqs', 'Award FAQs'], ['contact', 'Contact Us']];
const title = 'Lucknow Ratna Samman Awards | Grand Shaam-e-Awadh 2027';
const desc = "The Lucknow Ratna Samman, presented by Grand Shaam-e-Awadh, celebrates the individuals, institutions and enterprises that have made exceptional contributions to Lucknow. Nominate for 16–17 January 2027.";
let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://timeslanguages.in/shaam-e-awadh/awards/">
  <meta name="theme-color" content="#f7f0df">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Times Internet Languages Live">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://timeslanguages.in/shaam-e-awadh/awards/">
  <meta property="og:image" content="https://timeslanguages.in/shaam-e-awadh/share.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%236b1a2a'/%3E%3Cpath d='M8 26V15a8 8 0 0 1 16 0v11' fill='none' stroke='%23c9a24e' stroke-width='2.4'/%3E%3Ccircle cx='16' cy='15' r='2.6' fill='%23c9a24e'/%3E%3C/svg%3E">
  <link rel="preload" as="image" href="../video/poster-960.jpg" imagesrcset="../video/poster-480.jpg 480w, ../video/poster-960.jpg 960w, ../video/poster-1280.jpg 1280w" imagesizes="100vw" fetchpriority="high">
  ${css}${extraCss}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  ${svgDefs}
  <header class="hdr"><div class="wrap">
    <a class="logo" href="../" aria-label="Grand Shaam-e-Awadh, Lucknow Edition"><img src="../img/logo.webp" width="88" height="60" alt="Grand Shaam-e-Awadh, Lucknow Edition" decoding="async" fetchpriority="high"></a>
    <nav class="nav" aria-label="Main">
      ${links.map(l => `<a class="l" href="#${l[0]}">${l[1]}</a>`).join('\n      ')}
      <a class="btn" href="#enquiry">Nominate Now</a>
    </nav>
  </div></header>
  <main id="main">
    ${hero}
    <section id="overview" class="about parch" aria-labelledby="ov-h"><div class="wrap ov">
      <p class="eyebrow">Awards Overview</p>
      <h2 id="ov-h">Lucknow Ratna Samman</h2>
      <p>Rooted in the rich cultural heritage and evolving spirit of Awadh, the Lucknow Ratna Samman, presented by Grand Shaam-e-Awadh, is a prestigious recognition initiative celebrating the individuals, institutions and enterprises that have made exceptional contributions to Lucknow and its people. The Samman aims to recognise excellence, dedication, innovation and meaningful impact across diverse fields, including culture, heritage, literature, arts, education, business, entrepreneurship, social impact and public service. From preserving the city's timeless traditions to driving progress, creating opportunities and inspiring social change, the initiative honours those who have played a significant role in shaping Lucknow's identity, growth and future. Through this platform, Grand Shaam-e-Awadh seeks to bring deserving achievers and changemakers into the spotlight, celebrate their journeys and acknowledge their lasting contributions to the city.</p>
    </div></section>
    <section id="segments" class="dark" aria-labelledby="seg-h"><div class="wrap">
      <p class="eyebrow">Awards Segments</p>
      <h2 id="seg-h">Grand Shaam-e-Awadh | Winner Award Subcategories</h2>
      <ul class="segs-g">
        ${segs.map((s, i) => `<li><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(s)}</span></li>`).join('\n        ')}
      </ul>
    </div></section>
    <section id="packages" class="parch" aria-labelledby="pk-h"><div class="wrap">
      <h2 id="pk-h">Price Packages</h2>
      <div class="pkgs">
        ${pk.map((p, i) => `<div class="pass best${p.pop ? ' pop' : ''}"><div>
          ${p.pop ? '<p class="eb">Most Popular</p>' : ''}
          <h3>${p.n}</h3>
          <p class="price"><span class="now">${p.p}</span> <span class="unit">+ GST</span></p>
          <ul class="pk">${p.f.map(f => `<li>${f}</li>`).join('')}</ul></div>
          <div class="pass-act"><a class="btn gold" href="#enquiry" data-plan="Package ${i + 1}">Nominate Now</a></div></div>`).join('\n        ')}
      </div>
    </div></section>
    <section id="why" aria-labelledby="why-h"><div class="wrap">
      <h2 id="why-h">Why Nominate?</h2>
      <div class="whyg">
        ${why.map((w, i) => `<article><b>${i + 1}</b><h3>${w[0]}</h3><p>${w[1]}</p></article>`).join('\n        ')}
      </div>
    </div></section>
    <section id="faqs" class="parch" aria-labelledby="faq-h"><div class="wrap">
      <h2 id="faq-h">Award FAQs</h2>
      <div class="faq">
        ${faqs.map(f => `<details><summary>${f[0]}</summary>${f[1]}</details>`).join('\n        ')}
      </div>
    </div></section>
    <section id="enquiry" aria-labelledby="m-awards-t"><div class="wrap">
      ${form}
    </div></section>
    <section id="contact" class="parch" aria-labelledby="con-h"><div class="wrap">
      <h2 id="con-h">Contact Us</h2>
      <div class="crows">
        <article class="crow crow2">${contacts.map(c => `<div class="cr-p"><div class="cp"><p class="who">${c[0]}</p><a href="tel:${c[1].replace(/ /g, '')}">${c[1]}</a><a href="mailto:${c[2]}">${c[2]}</a></div></div>`).join('')}</article>
      </div>
    </div></section>
  </main>
  ${footer}
  <div class="sbar" role="region" aria-label="Quick actions">
    <div class="sbar-info"><strong>Grand Shaam-e-Awadh</strong><span>Sat–Sun · 16–17 Jan 2027</span><span class="lk"> · Lucknow</span></div>
    <div class="sbar-cta"><a class="btn" href="#enquiry">Nominate Now</a></div>
  </div>
  ${js}
</body>
</html>
`;
html = html.replace(/(src|href|srcset)="(img|video)\//g, '$1="../$2/').replace(/(\d+w, )(video)\//g, '$1../$2/').replace(/'video\/hero-/g, "'../video/hero-");
html = html.replace(/class="cv /g, 'class="');
fs.mkdirSync('awards', { recursive: true });
fs.writeFileSync('awards/index.html', html);
console.log('awards/index.html', (html.length / 1024).toFixed(0) + ' KB');
