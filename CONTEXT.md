# GateCloses Landing Page

Marketing landing page for the GateCloses app (community gate/access management). This context covers the page's visual vocabulary — the terms used for hero-section layout and components.

## Language

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
The shared animation wrapper (`FloatingWrapper` in `hero-showcase.tsx`) that applies a bobbing `y` animation (disabled under `prefers-reduced-motion`) to any child. Used by the Terminal Echo cards.
_Avoid_: Float animation, bob wrapper

## Example dialogue

**Dev**: "I want to add a fifth image to the hero."
**Domain expert**: "Is it a Phone Mockup showing another app screen, or a Terminal Echo card for decoration?"
**Dev**: "Decoration — just another dark code-snippet visual."
**Domain expert**: "Then it's a Terminal Echo card. Give it a `FloatingWrapper` with a staggered delay, keep it `alt=""`, and place it behind the Phone Mockups in z-index like the other four."
