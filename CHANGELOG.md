# Changelog

SEO/AEO (title, meta description, Open Graph, JSON-LD) is re-checked on every commit with
`node tools/seo-check.mjs`. Each entry notes whether the SEO block changed.

## 0.1.0 – 2026-11-11 – first build
- New static event page: plain HTML/CSS/JS, inline critical CSS, no build step, system fonts only.
- Sections: hero, what's on, two-day programme, Open Mic, Lucknow Ratna Samman, numbers, passes, visit, FAQ.
- Mandatory Times Internet Languages Live logo in header and footer.
- **SEO/AEO written for this page:** title, 70–160 char description, canonical, full OG + Twitter tags,
  `Event` JSON-LD (9–10 Jan 2027, Lucknow, ₹799 / ₹999 offers, two `subEvent` days) and `FAQPage`
  JSON-LD whose questions are all visible on the page.
- Venue deliberately given as "Lucknow" only; no artists named (guest list is unconfirmed).
- Assumed, to confirm: canonical URL `https://timeslanguages.in/shaam-e-awadh/`, share image path,
  `PreOrder` availability while sales are closed, event end time 22:00 IST.

## 0.2.0 – 2026-11-12 – rebuilt to the website brief
- **Dates changed to 16–17 January 2027** (was 9–10). Brief overrides the concept note.
- Rebuilt as the 11-section landing page: hero, about, eight festival verticals, artists (card system, none confirmed), interactive programme (day nav, 7 category filters, add-to-calendar .ics), city editorial, food and craft, Ratna Samman, partners, visit and FAQ, footer.
- Palette changed to the brief: ivory, Awadhi maroon, antique gold (dark grounds only), midnight blue, emerald, charcoal. Jaali pattern and arch frames used sparingly.
- English / Hindi toggle (text swap from `data-hi`). **No Urdu text anywhere** (removed on request).
- **SEO block changed:** title, description, OG/Twitter, Event dates + `subEvent`s, `inLanguage` now `en, hi`, FAQ gained "Where is Shaam-e-Awadh held?" and updated stall wording. `tools/seo-check.mjs` passes.
- Still open: venue (shown as "Lucknow"), ticket/registration link, contacts, sponsor names, artist names, privacy/terms URLs, social links, Hindi copy review by a native editor.

## 0.3.0 – 2026-11-12 – more imagery and motion
- Added 7 photographs (biryani, chikan hoop, Chhota Imambara, Bhool Bhulaiya dusk, tabla, chikankari motif, Residency ruins): two now fill the Zaika and Hunar tiles, five sit in a swipeable photo reel under "Explore". Replaced the weak Bara Imambara frame. All lazy, 500/960 srcset, width/height set, none above the fold.
- Motion (transform/opacity only, below the fold only): staggered scroll reveal with image settle, heading underline draw, Ratna Samman count-up, active-section nav underline, header shadow on scroll, programme filter/day stagger, hero "lights come on" overlay.
- Perf: `content-visibility:auto` on six below-the-fold sections; reveal driven by one throttled scroll check (no libraries). Reduced-motion shows everything instantly.
- SEO block unchanged (no visible-content change to title/description/dates/prices/FAQ). `tools/seo-check.mjs` passes. Footer credits extended for the new photographs.

## 0.3.1 – 2026-11-12 – photographic imagery for all explore cards & cleanup
- Replaced placeholder vector icons on cards 02 (Qissa Lucknow Ka), 05 (Beyond Labels), 06 (The Adda), 07 (Nayi Peedhi, Nayi Awaaz), and 08 (Lucknow Ratna Samman) with tailored, authentic photographic images.
- All eight cards in "Eight experiences, one evening" now have relevant images with responsive 500w/960w srcset, width/height attributes, and lazy loading.
- Removed the redundant horizontal photo reel strip (`.strip` / `.reel`) below the cards.
- SEO block unchanged. `tools/seo-check.mjs` passes.

## 0.4.0 — Hero video
- Hero now has a looping muted background video (`hero.mp4` re-encoded: audio removed, bottom 15% cropped to drop the corner watermark, 6 MB -> 1280w 1.0 MB / 854w 0.5 MB / 480w 0.17 MB, H.264 faststart) in `video/`.
- LCP image is now `video/poster-*.jpg` (first video frame, 480/960/1280w, preloaded). Video attaches after `load`/idle, is skipped on Save-Data, 2G/3G, reduced-motion; pauses off-screen and in hidden tabs; fades in over the poster.
- SEO block (title, description, OG, JSON-LD) unchanged: content did not change. Check passes.

## 0.5.0 — Load screen
- Full-screen chikankari load screen on every load (no storage, so it replays on refresh): arch frame and 8-petal flower draw in, a needle stitches "Shaam e Awadh" as dotted thread that then fills in ivory, then a stitched divider and "LUCKNOW". Inline SVG + CSS, no extra requests (about 4 KB).
- Exits at about 2.9s (or when the page has loaded, whichever is later; hard cap 4.5s; CSS-only fallback if JS fails). Reduced-motion: static, gone in 0.7s. Hero entrance animation now waits for the loader.
- SEO block unchanged (the loader is decorative; `role="img"` label carries the text). Check passes.

## 0.6.0 — Cinematic high-resolution AI imagery replacement
- Replaced all Wikimedia Commons stock photographs across the site with custom, high-resolution cinematic AI-generated imagery:
  - Hero poster & share image (`video/poster-*.jpg`, `share.jpg`, `img/rumi-*.jpg`): Twilight golden-hour architectural capture of Rumi Darwaza with glowing illumination.
  - Section 2 About (`img/imambara-*.jpg`): Grand view of Bara Imambara and Asafi Mosque across lush sunset gardens.
  - Tile 01 Mehfil-e-Shaam (`img/kathak-*.jpg`): Classical Kathak dancer in emerald & antique gold anarkali pirouette with ghungroos.
  - Tile 03 Zaika-e-Awadh (`img/biryani-*.jpg`): Authentic royal Awadhi Dum Mutton Biryani in copper handi with saffron and warq.
  - Tile 04 Hunar-e-Awadh (`img/chikan-*.jpg`): Macro craftsman shot of fine Chikankari shadow-work embroidery on a wooden hoop.
  - Section 6 The City (`img/clock-*.jpg`, `img/gate-*.jpg`): Husainabad Clock Tower illuminated against evening dusk and carved Old Lucknow street gateway.
  - Section 7 Taste & Craft (`img/chaat-*.jpg`, `img/zardozi-*.jpg`): Crisp Lucknow Tokri Chaat basket and royal Zardozi gold zari needlework on velvet.
  - Archive assets (`img/bhool-*.jpg`, `img/tabla-*.jpg`, `img/residency-*.jpg`): Generated cinematic replacements for historical corridors, classical tabla, and British Residency ruins.
- Updated footer attribution to reflect cinematic AI visuals.
- SEO block unchanged. `tools/seo-check.mjs` passes.

## 0.6.0 — Cinematic loader
- Replaced the arch loader with a ~6.3s title sequence (every load): anamorphic light flare, "Times Internet Languages Live presents" credit, 8-frame flipping Lucknow photo montage (tiny tinted stills in `img/m/`, 92 KB total, skipped on Save-Data/2G), a gold particle vortex (canvas) that assembles into the real glyphs of "Shaam-e-Awadh", then flash + shockwave + flare + light sweep as the title lands over a drawing, slowly spinning chikankari rosette; "Grand" and "Lucknow" settle in; camera push-through into the site.
- "Skip intro" button (from 1s) and Esc. Hard cap 9s; no-JS gets a static title for 2.2s; reduced-motion gets a static title for 1.4s. Hero entrance animations are paused until the loader exits.
- SEO block unchanged. Check passes.

## 0.6.1 — Production cleanup
- Removed unused images (old Rumi hero set, 1280w duplicates, photo-strip images not on the page), dead CSS (`.split.rev`, the `--ld` delay plumbing) and an internal design comment.
- Hero poster (new Rumi Darwaza night shot) re-encoded 256 KB -> 112 KB at 1280w (960w 76 KB, 480w 24 KB); its width/height attributes corrected to 1280x714.
- Added `.gitignore`. SEO block unchanged; check passes.
