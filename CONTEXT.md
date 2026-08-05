# GateCloses Landing Page

Marketing landing page for the GateCloses app (community gate/access management). This context covers the page's visual vocabulary — the terms used for hero-section and features-section layout and components.

## Language

**Section Container**:
The shared outer-wrapper component (`SectionContainer` in `components/section-container.tsx`) used by every top-level page section (Hero, Features, FAQ, Contact) to get the same horizontal margin/max-width rhythm as the Navbar: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`. It governs horizontal layout only — vertical padding, min-height, and backgrounds stay section-specific (e.g. Hero's full-viewport `min-h-dvh`/gradient vs. Features' `py-20` vs. FAQ/Contact's `min-h-screen` centering), since those needs genuinely differ per section.
_Avoid_: wrapper, outer container, layout container

**Hero Showcase**:
The visual composition area beneath the headline/CTA in the hero section (`HeroShowcase` in `components/hero/hero-showcase.tsx`) — contains the phone mockups and floating decorative cards.
_Avoid_: Hero visual, hero graphic

**Phone Mockup**:
One of three stacked phone-frame images (`PhoneMockup`) shown in the Hero Showcase, displaying a screenshot of the GateCloses app. Positioned left/center/right, with center as the focal (largest, highest z-index) phone.
_Avoid_: Phone card, device mockup

**Terminal Echo card**:
One of four decorative floating cards in the Hero Showcase, rendered from the `terminal-echo-{1..4}.svg` assets (dark rounded-rect mockups of terminal/code output). Purely decorative (no informational content, `alt=""`), arranged two per side (top/bottom) flanking the phones, tucked slightly behind them in z-index. Replaced the earlier social-proof card and feature-pill badges.
_Avoid_: Terminal card, code snippet, floating SVG

**Floating Wrapper**:
The shared animation wrapper (`FloatingWrapper` in `hero-showcase.tsx`) used by the Terminal Echo cards. Plays a one-time directional slide-in (from the card's side — left or right) on mount, then hands off into a continuous bobbing `y` animation once the slide-in settles. Disabled under `prefers-reduced-motion` (renders the final resting state with no animation).
_Avoid_: Float animation, bob wrapper

**Feature Map**:
The visual composition area in the Features section — distinct from the Hero Showcase in that its defining trait is Feature Markers landing on it like pins dropped onto a map, anchored around a centered element.
_Avoid_: Feature Showcase, Features visual, Features graphic

**Anchor Phone**:
The centered phone in the Feature Map that the four Feature Markers land around — a Phone Mockup (same bezel frame component as the Hero Showcase) displaying `intro-phone.svg` as its screenshot. "Anchor Phone" names its *role* in the Feature Map (fixed center point everything positions relative to), not a different frame component.
_Avoid_: Feature Phone, intro phone

**Feature Marker**:
One of four map-pin-shaped SVGs (`terminal-echo.svg`, `parallel-soul.svg`, `destination-thread.svg`, `baton-touch.svg` in `public/features/`) that land around the Anchor Phone in the Feature Map, one per corner. Each represents one product feature and carries that feature's title — Terminal Echo, Parallel Soul, Destination Thread, and Baton Touch respectively — making it informational, not decorative.
_Avoid_: Feature Pin, Feature Badge, marker icon

**Feature Badge**:
One of four small icon SVGs (`badge-terminal-echo.svg`, `badge-parallel-soul.svg`, `badge-destination-thread.svg`, `badge-baton-touch.svg` in `public/features/`) — a different asset from the same-named Feature Marker despite the shared `terminal-echo`/etc. root. Originally rendered at `size-6 sm:size-7` next to each feature's eyebrow label in a Stack Card (`card.badge` in `stacking-cards.tsx`). Reused, larger (`size-8 sm:size-10`) and label-less, as a standalone row at the bottom of the Get In Touch Card's Intro Panel — there it reads as a callback to "these are our four features" rather than identifying any one feature.
_Avoid_: Feature Marker (reserved for the Feature Map pins), Feature icon

_Flagged ambiguity_: `public/features/terminal-echo.svg` (a Feature Marker, map-pin shaped), `badge-terminal-echo.svg` (a Feature Badge, small icon), and the Hero Showcase's `terminal-echo-{1..4}.svg` (a Terminal Echo card, dark rounded-rect terminal mockup) are three unrelated assets that all share the `terminal-echo` name root. Don't conflate them.

**Gallery Phone**:
The phone rendered inside each slide of the FeatureShowcase's gallery carousel (`GalleryPhoneMockup` in `components/features/gallery-phone-mockup.tsx`, rendered by `PhoneSlide` in `feature-showcase.tsx`). A standalone bezel component — not the shared `PhoneMockup` used by the Hero Showcase and the Anchor Phone — with no drop shadow, since it sits directly on the dialog/drawer background rather than floating over a gradient. Deliberately not shared code with `PhoneMockup`: a future bezel style change must be applied to both by hand.
_Avoid_: Feature Phone (reserved for Anchor Phone), Slide Phone, Showcase Phone

**Boarding Pass**:
The decorative card (`BoardingPass` in `components/features/boarding-pass.tsx`) rendered in the Features section, below the Feature Map. Styled like an airline boarding pass (dashed perforation with notch cutouts separating a route/flight-code half from a barcode half) for a single fixed flight, with a plane traveling along the route line and a decorative (non-scannable) fake barcode. Purely decorative — continues the same fictional-traveler motif as the Hero Showcase's Terminal Echo cards (reuses the same airports) and is not a literal illustration of a GateCloses feature. On scroll into view it slides up; the Airplane Overlay then flies in on top of it afterward.
_Avoid_: Flight ticket, ticket card

**Airplane Overlay**:
The wide scenic airplane image (`AirplaneOverlay` in `boarding-pass.tsx`, rendering `public/features/airplane-image.svg`) that sits in front of the Boarding Pass, overlapping its top edge. Slides in from the left, delayed until after the Boarding Pass has finished its own slide-up, so it reads as flying in over an already-landed ticket. Purely decorative (`alt=""`), part of the same fictional-traveler motif.
_Avoid_: Airplane banner, plane graphic

**Get In Touch Card**:
The single `Card` rendered in the Contact section (`GetInTouchCard` in `components/contact/get-in-touch-card.tsx`) that replaces the earlier "Coming soon" placeholder. Split into two halves side by side (stacked on small screens): an Intro Panel (left) and a Contact Form (right).
_Avoid_: Contact Card, Contact section (that's the page `<section id="contact">` wrapper — the card is one element inside it)

**Intro Panel**:
The left half of the Get In Touch Card (`IntroPanel`) — no copy, no form fields. Top-left corner holds the same logo + "GateCloses" wordmark pairing as the Navbar (`flex items-center gap-2.5`, `text-theme` on the wordmark); the bottom holds a row of the four Feature Badges. Styled with the same dark `bg-linear-to-br from-zinc-900 to-zinc-800` gradient as a Stack Card, not the lime `bg-theme` accent — chosen to match the Feature Badges' native background so they read the same way they do in `stacking-cards.tsx`. The Get In Touch Card sizes this column to its content (`grid-cols-[auto_1fr]`, the Feature Badge row being the widest element) rather than splitting the card into two equal halves, so the Contact Form gets the remaining space.
_Avoid_: Contact Intro, left panel

**Contact Form**:
The right half of the Get In Touch Card (`ContactForm`) — a "Get In Touch" heading/subheading pair (`text-foreground`/`text-muted-foreground`, matching the Features section's heading style) followed by the Name/Email/Phone/Message fields. Submits via a `mailto:` link (no backend endpoint); not wired to gate-closes-api.
_Avoid_: Get In Touch Form, contact fields

## Example dialogue

**Dev**: "I want to add a fifth image to the hero."
**Domain expert**: "Is it a Phone Mockup showing another app screen, or a Terminal Echo card for decoration?"
**Dev**: "Decoration — just another dark code-snippet visual."
**Domain expert**: "Then it's a Terminal Echo card. Give it a `FloatingWrapper` with a staggered delay, keep it `alt=""`, and place it behind the Phone Mockups in z-index like the other four."

**Dev**: "I'm adding the phone to the features section — is that just another Phone Mockup?"
**Domain expert**: "Same `PhoneMockup` component and bezel, yes — but call it the Anchor Phone when talking about the Feature Map, since that name captures its role there: it's the fixed center point the Feature Markers land around."
**Dev**: "And the four pin icons that land around it — are those Terminal Echo cards, like the Hero's floating decoration?"
**Domain expert**: "Different thing, despite one sharing a filename. Those are Feature Markers — each one is informational, not decorative: it carries a real feature title and pops in with a landing-pin bounce, not a bob."
