"use client"

import { useCallback, useSyncExternalStore } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { PhoneMockup } from "@/components/hero/phone-mockup"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  DrawerHeader
} from "@/components/ui/drawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import type { featuresCopy } from "./features-copy"

type StackCard = (typeof featuresCopy.stackCards)[number]
type GalleryImage = StackCard["gallery"][number]

// Just the phone bezel on a transparent background — no card chrome around
// it, so it reads as one continuous surface with the dialog/drawer behind it.
function PhoneSlide({ image }: { image: GalleryImage }) {
  return (
    <div className="flex justify-center py-6">
      <PhoneMockup src={image.src} alt={image.alt} className="w-36 sm:w-40" />
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
    <div className="flex items-center justify-center gap-1.5 pt-4">
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

// Slides sit at less than full width so the next one peeks in at the edge —
// same "there's more, keep going" cue as the reference deck.
function GalleryCarousel({ card }: { card: StackCard }) {
  return (
    <Carousel opts={{ loop: true, align: "center" }} className="w-fit max-w-md p-0 overflow-hidden">
      <CarouselContent className="-ml-8">
        {card.gallery.map((image, index) => (
          <CarouselItem key={index} className="pl-4 basis-[30%] sm:basis-[75%] flex justify-center">
            <PhoneSlide image={image} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots color={card.color} />
    </Carousel>
  )
}

export function FeatureShowcase({ card }: { card: StackCard }) {
  const isMobile = useIsMobile()

  const trigger = (
    <Button
      size="lg"
      className="mt-6 h-11 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-white/90"
    >
      {card.ctaLabel}
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger render={trigger} />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle style={{ color: card.color }}>{card.eyebrow}</DrawerTitle>
            <DrawerDescription>{card.heading}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pt-2 pb-6">
            <GalleryCarousel card={card} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="h-[80vh] overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="p-4 pb-0 flex flex-col items-center justify-center">
          <DialogTitle style={{ color: card.color }} className="text-2xl font-semibold">{card.eyebrow}</DialogTitle>
          <DialogDescription>{card.heading}</DialogDescription>
        </DialogHeader>
        <GalleryCarousel card={card} />
      </DialogContent>
    </Dialog>
  )
}
