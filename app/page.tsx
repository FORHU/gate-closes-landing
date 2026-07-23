import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero/hero-section"

export default function Home() {
  return (
    <>
      <Navbar />

      <section id="home">
        <HeroSection />
      </section>

      <section
        id="features"
        className="flex min-h-screen items-center justify-center bg-background px-4"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Features
          </h2>
          <p className="mt-4 text-zinc-500">Coming soon.</p>
        </div>
      </section>

      <section
        id="faq"
        className="flex min-h-screen items-center justify-center bg-background px-4"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            FAQ
          </h2>
          <p className="mt-4 text-zinc-500">Coming soon.</p>
        </div>
      </section>

      <section
        id="contact"
        className="flex min-h-screen items-center justify-center bg-background px-4"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Contact
          </h2>
          <p className="mt-4 text-zinc-500">Coming soon.</p>
        </div>
      </section>
    </>
  )
}
