// Builds /openmic/index.html (Open Mic application page) from index.html's CSS, hero and form engine.
// Copy below is from the Open Mic brief: do not edit wording.
import fs from 'node:fs';
const src = fs.readFileSync('index.html', 'utf8');
const between = (a, b) => { const i = src.indexOf(a); const j = src.indexOf(b, i); if (i < 0 || j < 0) throw new Error('missing ' + a); return src.slice(i, j + b.length) };
const css = between('<style>', '</style>');
const svgDefs = between('<svg width="0" height="0"', '</svg>\n');
let hero = between('<section class="hero"', '</section>').replace(/<div class="cta">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/, `<div class="cta">
          <a class="btn gold" href="#apply">Apply for Open Mic</a>
          <a class="btn ghost" href="#eligibility">Eligibility</a>
        </div>
      `);
const footer = between('<footer class="ftr">', '</footer>').replace('href="#about"', 'href="../#about"').replace('href="#programme"', 'href="../#programme"').replace('href="#voices"', 'href="../#voices"').replace('href="#contact"', 'href="#contact"');
let js = between('<script>\n      (function () {\n        var d = document, root', '</script>');
const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b); if (i < 0 || j < 0 || j < i) throw new Error('cut ' + a); return s.slice(0, i) + s.slice(j) };
js = cut(js, '/* programme: day + category filter */', '/* artists: refresh');
js = cut(js, '/* add to calendar', '/* ===== forms');
js = cut(js, '/* artists: refresh', '/* ===== forms');
const OMX = `
        /* open mic: 3-step form, draft, conditional fields, age and duplicate checks */
        (function () {
          var dlg = d.getElementById('m-openmic'); if (!dlg) return;
          var KEY = 'sea-om-draft', tm;
          function g(n) { return dlg.querySelector('[name="' + n + '"]') }
          function age() { var v = g('dob').value; if (!v) return null; var b = new Date(v), n = new Date(), a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a }
          function cur() { var p = $('.pane', dlg).filter(function (x) { return !x.hidden })[0]; return p ? p.getAttribute('data-pane') : '1' }
          function qty() { return g('applicant_type').value === 'Group' ? Math.max(1, parseInt(g('group_size').value, 10) || 1) : 1 }
          function rs(n) { return 'Rs ' + n.toLocaleString('en-IN') }
          function sync() {
            var a = age(), grp = g('applicant_type').value === 'Group', minor = a !== null && a < 18 && a >= 0, adapt = g('original').value === 'Adaptation' || g('original').value === 'No';
            $('[data-cond]', dlg).forEach(function (el) { var k = el.getAttribute('data-cond'); el.hidden = !((k === 'group' && grp) || (k === 'minor' && minor) || (k === 'credit' && adapt)) });
          }
          function note(m) { $('.draftnote', dlg).forEach(function (n) { n.textContent = m }) }
          function snap() { var o = {}; $('input,select,textarea', dlg).forEach(function (el) { if (!el.name || el.name === 'otp_code' || el.name === 'website') return; o[el.name] = el.type === 'checkbox' ? el.checked : el.value }); return o }
          function save(step) { try { localStorage.setItem(KEY, JSON.stringify({ v: snap(), s: step || cur(), t: Date.now() })); note('Draft saved on this device') } catch (x) { } }
          function clear() { try { localStorage.removeItem(KEY) } catch (x) { } }
          function summary() {
            var q = qty(), per = q >= 4 ? 499 : 599, rows = [['Applicant', g('name').value], ['Mobile number', g('mobile').value], ['Email address', g('email').value], ['Applicant type', g('applicant_type').value + (q > 1 ? ' (' + q + ' members)' : '')], ['Category', g('category').value], ['Performance title', g('title').value], ['Language', g('language').value]];
            var box = d.getElementById('o_sum'); box.textContent = '';
            rows.forEach(function (r) { var dt = d.createElement('dt'), dd = d.createElement('dd'); dt.textContent = r[0]; dd.textContent = r[1]; box.appendChild(dt); box.appendChild(dd) });
            d.getElementById('o_fee').textContent = rs(per * q); d.getElementById('o_feed').textContent = rs(per) + '/person × ' + q + (q === 1 ? ' (solo entry)' : q >= 4 ? ' (group of 4 or more)' : ' (group of fewer than 4)');
          }
          dlg.addEventListener('input', function () { sync(); clearTimeout(tm); tm = setTimeout(function () { if (cur() !== 'res') save() }, 600) });
          dlg.addEventListener('change', sync);
          dlg.addEventListener('click', function (e) {
            var b = e.target.closest('button'); if (!b) return;
            if (b.hasAttribute('data-go')) { if (!validate(dlg)) return; var s = b.getAttribute('data-go'); if (s === '3') summary(); save(s); setPane(dlg, s) }
            else if (b.hasAttribute('data-restart')) { clear(); resetDlg(dlg); sync(); note(''); $('[data-restart]', dlg).forEach(function (x) { x.hidden = true }) }
            else if (b.hasAttribute('data-final')) {
              if (!validate(dlg)) return; var st = dlg._s; st.qty = qty();
              submit(dlg, 'checkout_started', 'ord').then(function (ok) {
                if (!ok) return; clear();
                if (SEA_CONFIG.checkoutUrl) { var u = SEA_CONFIG.checkoutUrl; location.href = u + (u.indexOf('?') > -1 ? '&' : '?') + 'ref=' + encodeURIComponent(st.rec.id) + '&product=openmic&qty=' + st.qty; return }
                showRes(dlg);
              });
            }
          });
          window.__omx = function () {
            var ok = true, a = age(), dob = g('dob'), m = g('mobile'), e = g('email'), first = null, grp = g('applicant_type').value === 'Group';
            if (a !== null && a < 16) { setErr(dob, 'Applicants must be 16 years or older.'); ok = false; first = dob }
            if (grp && cur() === '1' && !(parseInt(g('group_size').value, 10) >= 2)) { setErr(g('group_size'), 'Enter the number of group members (at least 2).'); ok = false; first = first || g('group_size') }
            try {
              var all = JSON.parse(localStorage.getItem('sea-leads') || '[]').filter(function (r) { return r.type === 'openmic' });
              var dup = all.some(function (r) { return r.fields && (r.fields.mobile === m.value.trim() || (r.fields.email || '').toLowerCase() === e.value.trim().toLowerCase()) });
              if (dup) { setErr(m, 'An application has already been submitted with this mobile number or email. Only one application per person is allowed.'); ok = false; first = first || m }
            } catch (x) { }
            if (first && cur() === '1') first.focus(); return ok;
          };
          try {
            var dr = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (dr && dr.v) {
              Object.keys(dr.v).forEach(function (k) { var el = g(k); if (!el) return; if (el.type === 'checkbox') el.checked = !!dr.v[k]; else el.value = dr.v[k] });
              sync(); dlg._quiet = true; if (dr.s === '2' || dr.s === '3') { if (dr.s === '3') summary(); setPane(dlg, dr.s) } dlg._quiet = false;
              note('Draft restored'); $('[data-restart]', dlg).forEach(function (x) { x.hidden = false });
            }
          } catch (x) { }
        })();`;

const rep = (a, b) => { if (!js.includes(a)) throw new Error('patch ' + a); js = js.replace(a, b) };
rep("var v = el.value.trim(), r =", "var v = el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value.trim(), r =");
rep("$('.mdl').forEach(wire);", `$('.mdl').forEach(wire);
        $('.mdl.inl').forEach(function (dlg) { dlg._quiet = true; resetDlg(dlg); dlg._quiet = false });
        ` + OMX);
rep("if (f) setTimeout(function () { f.focus() }, 30);", "if (dlg._quiet) { dlg.scrollTop = 0; return } if (f) setTimeout(function () { f.focus() }, 30);");
rep("function closeDlg(dlg) {", "function closeDlg(dlg) {\n          if (dlg.classList.contains('inl')) { resetDlg(dlg); return }");
rep("if (ok && !st.verified) {", "if (window.__omx && !window.__omx()) ok = false;\n          if (ok && !st.verified) {");
rep("$('.pane[data-pane=\"1\"] [data-v]', dlg).forEach(function (el) {", "$('.pane:not([hidden]) [data-v]', dlg).forEach(function (el) {\n            if (el.closest('[data-cond][hidden]')) { setErr(el, ''); return }");
rep("nomination: { max: 10, price: null, name: 'Award nomination' }", "nomination: { max: 10, price: null, name: 'Award nomination' },\n          openmic: { max: 50, price: function (q) { return q >= 4 ? 499 : 599 }, name: 'Open Mic application' }");
rep("$('input,select,textarea', q1('.pane[data-pane=\"1\"]', dlg))", "$('input,select,textarea', dlg)");
rep("var n = name === '1' ? 1 : name === 'res' ? 3 : 2;", "var n = name === 'res' ? 4 : +name;");
js = js.replace(/Math\.min\(n, 2\) && n < 3/g, 'n && n < 4').replace('i + 1 < n || n === 3', 'i + 1 < n || n === 4');

const esc = s => s.replace(/&/g, '&amp;');
const kv = rows => `<div class="kv">${rows.map(r => `<div class="kvc"><p class="k">${r[0]}</p><p class="v">${r[1]}</p></div>`).join('')}</div>`;
const ck = (a, cls) => `<ul class="ck ${cls || ''}">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const chips = a => `<ul class="chips2">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const steps = a => `<ol class="stepsg">${a.map((x, i) => `<li><b>${i + 1}</b><span>${x}</span></li>`).join('')}</ol>`;
const note = (t, label) => `<aside class="callout">${label ? `<h3>${label}</h3>` : ''}<p>${t}</p></aside>`;
const sec = (id, cls, inner) => `<section id="${id}" class="${cls}" aria-labelledby="${id}-h"><div class="wrap ow">${inner}</div></section>`;
const h2 = (id, t) => `<h2 id="${id}-h">${t}</h2>`;

const eligibility = kv([
  ['Age', '16 years and above'], ['Applications per person', 'One only'], ['Guardian consent', 'Mandatory for applicants below 18 years'],
  ['Location', 'Open across Uttar Pradesh; priority may be given to Lucknow-based applicants'],
  ['Participation', 'Individual or group entries (charges applicable per person)'],
  ['Languages', 'Hindi, Urdu, Awadhi or a mix'],
  ['Categories', 'Poetry, spoken word, music, storytelling, comedy, dance or theatre'],
  ['Originality', 'Original work preferred; covers or adaptations must be declared'],
  ['Content', 'Must be suitable for a family-oriented public event']
]);
const fee = `<p class="cap">Standard applicant</p><div class="prices">
  <div class="pc"><p class="pl">Solo entry</p><p class="pv">Rs 599<small>/person</small></p></div>
  <div class="pc best"><p class="pl">Group entry of 4 or more</p><p class="pv">Rs 499<small>/person</small></p></div></div>`;
const inc = ['Review of the submitted performance video.', 'Evaluation by the Shaam-e-Awadh editorial and jury panel.', 'Consideration for a main-stage performance slot.', 'Communication regarding application status.', 'Access to the Open Mic application process.', 'Festival entry ticket.'];
const exc = ['Guaranteed selection.', 'Guaranteed performance slot.', 'Travel, accommodation, meals or local transport.', 'Professional recording, editing or promotion.', 'Prize, cash award or future performance commitment.'];
const stg = (n, t, intro, body) => `<article class="stg"><p class="sn">${n}</p><h3>${t}</h3>${intro ? `<p>${intro}</p>` : ''}${body || ''}</article>`;
const sel = `<div class="stgs">
  ${stg('Stage 1', 'Eligibility screening', 'The editorial or events team checks:', chips(['Age eligibility.', 'Complete submission.', 'Acceptable video length.', 'Correct category.', 'Content suitability.', 'Availability for the festival dates.', 'Duplicate or multiple entries.']))}
  ${stg('Stage 2', 'Editorial longlist', 'The editorial and curation team prepares a longlist based on:', chips(['Originality.', 'Clarity of expression.', 'Cultural relevance.', 'Stage readiness.', 'Emotional or intellectual impact.', 'Diversity of voices, languages and formats.', 'Suitability for a live, family-oriented audience.']))}
  ${stg('Stage 3', 'Jury review', 'An internal jury reviews the longlist and scores each entry independently.', '')}
  ${stg('Stage 4', 'Final selection', 'Up to 20 participants will be selected across the two days.', `<div class="days"><div><p class="dn">10</p><h4>Day 1: Lucknow Ki Virasat</h4><p>Poetry, storytelling, folk, classical and heritage-rooted work</p></div><div><p class="dn">10</p><h4>Day 2: Lucknow Ka Kal</h4><p>Contemporary music, spoken word, youth voices, comedy and new expression</p></div></div>`)}
</div>`;
const fmtRows = [['Reporting and briefing', '30 minutes before slot'], ['Stage introduction', '1 minute'], ['Performance', '4–6 minutes'], ['Transition', '1 minute'], ['Total stage time', '6–8 minutes']];
const fmt = `<ol class="tl">${fmtRows.map((r, i) => `<li${i === 4 ? ' class="tot"' : ''}><p class="tk">${r[0]}</p><p class="tv">${r[1]}</p></li>`).join('')}</ol>` + note('The exact slot duration will be finalised after the full programme is locked.');
const rules = ['One microphone and basic backing-track support, where required.', 'No live band unless specifically approved.', 'No fire, smoke, sharp objects, hazardous props or unapproved pyrotechnics.', 'No political campaigning, hate speech, obscenity, defamation or communally sensitive content.', 'No unapproved brand promotion or product placement.', 'Performers must follow stage-manager cues and time limits.', 'The organiser reserves the right to stop a performance that violates safety, content or time requirements.'];
const onb = ['Confirm acceptance within the stated deadline.', 'Submit final performance title and description.', 'Submit final audio or backing track, if applicable.', 'Submit technical requirements.', 'Submit high-resolution photographs.', 'Sign participant agreement.', 'Attend briefing.', 'Attend rehearsal, if required.', 'Report at the assigned time on the performance day.'];
const rights = ['Recording of their performance.', 'Use of performance clips, photographs and excerpts across Shaam-e-Awadh, Navbharat Times and Times Internet Languages Live platforms.', 'Editorial and promotional use, subject to the organiser’s content standards.', 'No guarantee of publication, broadcast or monetisation.', 'The organiser’s right to edit, withhold or remove content that violates editorial, legal or safety standards.'];
const guard = ['One application per applicant.', 'No application is considered submitted until payment is successful.', 'No guarantee of selection or performance slot.', 'No guarantee of media coverage, recording or prize.', 'No unapproved political, religious, obscene or inflammatory content.', 'No last-minute changes to performance content without approval.', 'No unapproved props, instruments, equipment or accompanying persons.', 'The organiser reserves the right to modify the format, slot duration or selection number based on programme and operational requirements.'];
const tiles = a => `<ul class="tiles2">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const contacts = [['Simran Singh', '+91 7838788554', 'simran1@timesinternet.in'], ['Noopur Praveen', '+91 9480808811', 'noopur.praveen@timesinternet.in']];

const fld = (id, label, name, type, v, extra = '', req = true) => `<div class="fld"><label for="${id}"><span>${label}</span>${req ? ' <i aria-hidden="true">*</i>' : ' <small>(optional)</small>'}</label>
          <input id="${id}" name="${name}" type="${type}" ${v ? `data-v="${v}"` : ''} ${extra}>
          <p class="err" id="${id}-e" hidden></p></div>`;
const sel2 = (id, label, name, opts, req = true) => `<div class="fld"><label for="${id}"><span>${label}</span>${req ? ' <i aria-hidden="true">*</i>' : ''}</label>
          <select id="${id}" name="${name}" ${req ? 'data-v="req"' : ''}><option value="">Select…</option>${opts.map(o => `<option>${o}</option>`).join('')}</select><p class="err" id="${id}-e" hidden></p></div>`;
const form = `<dialog class="mdl inl" open id="m-openmic" data-type="openmic" aria-labelledby="m-openmic-t">
    <form novalidate>
      <header class="mh"><div>
        <h2 id="m-openmic-t">Open Mic Application</h2>
        <p class="msub">Rs 599/person for solo entry, 499 for group entry of 4 or more. One application per person.</p>
      </div></header>
      <ol class="stp" aria-label="Progress">
        <li class="on" aria-current="step"><span>1</span><b>Applicant details</b></li>
        <li><span>2</span><b>Performance details</b></li>
        <li><span>3</span><b>Payment and submit</b></li>
      </ol>
      <section class="pane" data-pane="1">
        ${fld('o_name', 'Full name', 'name', 'text', 'req', 'autocomplete="name"')}
        ${fld('o_dob', 'Date of birth', 'dob', 'date', 'req')}
        ${fld('o_mobile', 'Mobile number', 'mobile', 'tel', 'req tel', 'autocomplete="tel" inputmode="numeric"')}
        <div class="otp" data-mobile="o_mobile">
          <button type="button" class="btn ghost sm" data-otp="send">Send OTP</button>
          <div class="otp-box" hidden><label for="o_otp"><span>Enter the 4-digit OTP</span></label>
            <div class="otp-row"><input id="o_otp" name="otp_code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]*"><button type="button" class="btn sm" data-otp="verify">Verify</button></div></div>
          <p class="otp-msg" role="status" aria-live="polite" hidden></p>
        </div>
        ${fld('o_email', 'Email address', 'email', 'email', 'req email', 'autocomplete="email"')}
        ${fld('o_city', 'City', 'city', 'text', 'req', 'autocomplete="address-level2"')}
        ${fld('o_state', 'State', 'state', 'text', 'req', 'value="Uttar Pradesh" autocomplete="address-level1"')}
        ${fld('o_occ', 'Occupation or institution', 'occupation', 'text', '', '', false)}
        ${fld('o_social', 'Social-media handle', 'social_handle', 'text', '', '', false)}
        ${sel2('o_type', 'Applicant type', 'applicant_type', ['Individual', 'Group'])}
        <div data-cond="group" hidden>
          ${fld('o_gsize', 'Number of group members', 'group_size', 'number', 'req', 'min="2" max="50" inputmode="numeric"')}
          <div class="fld"><label for="o_group"><span>Group members</span> <i aria-hidden="true">*</i></label>
          <textarea id="o_group" name="group_members" rows="3" data-v="req"></textarea><p class="err" id="o_group-e" hidden></p></div></div>
        <div data-cond="minor" hidden>
          ${fld('o_gname', 'Guardian name', 'guardian_name', 'text', 'req')}
          ${fld('o_gmob', 'Guardian mobile number', 'guardian_mobile', 'tel', 'req tel', 'inputmode="numeric"')}
          ${fld('o_gcons', 'Guardian consent (link to PDF, JPG or PNG with open access to view)', 'guardian_consent_link', 'url', 'req')}
        </div>
        <div class="act"><button type="button" class="btn gold" data-go="2">Save and next</button></div>
        <p class="draftnote" role="status"></p>
        <p class="mft">Need help? Call <a href="tel:+917838788554">Simran Singh · +91 7838788554</a> <button type="button" class="lnk" data-restart hidden>Start over</button></p>
      </section>
      <section class="pane" data-pane="2" hidden>
        ${sel2('o_cat', 'Performance category', 'category', ['Poetry', 'Spoken word', 'Music', 'Storytelling', 'Comedy', 'Dance', 'Theatre'])}
        ${fld('o_title', 'Performance title', 'title', 'text', 'req')}
        ${sel2('o_lang', 'Language', 'language', ['Hindi', 'Urdu', 'Awadhi', 'Mixed'])}
        ${fld('o_dur', 'Performance duration (2–4 minutes recommended)', 'duration', 'text', 'req', 'placeholder="e.g. 3 minutes"')}
        ${sel2('o_orig', 'Is the work original?', 'original', ['Yes', 'No', 'Adaptation'])}
        <div data-cond="credit" hidden>${fld('o_credit', 'Credit original creator', 'original_creator', 'text', 'req')}</div>
        <div class="fld"><label for="o_desc"><span>Short description</span> <i aria-hidden="true">*</i></label>
          <textarea id="o_desc" name="description" rows="4" maxlength="500" data-v="req"></textarea><p class="err" id="o_desc-e" hidden></p></div>
        ${fld('o_video', 'Performance video (YouTube unlisted URL or Google Drive URL with open access to view, 2–4 minutes)', 'video_url', 'url', 'req')}
        ${fld('o_photo', 'Performer photograph (link, JPG or PNG)', 'photo_url', 'url', 'req')}
        ${fld('o_links', 'Supporting links (Instagram, YouTube, previous work)', 'supporting_links', 'text', '', '', false)}
        <p class="hint2">The video may be recorded on a phone. Production quality will not be the primary selection criterion.</p>
        <div class="act"><button type="button" class="lnk" data-back="1">← Back</button><button type="button" class="btn gold" data-go="3">Save and next</button></div>
        <p class="draftnote" role="status"></p>
      </section>
      <section class="pane" data-pane="3" hidden>
        <h3 class="fs">Application summary</h3>
        <dl class="sum" id="o_sum"></dl>
        <div class="feebox"><div><p class="fk">Application fee</p><p class="fd" id="o_feed"></p></div><p class="ft" id="o_fee"></p></div>
        <label class="chk"><input type="checkbox" id="o_tc" name="consent_terms" data-v="req"><span>I agree to the <a href="https://timeslanguages.in/termsandconditions" target="_blank" rel="noopener">Terms and Conditions</a>, <a href="https://timeslanguages.in/privacypolicy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="https://timeslanguages.in/cancellationpolicy" target="_blank" rel="noopener">Cancellation Policy</a>. The application fee is non-refundable once the application has been successfully submitted.</span></label>
        <p class="err" id="o_tc-e" hidden></p>
        <label class="chk"><input type="checkbox" id="o_rt" name="consent_rights" data-v="req"><span>I consent to the recording of my performance and the use of performance clips, photographs and excerpts across Shaam-e-Awadh, Navbharat Times and Times Internet Languages Live platforms, subject to the organiser’s content standards.</span></label>
        <p class="err" id="o_rt-e" hidden></p>
        <label class="chk"><input type="checkbox" name="consent_contact"><span>I agree to be contacted by email and on my contact number (including WhatsApp) about my application.</span></label>
        <div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>
        <div class="act"><button type="button" class="lnk" data-back="2">← Back</button><button type="button" class="btn gold" data-final>Submit and pay</button></div>
        <p class="draftnote" role="status"></p>
      </section>
      <section class="pane res" data-pane="res" hidden>
        <div class="tick" aria-hidden="true">✓</div>
        <h3 class="res-t" tabindex="-1"></h3><p class="res-b"></p><p class="res-ref"></p>
        <p class="res-c">For any questions, call <a href="tel:+917838788554">Simran Singh · +91 7838788554</a></p>
      </section>
      <p class="fail" role="alert" hidden></p>
    </form>
  </dialog>`;

const extraCss = `
  <style>
    :root{--sbar-h:69px}
    html{scroll-behavior:smooth}
    section[id]{scroll-margin-top:calc(var(--hdr) + 8px)}
    .hdr .nav{gap:10px}.hdr .nav .btn{white-space:nowrap}
    .ow{max-width:960px}.ow section,.ow>h3,.ow h3{margin-top:26px;font-size:1.25rem}
    .ow p{margin-top:12px;line-height:1.7}
    .tw{overflow-x:auto;margin-top:18px}
    /*tbl*/.tbl{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden}
    .tbl th,.tbl td{padding:14px 18px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
    .tbl thead th{background:var(--emerald);color:#fff;font-weight:600}
    .tbl tbody th{font-weight:600;white-space:nowrap}
    .bl,.nl{margin:14px 0 0;padding-left:1.3em;display:grid;gap:8px;line-height:1.6}
    .two{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:8px}
    .two>div{padding:22px 24px;border:1px solid var(--line);border-radius:16px;background:#fff}
    .two h3{margin-top:0}
    .dark .tbl{color:var(--ink)}
    .mdl.inl{position:static;display:block;margin:0 auto;width:min(720px,100%);max-height:none;overflow:visible;animation:none;box-shadow:0 24px 60px -30px #0007;border:1px solid var(--line)}
    .mdl.inl .res [data-close]{display:none!important}
    .fs{margin:26px 0 4px;font-size:1.15rem;color:var(--maroon,#6b1a2a)}
    .hint2{margin-top:14px;font-size:.92rem;color:var(--muted)}
    #apply{padding:clamp(40px,6vw,72px) 0}
    .crows .crow{grid-template-columns:1fr 1fr;gap:12px 48px}
    @media (max-width:700px){.crows .crow,.two{grid-template-columns:1fr}.tbl th,.tbl td{padding:10px 12px}.tbl tbody th{white-space:normal}}
    @media (max-width:600px){.mdl.inl{width:100%;height:auto;max-height:none;border-radius:18px}}
    
    .cap{font:600 .8rem var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:22px}
    .kv{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
    .kvc{padding:18px 20px;background:#fff;border:1px solid var(--line);border-radius:14px}
    .kvc:nth-child(-n+3){background:var(--emerald);border-color:var(--emerald);color:#f2ecdc}
    .kvc:nth-child(-n+3) .k{color:var(--gold)}
    .kvc .k{font:600 .75rem var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--maroon,#6b1a2a);margin:0}
    .kvc .v{margin:8px 0 0;font-size:1.05rem;line-height:1.5}
    .prices{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:10px}
    .pc{padding:26px 28px;border:2px solid var(--line);border-radius:16px;background:#fff}
    .pc.best{background:var(--emerald);border-color:var(--emerald);color:#f2ecdc;box-shadow:0 12px 28px -10px rgba(31,92,74,.4)}
    .pl{font:600 .9rem var(--sans);margin:0;opacity:.85}
    .pv{font:700 2.8rem/1.1 var(--serif);margin:8px 0 0}.pv small{font:500 1rem var(--sans);margin-left:4px;opacity:.85}
    .two{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px}
    .two>div{padding:24px 26px;border-radius:16px;border:1px solid var(--line);background:#fff}
    .two h3{margin:0 0 6px;font-size:1.2rem}
    .two .yes{border-top:4px solid var(--emerald)}.two .no{border-top:4px solid var(--maroon,#6b1a2a)}
    .ck{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:10px}
    .ck li{position:relative;padding-left:28px;line-height:1.55}
    .ck li::before{content:"✓";position:absolute;left:0;top:0;color:var(--emerald);font-weight:700}
    .ck.x li::before{content:"✕";color:var(--maroon,#6b1a2a)}
    .callout{margin-top:22px;padding:18px 22px;border-left:5px solid var(--gold);background:#fff;border-radius:0 12px 12px 0;border-top:1px solid var(--line);border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
    .callout h3{margin:0 0 4px;font-size:1.1rem}.callout p{margin:0}
    .stgs{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:24px}
    .stg{padding:24px;background:#fff;border:1px solid var(--line);border-radius:16px}
    .stg h3{margin:4px 0 8px;font-size:1.3rem}.stg>p{margin-top:6px}
    .sn{display:inline-block;margin:0;padding:4px 12px;border-radius:999px;background:var(--maroon,#6b1a2a);color:#fff;font:600 .75rem var(--sans);letter-spacing:.1em;text-transform:uppercase}
    .chips2{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
    .chips2 li{padding:6px 12px;border-radius:999px;background:var(--parch,#f0e6cf);border:1px solid var(--line);font-size:.9rem}
    .days{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
    .days>div{padding:16px;border-radius:12px;background:var(--emerald);color:#f2ecdc}
    .days h4{margin:4px 0;font-size:1rem}.days p{margin:0;font-size:.9rem}.days .dn{font:700 2rem/1 var(--serif);color:var(--gold)}
    .tl{list-style:none;margin:24px 0 0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
    .tl li{padding:18px;background:#fff;border:1px solid var(--line);border-radius:14px;border-top:4px solid var(--gold)}
    .tl .tk{margin:0;font:600 .85rem var(--sans);color:var(--muted)}.tl .tv{margin:8px 0 0;font:700 1.25rem/1.3 var(--serif)}
    .tl .tot{background:var(--emerald);border-color:var(--emerald);color:#f2ecdc}.tl .tot .tk{color:var(--gold)}
    .tiles2{list-style:none;margin:16px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    .tiles2 li{padding:16px 18px 16px 48px;position:relative;background:#fff;border:1px solid var(--line);border-radius:12px;line-height:1.5}
    .tiles2 li::before{content:"";position:absolute;left:18px;top:21px;width:14px;height:14px;border-radius:50%;background:var(--gold)}
    .tiles2.no li::before{background:var(--maroon,#6b1a2a)}
    .stepsg{list-style:none;margin:16px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;counter-reset:s}
    .stepsg li{display:flex;gap:14px;align-items:flex-start;padding:16px;background:#fff;border:1px solid var(--line);border-radius:12px}
    .stepsg b{flex:none;width:32px;height:32px;border-radius:50%;background:var(--emerald);color:#fff;display:grid;place-items:center;font:700 .95rem var(--serif)}
    .ow h3.sub{margin-top:34px;font-size:1.3rem}
    .stp li{font-size:.85rem}
    .draftnote{margin-top:10px;font-size:.85rem;color:var(--emerald);min-height:1.2em}
    .sum{display:grid;grid-template-columns:max-content 1fr;gap:8px 20px;margin:10px 0 18px;padding:18px;background:#fff;border:1px solid var(--line);border-radius:12px}
    .sum dt{color:var(--muted);font-size:.9rem}.sum dd{margin:0;font-weight:600;word-break:break-word}
    .feebox{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 20px;border-radius:12px;background:var(--emerald);color:#f2ecdc;margin-bottom:14px}
    .feebox .fk{margin:0;font:600 .8rem var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}.feebox .fd{margin:4px 0 0;font-size:.95rem}.feebox .ft{margin:0;font:700 2rem var(--serif)}
    @media (max-width:820px){.kv,.tl{grid-template-columns:repeat(2,1fr)}.stepsg{grid-template-columns:1fr 1fr}}
    @media (max-width:700px){.kv,.tl,.prices,.two,.stgs,.days,.tiles2,.stepsg{grid-template-columns:1fr}.stp li b{font-size:.72rem}.stp{gap:6px}.stp li{gap:6px}}
  </style>`;

const links = [['eligibility', 'Eligibility'], ['fee', 'Application fee'], ['selection', 'Selection process'], ['stage', 'Performance format'], ['apply', 'Apply'], ['contact', 'Contact Us']];
const title = 'Shaam-e-Awadh Open Mic: Apply to Perform, Lucknow 2027';
const desc = 'Apply for the Shaam-e-Awadh Open Mic: poetry, spoken word, music, storytelling, comedy, dance or theatre on the main stage, 16–17 January 2027, Lucknow.';
let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://timeslanguages.in/shaam-e-awadh/openmic/">
  <meta name="theme-color" content="#f7f0df">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Times Internet Languages Live">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://timeslanguages.in/shaam-e-awadh/openmic/">
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
      <a class="btn" href="#apply">Apply for Open Mic</a>
    </nav>
  </div></header>
  <main id="main">
    ${hero}
    ${sec('eligibility', 'parch', `<p class="eyebrow">Shaam-e-Awadh Open Mic</p>${h2('eligibility', 'Eligibility')}${eligibility}`)}
    ${sec('fee', '', `${h2('fee', 'Application fee')}${fee}
      <div class="two"><div class="yes"><h3>What the fee includes</h3>${ck(inc)}</div><div class="no"><h3>What the fee does not include</h3>${ck(exc, 'x')}</div></div>
      ${note('The application fee is non-refundable once the application has been successfully submitted.', 'Refund policy')}`)}
    ${sec('selection', 'parch', `${h2('selection', 'Selection process')}${sel}`)}
    ${sec('stage', '', `${h2('stage', 'Performance format')}${fmt}<h3 class="sub">Stage rules</h3>${tiles(rules)}<h3 class="sub">Onboarding selected participants</h3><p>Selected participants must complete the following:</p>${steps(onb)}`)}
    ${sec('rights', 'parch', `${h2('rights', 'Content, recording and rights')}<p>Participants consent to:</p>${ck(rights)}<h3 class="sub">Guardrails</h3>${tiles(guard).replace('tiles2', 'tiles2 no')}`)}
    <section id="apply" aria-labelledby="m-openmic-t"><div class="wrap">
      ${form}
    </div></section>
    <section id="contact" class="parch" aria-labelledby="con-h"><div class="wrap">
      <h2 id="con-h">Contact Us</h2>
      <div class="crows"><article class="crow crow2">${contacts.map(c => `<div class="cr-p"><div class="cp"><p class="who">${c[0]}</p><a href="tel:${c[1].replace(/ /g, '')}">${c[1]}</a><a href="mailto:${c[2]}">${c[2]}</a></div></div>`).join('')}</article></div>
    </div></section>
  </main>
  ${footer}
  <div class="sbar" role="region" aria-label="Quick actions">
    <div class="sbar-info"><strong>Grand Shaam-e-Awadh</strong><span>Sat–Sun · 16–17 Jan 2027</span><span class="lk"> · Lucknow</span></div>
    <div class="sbar-cta"><a class="btn" href="#apply">Apply for Open Mic</a></div>
  </div>
  ${js}
</body>
</html>
`;
html = html.replace(/(src|href|srcset)="(img|video)\//g, '$1="../$2/').replace(/(\d+w, )(video)\//g, '$1../$2/').replace(/'video\/hero-/g, "'../video/hero-");
html = html.replace(/class="cv /g, 'class="');
fs.mkdirSync('openmic', { recursive: true });
fs.writeFileSync('openmic/index.html', html);
console.log('openmic/index.html', (html.length / 1024).toFixed(0) + ' KB');
