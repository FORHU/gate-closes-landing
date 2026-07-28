import { featuresCopy } from "./features-copy"
import { FeatureMap } from "./feature-map"

export function FeaturesSection() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {featuresCopy.heading}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {featuresCopy.subheading}
        </p>
      </div>

      <FeatureMap />
    </div>
  )
}
