import { SectionContainer } from "@/components/section-container"
import { featuresCopy } from "./features-copy"
import { FeatureMap } from "./feature-map"

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
    </SectionContainer>
  )
}
