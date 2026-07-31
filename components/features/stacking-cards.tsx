"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
import { Button } from "@/components/ui/button"
import { featuresCopy } from "./features-copy"

type StackCard = (typeof featuresCopy.stackCards)[number]

// Cascading top offset between successive pinned cards, so an earlier card's
// top edge still peeks out from behind the one stacking over it — same idea
// as skiper-ui's Card Stack component, just a smaller step since these are
// content cards, not full-bleed images.
const STACK_TOP_BASE = 96 // clears the fixed navbar (h-16) plus a gap
const STACK_TOP_STEP = 16

function StackCardBody({ card }: { card: StackCard }) {
  return (
    // A fixed min-height (not just h-auto/items-stretch) keeps every card the
    // same document-flow height regardless of how much its own copy wraps —
    // otherwise a shorter card unsticks and scrolls away sooner than its
    // taller neighbors, and the deck's stacking order visibly desyncs mid-scroll.
    <div className="grid min-h-[28rem] items-stretch rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-800 shadow-xl md:min-h-[25rem] md:grid-cols-2">
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="flex items-center gap-2">
          <Image src={card.badge} alt="" width={28} height={28} className="size-6 sm:size-7" />
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm"
            style={{ color: card.color }}
          >
            {card.eyebrow}
          </p>
        </div>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {card.heading}
        </h3>
        <p className="mt-4 text-sm text-white/70 sm:text-base">{card.subheading}</p>
        <Button
          size="lg"
          className="mt-6 h-11 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-white/90"
        >
          {card.ctaLabel}
        </Button>
      </div>

      {/* `fill` needs an ancestor with a real height: on mobile (single
          column) this div isn't stretched by any sibling, so it gets an
          explicit height; from md up, `items-stretch` matches it to the
          text column's height instead, so h-auto lets that win. Rounded
          corners flip from bottom (stacked) to right (side-by-side) to
          keep tracking whichever edge of the card this panel is actually
          on. */}
      <div className="relative h-56 overflow-hidden rounded-b-2xl sm:h-72 md:h-auto md:rounded-r-2xl">
        <Image
          src={card.image.src}
          alt={card.image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}

function StackCardItem({
  card,
  index,
  total,
  progress,
}: {
  card: StackCard
  index: number
  total: number
  progress: MotionValue<number>
}) {
  // The top card never needs to make room for anything above it, so it's the
  // only one that targets full scale — every earlier card shrinks a bit more
  // the further back in the deck it ends up sitting.
  const targetScale = Math.max(0.5, 1 - (total - index - 1) * 0.1)
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  return (
    <div
      className="sticky"
      style={{ top: STACK_TOP_BASE + index * STACK_TOP_STEP, zIndex: index + 1 }}
    >
      <motion.div style={{ scale }} className="origin-top">
        <StackCardBody card={card} />
      </motion.div>
    </div>
  )
}

export function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  // Raw scrollYProgress updates in lockstep with the scroll event itself —
  // on a notchy mouse wheel or a low-polling trackpad that reads as visible
  // stepping in the scale transform. Springing it decouples the animation
  // from the input's own cadence, so it reads as smooth motion instead.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
    restDelta: 0.001,
  })

  if (shouldReduceMotion) {
    return (
      <div className="mx-auto mt-24 flex w-full max-w-4xl flex-col gap-8 sm:mt-32">
        {featuresCopy.stackCards.map((card) => (
          <StackCardBody key={card.id} card={card} />
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative mx-auto mt-24 w-full max-w-4xl pb-[60vh] sm:mt-32">
      {featuresCopy.stackCards.map((card, index) => (
        <StackCardItem
          key={card.id}
          card={card}
          index={index}
          total={featuresCopy.stackCards.length}
          progress={smoothProgress}
        />
      ))}
    </div>
  )
}
