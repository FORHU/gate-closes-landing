# GateCloses Landing Page

Marketing landing page for GateCloses, a voice-first social app for air travelers (Terminal Echo voice posts at the airport, and private Parallel Soul / Destination Thread / Baton Touch conversations between travelers whose flights line up). The same Next.js app also hosts the staff admin (`/admin`, `/fagc-admin-login`). This context covers the landing page's visual vocabulary.

The landing page is dark-only (`.dark` wrapper in `app/page.tsx`); admin and 404 keep the root theme. Sitewide facts (name, tagline, download link, contact email, nav links) live in `lib/site.ts`. Every product claim in the copy should match shipped behavior in gate-closes-api / gate-closes-app-v2.

## Language

**Section Container**:
The shared outer wrapper (`SectionContainer` in `components/section-container.tsx`) giving every section the Navbar's horizontal rhythm: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`. Horizontal layout only; vertical padding and backgrounds stay section-specific.
_Avoid_: wrapper, layout container

**Hero Scene**:
The layered background of the hero (`HeroScene` in `components/hero/hero-scene.tsx`), back to front: sunset Ambient Video, the Airliner, a near cloud bank, then shade and grain. Scrolling moves the layers at different speeds. Its loops pause while it's off-screen (`data-paused`).

**Airliner**:
The hand-drawn SVG plane in the Hero Scene (`components/hero/airliner.tsx`), in brand livery (lime logo glyph on the tail, lime cheatline), with blinking nav lights. Decorative, `aria-hidden`.
_Avoid_: plane graphic, airplane image

**Ambient Video**:
A decorative looping background clip (`AmbientVideo` in `components/media/ambient-video.tsx`). The poster always renders underneath; the video only mounts on the client, never under reduced motion or Save-Data, and plays only near the viewport. Used by the Hero Scene and the Showcase's window-seat band. Credits in `public/media/CREDITS.md`.

**Parallax**:
The scroll-linked wrapper (`components/motion/parallax.tsx`) that maps scroll progress to `y` (and optionally `opacity`). Still under reduced motion, and on phones when `desktopOnly` is set.

**Phone Mockup**:
The phone bezel (`components/phone-mockup.tsx`) around a coded App Screen. Width comes from the caller; height follows a 9:19.5 ratio.
_Avoid_: device mockup

**App Screen**:
A coded, illustrative preview of an app screen (`ScanScreen`, `ZoneScreen`, `RecordScreen` in `components/how-it-works/app-screens.tsx`) rendered inside a Phone Mockup, sized with container-query units. Purely illustrative, so callers mark them `aria-hidden`.
_Avoid_: screenshot (they're not images)

**Map Badge**:
One of the app's own map badges in `public/badges/` (`terminal-echo`, `parallel-soul`, `destination-thread`, `baton-touch`, `offer`, `cluster`), copied from `gate-closes-app-v2/assets/map_badges`. Each stands for its feature wherever it appears. The match-type colors live as CSS variables in `app/globals.css` (`--parallel-soul` etc.); use them only where they mean their feature.

**Echo Card**:
The Terminal Echo preview in the Features section (`components/features/echo-card.tsx`). Its play button runs a visual-only progress fill over the waveform; there is no audio.

**Route Diagram**:
The Connections illustration (`components/features/route-diagram.tsx`): your flight (SIN to ICN) plus one example arc per match type. Toggle buttons pick which match is highlighted. Geography is schematic, not to scale.

**Offer Card**:
The airport-offer preview in the Features section (`components/features/offer-card.tsx`): "Claim offer" reveals an example code that can be copied. Labelled "Example".

**Get In Touch Card**:
The card in the Contact section (`components/contact/get-in-touch-card.tsx`), split into an Intro Panel (logo, heading, the four feature Map Badges, contact email) and a Contact Form (Name / Email / Message). The form submits through a `mailto:` link and is not wired to gate-closes-api; it uses react-hook-form + zod on purpose (see `docs/adr/0001`).
_Avoid_: Contact section (that's the `<section id="contact">` wrapper)

**Footer**:
The page-closing `<footer>` (`components/footer.tsx`): logo and tagline, link columns that point only at sections on this page, the contact email, copyright and social icons. Social links are `#` until the accounts exist; no legal links until real policy pages ship.
