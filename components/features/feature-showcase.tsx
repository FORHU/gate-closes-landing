"use client"

import { useCallback, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { GalleryPhoneMockup } from "@/components/features/gallery-phone-mockup"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel"
import type { featuresCopy } from "./features-copy"

type StackCard = (typeof featuresCopy.stackCards)[number]
type OnboardingStep = StackCard["steps"][number]

// One onboarding step: the phone bezel on a transparent background (no card
// chrome, so it reads as one surface with the dialog), then the step's
// number, title and description below it.
function StepSlide({
  step,
  index,
  total,
  color,
}: {
  step: OnboardingStep
  index: number
  total: number
  color: string
}) {
  return (
    <div className="flex flex-col items-center px-12 py-4 text-center">
      <GalleryPhoneMockup src={step.src} alt={step.alt} className="w-36 sm:w-40" />
      <p className="mt-5 text-xs font-semibold tracking-wide uppercase" style={{ color }}>
        Step {index + 1} of {total}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
    </div>
  )
}

// Tracks the carousel's own embla API for a dot-per-slide indicator, since
// the shadcn carousel doesn't ship one — the active dot picks up the
// feature's accent color to match the slide header above it.
function CarouselDots({ color }: { color: string }) {
  const { api } = useCarousel()

  const subscribeToApi = useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => {}
      api.on("reInit", onStoreChange)
      api.on("select", onStoreChange)
      return () => {
        api.off("reInit", onStoreChange)
        api.off("select", onStoreChange)
      }
    },
    [api]
  )
  const selected = useSyncExternalStore(
    subscribeToApi,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0
  )
  const count = useSyncExternalStore(
    subscribeToApi,
    () => api?.scrollSnapList().length ?? 0,
    () => 0
  )

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2 pb-2">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="size-1.5 rounded-full transition-colors"
          style={{ backgroundColor: index === selected ? color : "var(--color-border)" }}
        />
      ))}
    </div>
  )
}

// Each slide takes the full carousel width — neighbors sit fully off-screen,
// not peeking at the edge. Advancing is signalled by the arrows/dots instead.
// No looping: the steps are in order, so the arrows stop at the first and
// last step. Slides pad their sides (px-12) so step text clears the arrows.
//
// The arrows sit inset within the carousel rather than the default
// off-carousel offset, since Carousel and DialogContent share the same
// max-w-md cap with no side margin for them to sit in. They're wrapped
// together with CarouselContent in their own relative div, separate from
// CarouselDots below — otherwise their vertical centering would resolve
// against the dots' height too and sit lower still.
function GalleryCarousel({ card }: { card: StackCard }) {
  return (
    <Carousel opts={{ loop: false, align: "center" }} className="w-full max-w-md p-0 overflow-hidden">
      <div className="relative">
        <CarouselContent className="-ml-4">
          {card.steps.map((step, index) => (
            <CarouselItem key={index} className="pl-4 basis-full flex justify-center">
              <StepSlide step={step} index={index} total={card.steps.length} color={card.color} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </div>
      <CarouselDots color={card.color} />
    </Carousel>
  )
}

export function FeatureShowcase({ card }: { card: StackCard }) {
  const trigger = (
    <Button
      size="lg"
      className="mt-6 h-11 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-white/90"
    >
      {card.ctaLabel}
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-md">
        <DialogHeader className="p-4 pb-0 flex flex-col items-center justify-center">
          <DialogTitle style={{ color: card.color }} className="text-2xl font-semibold">{card.eyebrow}</DialogTitle>
          <DialogDescription>How it works</DialogDescription>
        </DialogHeader>
        <GalleryCarousel card={card} />
      </DialogContent>
    </Dialog>
  )
}
