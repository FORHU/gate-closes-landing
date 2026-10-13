import { Download } from "lucide-react"
import { Parallax } from "@/components/motion/parallax"
import { PillLink } from "@/components/pill-link"
import { SectionContainer } from "@/components/section-container"
import { site } from "@/lib/site"
import { heroCopy } from "./hero-copy"
import { HeroScene } from "./hero-scene"

export function HeroSection() {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[#120d10]">
      <HeroScene />

      {/* The copy lifts and fades as the hero scrolls away, ahead of the sky behind it. */}
      <Parallax className="relative" y={["0vh", "-12vh"]} opacity={[1, 0]} offset={["start start", "end start"]}>
        <SectionContainer className="flex min-h-dvh flex-col justify-end pt-24 pb-16 sm:pb-24">
          <h1 className="max-w-[12ch] font-display text-[clamp(2.75rem,6.4vw,5.75rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-white animate-fade-up motion-reduce:animate-none">
            {heroCopy.headline}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-white/75 animate-fade-up [animation-delay:150ms] motion-reduce:animate-none sm:text-xl">
            {heroCopy.subheadline}
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up [animation-delay:300ms] motion-reduce:animate-none max-sm:[&>a]:w-full">
            <PillLink href={site.downloadUrl}>
              <Download aria-hidden />
              {site.downloadLabel}
            </PillLink>
            <PillLink href={heroCopy.secondaryCta.href} variant="ghost">
              {heroCopy.secondaryCta.label}
            </PillLink>
          </div>
        </SectionContainer>
      </Parallax>
    </div>
  )
}
