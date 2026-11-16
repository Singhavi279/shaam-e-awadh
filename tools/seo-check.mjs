// Run before every commit: node tools/seo-check.mjs
// Fails when title / meta / OG / JSON-LD no longer match what the page actually says.
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const errs = [];
const get = (re) => (html.match(re) || [])[1];
const meta = (k, attr = 'name') => get(new RegExp(`<meta ${attr}="${k}" content="([^"]*)"`));
const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const title = get(/<title>([^<]*)<\/title>/);
const desc = meta('description');
if (!title || title.length > 65) errs.push(`title missing or >65 chars (${title?.length})`);
if (!desc || desc.length < 70 || desc.length > 160) errs.push(`description length ${desc?.length} not in 70-160`);
for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) if (!meta(k, 'property')) errs.push(`missing ${k}`);
if (!/<link rel="canonical"/.test(html)) errs.push('missing canonical');
if (!/langlive\.png/.test(body)) errs.push('mandatory Times Internet Languages Live logo missing');

const ld = JSON.parse(get(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/));
const ev = ld['@graph'].find((n) => n['@type'] === 'Event');
const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage');
if (!ev) errs.push('no Event JSON-LD');
else {
  if (!text.includes('16–17 January 2027') || !ev.startDate.startsWith('2027-01-16') || !ev.endDate.startsWith('2027-01-17')) errs.push('dates on page and in Event JSON-LD disagree');
  for (const o of ev.offers) if (!text.includes('₹' + o.price)) errs.push(`price ₹${o.price} in JSON-LD not visible on page`);
  if (!text.includes(ev.location.address.addressLocality)) errs.push('location not on page');
  const low = Math.min(...ev.offers.map((o) => +o.price));
  if (!desc.includes('₹' + low)) errs.push(`meta description should carry the entry price (₹${low})`);
  if (!title.includes('2027') || !title.includes('Jan')) errs.push('title lost the event date');
}
for (const q of faq?.mainEntity ?? []) if (!text.includes(q.name)) errs.push(`FAQ question not visible on page: ${q.name}`);
for (const q of faq?.mainEntity ?? []) if (!text.includes(q.acceptedAnswer.text)) errs.push(`FAQ answer in JSON-LD differs from the visible answer: ${q.name}`);
if (ev && !text.includes(ev.name.replace(' 2027', ''))) errs.push('event name not on page');
if (errs.length) { console.error('SEO CHECK FAILED\n- ' + errs.join('\n- ')); process.exit(1); }
console.log('SEO CHECK OK: title, description, OG, Event + FAQ JSON-LD match the page.');
