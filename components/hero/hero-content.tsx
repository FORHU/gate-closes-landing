"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroCopy } from "./hero-copy"

export function HeroContent() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:mt-6 sm:text-5xl lg:text-6xl">
        {heroCopy.headline}
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        {heroCopy.subheadline}
      </p>

      <div className="mt-8">
        <Button
          nativeButton={false}
          size="lg"
          render={(props) => (
            <a href={heroCopy.cta.href} {...props} />
          )}
          className="h-12 w-full rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground sm:w-auto"
        >
          <Download className="size-4" />
          {heroCopy.cta.label}
        </Button>
      </div>
    </div>
  )
}
