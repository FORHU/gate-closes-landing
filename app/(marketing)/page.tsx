import { Navbar } from "@/components/navbar"
import { SectionContainer } from "@/components/section-container"
import { HeroSection } from "@/components/hero/hero-section"
import { FeaturesSection } from "@/components/features/features-section"
import { GetInTouchCard } from "@/components/contact/get-in-touch-card"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />

      <section id="home">
        <HeroSection />
      </section>

      <section id="features" className="bg-background">
        <FeaturesSection />
      </section>

      <section
        id="contact"
        className="flex min-h-screen items-center justify-center bg-background pb-16 sm:pb-0"
      >
        <SectionContainer>
          <GetInTouchCard />
        </SectionContainer>
      </section>

      <Footer />
    </>
  )
}
