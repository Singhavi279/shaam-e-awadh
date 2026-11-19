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

## 0.7.0 — Editorial copy pass (EN + HI)
- Hero, About, "Multiple Expressions, One City" (8 experiences with taglines), Voices of Awadh (profile fields + 6 category filters), Taste/Craft of Awadh, Lucknow Ratna Samman (tiers, fields, "How the honours are decided"), ticket booking flow + essentials, 26-question FAQ in 4 groups, and a new Contact & Help Centre now follow the editorial copy. Every new string has a Hindi (Devanagari, no Urdu script) twin behind the EN/हिन्दी toggle.
- Hero Hindi aligned to the English (no full stop / exclamation); "Shaam Ho Toh Aisi" retired everywhere including og:title and JSON-LD alternateName.
- SEO refreshed: title, description, og/twitter, Event name/description, FAQPage now lists only the questions that have a confirmed answer, and `tools/seo-check.mjs` now also fails if a JSON-LD FAQ answer differs from the visible answer. Check passes.
- Not published: internal notes ("check with Shagun", build instructions such as "Create a grid...") and back-office ticketing items (admin dashboard, staff/vendor accreditation, attendance reporting). FAQ answers the editorial copy did not supply show "These details have not been confirmed yet" rather than invented answers.

## 0.7.1 — Layout
- Ratna Samman moved directly below Artists (header nav reordered to match); its label and heading swapped (EN + HI).
- Removed the "Partners and sponsors / The people behind the evening" section and its now-unused CSS/JS hooks. The organiser credit stays in the footer and the Event JSON-LD. SEO check passes.

## 0.7.2 — Contact team
- Contact & Help Centre now ends with a "Contact / Reach the right team for your query" block: five named contacts (General query, Partnership, Award nomination, Sponsorships, Participation opportunities) with tap-to-call and tap-to-email links, EN + HI labels. Replaces the "details soon" note; FAQ answers and the footer "Sponsorship enquiries" link updated to point at it. SEO block unchanged (check passes).

## 0.7.3 — Taste / Craft split + Partner CTA
- "The Taste and Craft of Awadh" is now two sections: **The Taste of Awadh** (#taste, image left) and **The Craft of Awadh** (#craft, image right), each with its own eyebrow, tagline, description, stall count (EN + HI).
- New maroon "Partner with Grand Shaam-e-Awadh" band below both with a **Partner Now** button that opens an email to the Partnership contact. SEO block unchanged (check passes).

## 0.7.4 — Stall counts removed from Taste/Craft
- Replaced the "About 20 food stalls / About 55 craft stalls" lines and their "Stall counts are approximate…" notes with "Interested in partnering with us?" + ENQUIRE NOW (emails the Partnership contact), EN + HI. The "about 20 food stalls" figure is still inside one FAQ answer (and its JSON-LD twin). SEO check passes.

## 0.8.0 — Early bird pricing, one pass only
- Single ticket: **Two-day pass, early bird ₹499 (was ₹999), limited passes only.** One-day pass (₹799) removed everywhere: pass cards, booking step 1, FAQ ("ticket categories and prices", "Can I attend on one day only?" now answers No), Event offers JSON-LD (one Offer, price 499), meta description, og/twitter descriptions.
- `tools/seo-check.mjs` now reads the entry price from the JSON-LD offers instead of a hard-coded ₹799. Check passes.

## 0.8.1 — Voices of Awadh placeholders
- Voices of Awadh now shows six placeholder profile cards (one per category) with the full structure: photo slot, full name, profession/area of work, one-line contribution, programme/session, date and time (to be confirmed), EN + HI. The six category filters work on them; replacing a placeholder with a real profile only needs the "ghost" class removed and the data-cat kept (template comment in the source). No names are published. SEO check passes.

## 0.8.2 — Contact section trimmed
- Removed the five "Help Centre" category blocks (ticketing, programme, Open Mic, sponsorship, media) from Contact & Help Centre; the heading, intro line and the five named-contact cards stay. FAQ answers that pointed at those categories now point at the named teams. SEO check passes.

## 0.8.3
- Removed the redundant "Contact / Reach the right team for your query" sub-heading above the contact cards. SEO check passes.

## 0.8.4
- FAQ moved out of the Visit section into its own section at the bottom, below Contact & Help Centre (page order: … Visit, Contact, FAQ, Footer). Same 26 questions; SEO check passes.

## 0.8.5
- Removed the footer line "Cinematic AI-generated visuals celebrating Lucknow's heritage…" and its unused style.

## 0.8.6
- Removed from the Visit section: "How booking works" (6 steps), "Ticketing essentials", and the Dates and timings / Venue / Parking and accessibility blocks, plus their now-unused styles. Visit now has the heading, the three "coming soon" buttons and the early bird pass. SEO check passes.

## 0.9.0 — Modal forms, OTP, no stall counts
- Removed the last stall-count mention (FAQ "food and beverages" answer, EN + HI + JSON-LD). No numbers of stalls/booths anywhere on the site.
- Three modal forms (native `<dialog>`, EN + HI, keyboard/Esc/backdrop close, scroll lock, full-screen on phones):
  - **Registration** (header Register, hero Book Tickets, Visit "Register Now"): 2-step stepper. Step 1 details; step 2 **Pay now / Pay later**. Pay later saves the record and shows "form submitted, payment pending, details saved, team will contact you shortly". Pay now shows the early bird pass with a 1–10 quantity stepper and total (₹499 each), then Proceed to checkout.
  - **Award nomination** (new "Nominate now" button in Ratna Samman): same 2-step flow; the nomination fee is not set yet so the total shows "To be confirmed".
  - **Partnership** (both Enquire Now buttons and Partner Now): single step, no stepper, no payment. The mailto links stay as the no-JS fallback.
- **OTP on all three forms**: mobile number must be verified (Send OTP, 4 digits, 30 s resend). Dummy code is **1234** until a real OTP service is configured.
- Wiring is in the `SEA_CONFIG` block of the page script: `endpoint` (store submissions), `checkoutUrl` (payment page), `otpEndpoint` (real OTP), `dummyOtp`. While `endpoint` is empty the forms run in a labelled preview mode and keep records only in the visitor's browser (`SEA.leads()` in the console). Honeypot field for bots. SEO check passes.

## 0.9.1 – 2026-11-17 – ticket quantity, CTA sync, responsive pass
- Ticket cards now have a quantity stepper (1–3 at ₹599, 4–10 at ₹499) with a live total; the card's Buy Tickets
  button opens the registration form with that quantity pre-set. Navbar, hero and sticky-bar Buy Tickets open the same
  form at quantity 1 and the modal's quantity step applies the same tier pricing.
- CTA labels: Buy Tickets / Register for Nomination; navbar and mobile sticky bar carry Buy Tickets and Partner Now.
- OTP auto-verifies while no OTP service is configured; records no longer claim `mobileVerified` in that case.
- Responsive: hero height accounts for the sticky bar, hero title no longer breaks at the hyphen, sticky-bar subtitle
  hidden at 360px and below.
- **SEO/AEO changed:** meta description carries "Passes from ₹499"; Event JSON-LD has two offers (₹599, ₹499); FAQ
  answer (EN and HI, JSON-LD and visible) states both tiers. `tools/seo-check.mjs` now parses multi-line meta tags.

## 0.9.2 – 2026-11-17 – group pass limit
- Group pass is limited to 4–9 passes per purchase (card stepper and the form's quantity step). Pressing + at 9 shows
  "Only 9 passes can be bought at a time. For more than 9 passes, please make a separate purchase." (EN and HI).
- Full responsive audit, widths 320–2560 incl. breakpoint edges: no horizontal overflow, no undersized tap targets.
- SEO/AEO unchanged; `node tools/seo-check.mjs` passes.

## 0.9.3 – 2026-11-17 – city section hidden
- "Lucknow: Beyond the Postcards" (#city) is commented out in index.html, not deleted. SEO/AEO unchanged; seo-check passes.

## 0.9.4 – 2026-11-18 – weekdays and swipe-up loader
- Weekdays added wherever the dates appear: hero (Saturday / Sunday pills), day tabs and day headings, pass cards,
  sticky bar, ticket form header, and the FAQ answers (EN and HI, page and JSON-LD).
- Loader: "Skip intro" replaced by an animated "Swipe up" control. Click, a swipe up (the page follows the finger),
  mouse wheel, arrow keys or Esc all lift the intro away and reveal the site.
- SEO/AEO: FAQ answers now say "Saturday 16 and Sunday 17 January 2027" in both the page and JSON-LD; seo-check passes.

## 0.9.5 – 2026-11-18 – contacts in forms
- All Partner Now and Enquire now buttons open the partnership form (phone-call change reverted).
- Each form shows a contact line in its footer and on the confirmation screen: tickets → Avnish Singh, award nomination → Sagun Kumari, partnership/expo enquiries → Deepika Pawar.
- Contact Us: Award nomination is now Sagun Kumari; Participation opportunities is now Simran Singh. SEO unchanged.
- Ticket form step 2 now shows the same pass cards as the Tickets section (1–3 at ₹599, group 4–9 at ₹499) with steppers, total, Proceed to checkout and a quiet Pay later link, replacing the Pay now / Pay later choice.
- Hero "Explore the Festival" replaced by "Book a Stall", opening the partnership form with "Exhibition participation" preselected.
- Partnership form dropdown: Sponsorship, Exhibition Partner / Booth Space, Food Court Integration, Other; Book a Stall preselects Exhibition Partner / Booth Space.
- Contact Us: "Partnership" card renamed "Booth Space / Partnership".
- Nominee form trimmed to: nominee name, contact email, contact mobile (OTP), nominee type, field of contribution, why honoured. No length limits on the reason (a single "." is accepted); the form is titled "Nominee Enquiry Form".

## 0.9.6 – 2026-11-19 – names, GST, contact
- "Awadh ka Hunar" is now "Uttam Hunar" and "Awadh Ke Sitare" is now "Sitaro ka Sangam" (EN and HI).
- Ticket prices say "+ GST" on the pass cards, in the ticket form and on every total; FAQ answer and meta description updated.
- Contact Us: new Project Management card, Noopur Praveen.
- **SEO/AEO changed:** meta description ends "Passes from ₹499 + GST."; the ticket FAQ answer says "plus GST" (page and JSON-LD).

## 0.9.7 – 2026-11-19 – new logo
- Header and footer now use the new Grand Shaam-e-Awadh logo (`img/logo.webp`, 300×204, ~21 KB, transparent). The 2.4 MB source PNG is no longer shipped. Rendered at 88×60 in the header and 150×102 in the footer.
- `tools/seo-check.mjs` checks for the new logo instead of the Languages Live image. The "A Times Internet Languages Live Initiative" text credit stays in the hero.
- Fixed the desktop sticky bar: the date line and "Lucknow" now sit on one row instead of wrapping.

## 0.9.8 – 2026-11-19 – hero logo and initiative strip
- Hero title is now the event logo (`img/logo-hero.webp`, 620×422, ~48 KB; the `<h1>` carries the name as the image alt text). It scales with viewport width and height so the CTAs stay above the sticky bar on laptops.
- New "An initiative by:" strip above the hero CTAs with the Navbharat Times and Times Internet Languages Live logos at the same height (self-hosted `img/logo-nbt.webp`, `img/logo-ll.webp`, ~15 KB and ~9 KB).
- Removed the hero line "A Times Internet Languages Live Initiative", now covered by the strip.
- SEO/AEO unchanged; seo-check passes.

## 0.9.9 – 2026-11-19 – calmer ticket cards
- Removed the yellow pill on both pass cards. Each card now reads: name, one muted line for the range ("For 1 to 3 passes" / "For 4 to 9 passes · special rate"), price, a single short date line, a divider, then quantity, total and the button. Group card renamed "Group Pass". SEO/AEO unchanged; seo-check passes.
- Pass card date line simplified to "Saturday–Sunday, 16–17 January 2027".
