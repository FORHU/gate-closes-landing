import { HeroContent } from "./hero-content"
import { HeroShowcase } from "./hero-showcase"

export function HeroSection() {
  return (
    <div className="hero-gradient min-h-dvh overflow-x-hidden pt-16 lg:overflow-hidden rounded-b-2xl">
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:flex lg:min-h-[calc(100dvh-4rem)] lg:flex-col lg:px-8 lg:pb-0">
        <div className="pt-6 sm:pt-8 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:pt-16">
          <HeroContent />
        </div>
        <HeroShowcase />
      </div>
    </div>
  )
}
