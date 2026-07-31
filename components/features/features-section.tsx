import { SectionContainer } from "@/components/section-container"
import { featuresCopy } from "./features-copy"
import { FeatureMap } from "./feature-map"
import { BoardingPass } from "./boarding-pass"
import { StackingCards } from "./stacking-cards"

export function FeaturesSection() {
  return (
    <SectionContainer className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {featuresCopy.heading}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {featuresCopy.subheading}
        </p>
      </div>
      <FeatureMap />

      <div className="mx-auto mt-20 max-w-xs text-center sm:mt-24 sm:max-w-2xl lg:mt-28">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {featuresCopy.boardingPassIntro.heading}
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
          {featuresCopy.boardingPassIntro.subheading}
        </p>
      </div>
      <BoardingPass />

      <StackingCards />
    </SectionContainer>
  )
}
