import Image from "next/image"
import { Parallax } from "@/components/motion/parallax"
import { SectionContainer } from "@/components/section-container"

// Unsplash photo (Unsplash License): an airliner at the jet bridge at dusk.
// Credits in public/media/CREDITS.md.
const GATE_PHOTO =
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=2400&q=70"

export function AboutSection() {
  return (
    <SectionContainer className="py-28 sm:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance text-white">
          Every gate is full of people going your way.{" "}
          <span className="text-white/40">Most of them never say a word.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-[38rem] text-lg text-white/65">
          GateCloses gives that waiting time a voice. It works inside the airport, so everyone you hear is
          really there, and your flight connects you to the travelers whose trips cross yours.
        </p>
      </div>

      <div className="relative mt-16 aspect-[4/3] overflow-hidden rounded-[28px] ring-1 ring-white/10 sm:mt-24 sm:aspect-[21/9]">
        {/* The photo is taller than its frame and drifts inside it while the frame scrolls past. */}
        <Parallax className="absolute inset-x-0 -inset-y-[12%]" y={["-8%", "8%"]}>
          <Image
            src={GATE_PHOTO}
            alt="An airliner parked at the gate at dusk, with the jet bridge attached"
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night/60 via-transparent to-transparent" />
      </div>
    </SectionContainer>
  )
}
