import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { SectionContainer } from "@/components/section-container"
import { HeroSection } from "@/components/hero/hero-section"
import { AboutSection } from "@/components/about/about-section"
import { HowItWorksSection } from "@/components/how-it-works/how-it-works-section"
import { FeaturesSection } from "@/components/features/features-section"
import { ShowcaseSection } from "@/components/showcase/showcase-section"
import { CtaSection } from "@/components/cta/cta-section"
import { GetInTouchCard } from "@/components/contact/get-in-touch-card"
import { Footer } from "@/components/footer"
import { dmMono, plusJakarta } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "GateCloses: say hello before the gate closes",
  description:
    "A voice-first social app for air travelers. Hear what's happening at your airport, and talk with people flying your route.",
}

// The landing page is dark-only by design (dusk direction, matching the app's
// dark-first theme). `.dark` here scopes the shadcn tokens without touching
// the root layout, so admin and 404 are unaffected.
export default function Home() {
  return (
    <div
      className={cn(
        "dark flex min-h-dvh flex-col overflow-x-clip bg-night font-display text-white scheme-dark [&_section]:scroll-mt-18",
        plusJakarta.variable,
        dmMono.variable
      )}
    >
      <Navbar />

      <main>
        <section id="home">
          <HeroSection />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="how-it-works" className="bg-linear-to-b from-night via-night-raised to-night">
          <HowItWorksSection />
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="showcase">
          <ShowcaseSection />
        </section>

        <section aria-label="Get the app">
          <CtaSection />
        </section>

        <section id="contact" className="pt-6 pb-24 sm:pb-32">
          <SectionContainer>
            <GetInTouchCard />
          </SectionContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
