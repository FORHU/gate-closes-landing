import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <>
      <Navbar />

      <section
        id="home"
        className="flex min-h-screen flex-col items-center justify-center bg-background px-4"
      >
        <div className="absolute -left-50 -bottom-60 h-250 w-250 rounded-full bg-[#BBE40A] opacity-20 blur-3xl" />

        <div className="absolute -right-30 -bottom-60 h-200 w-200 rounded-full bg-[#BBE40A] opacity-50 blur-3xl" />

        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-sinc-900 sm:text-6xl">
          GateCloses
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Your gate to a better experience. Download now and get started.
        </p>
      </section>

      <section
        id="features"
        className="flex min-h-screen items-center justify-center bg-black px-4"
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
