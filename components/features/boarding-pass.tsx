"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { AirplaneIcon } from "@/components/icons/airplane-icon"
import { cn } from "@/lib/utils"
import { featuresCopy } from "./features-copy"

// Decorative only — no real data, no scannable encoding. Fixed bar-width
// pattern (not random) so server/client renders always match.
const BARCODE_PATTERN = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2]

function Barcode({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-14 items-stretch gap-0.5 sm:h-20 sm:gap-0.75", className)}>
      {BARCODE_PATTERN.map((width, i) => (
        <span key={i} className="bg-white/90" style={{ width: `${width * 2}px` }} />
      ))}
    </div>
  )
}

// One full loop: fade in at origin, brief pause, travel to destination, brief
// pause, fade out — then a beat of nothing before it reappears at the origin.
const PLANE_TRAVEL_DURATION = 3.5
const PLANE_FADE_DURATION = 0.3
const PLANE_END_PAUSE = 0.4
const PLANE_RESET_GAP = 0.4
const PLANE_CYCLE_DURATION =
  PLANE_FADE_DURATION * 2 + PLANE_END_PAUSE * 2 + PLANE_TRAVEL_DURATION
const PLANE_CYCLE_TIMES = [
  0,
  PLANE_FADE_DURATION,
  PLANE_FADE_DURATION + PLANE_END_PAUSE,
  PLANE_FADE_DURATION + PLANE_END_PAUSE + PLANE_TRAVEL_DURATION,
  PLANE_FADE_DURATION + PLANE_END_PAUSE + PLANE_TRAVEL_DURATION + PLANE_END_PAUSE,
  PLANE_CYCLE_DURATION,
].map((t) => t / PLANE_CYCLE_DURATION)

function TravelingPlane() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <AirplaneIcon className="size-4 text-[#bbe40a] sm:size-5" />
      </span>
    )
  }

  return (
    <motion.span
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ left: "0%", opacity: 0 }}
      animate={{
        left: ["0%", "0%", "0%", "100%", "100%", "100%"],
        opacity: [0, 1, 1, 1, 1, 0],
      }}
      transition={{
        duration: PLANE_CYCLE_DURATION,
        times: PLANE_CYCLE_TIMES,
        repeat: Infinity,
        repeatDelay: PLANE_RESET_GAP,
        ease: "easeInOut",
      }}
    >
      <AirplaneIcon className="size-4 text-[#bbe40a] sm:size-5" />
    </motion.span>
  )
}

// Genuine cutouts, not discs drawn on top: `mask-image` punches two circular
// holes through the card itself at the divider's x-position (a CSS var, since
// the divider column's width — and so its x-offset from the right edge —
// changes at `sm:`). `mask-composite: intersect` combines the two hole
// gradients so both survive (each layer is opaque everywhere except its own
// hole; intersecting keeps a pixel opaque only where every layer agrees).
// box-shadow is unaffected by mask, so the card's own drop shadow still
// reads as one solid rectangle behind it, like a real punched ticket.
const NOTCH_RADIUS = 12
const notchMaskImage = [0, "100%"]
  .map((y) => `radial-gradient(circle ${NOTCH_RADIUS}px at var(--notch-x) ${y}, transparent ${NOTCH_RADIUS}px, black ${NOTCH_RADIUS + 0.5}px)`)
  .join(", ")

// Same slide-up spring as the Feature Map's Anchor Phone, so every
// scroll-triggered entrance on this page feels like one consistent system.
const ENTRANCE_SPRING = { type: "spring", stiffness: 140, damping: 18, mass: 0.9 } as const

// The card's own slide-up settles in roughly this long — the airplane's
// entrance is delayed past it so it visibly flies in over an already-landed
// ticket, not simultaneously with it.
const AIRPLANE_ENTRANCE_DELAY = 0.6

// Purely decorative (like the Hero Showcase's Terminal Echo cards) — sits in
// front of the Boarding Pass, overlapping its bottom edge, and slides in from
// the left once the card has settled. Rendered in normal flow (not absolute)
// with a negative top margin to pull it up into the card: percentage-based
// `top`/`bottom` on an absolutely-positioned element only resolves against a
// containing block with an *explicit* height, and the wrapper here is
// auto-height (sized by the card), so that approach silently fell back to
// the element's static position instead of actually overlapping.
const airplaneVariants: Variants = {
  hidden: { x: "-120%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...ENTRANCE_SPRING, delay: AIRPLANE_ENTRANCE_DELAY },
  },
}

function AirplaneOverlay() {
  const shouldReduceMotion = useReducedMotion()

  const image = (
    <Image
      src="/features/airplane-image.svg"
      alt=""
      width={1440}
      height={810}
      className="h-auto w-full"
    />
  )

  if (shouldReduceMotion) {
    return <div className="relative z-10 -mt-7 w-full sm:-mt-10 lg:-mt-12">{image}</div>
  }

  // The slide-in transform lives on the INNER motion.div, not this outer one:
  // whileInView's `amount` threshold is measured against the observed
  // element's own (possibly transformed) box, so if the "hidden" x-offset
  // lived here, this box would already be ~90% off-screen while hidden and
  // could never reach the 30%-visible threshold needed to trigger itself.
  // Triggering on this untransformed outer box and propagating to the inner
  // one via variants sidesteps that self-defeating loop.
  return (
    <motion.div
      className="relative z-10 -mt-24 w-full sm:-mt-50 lg:-mt-55"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div variants={airplaneVariants}>{image}</motion.div>
    </motion.div>
  )
}

export function BoardingPass() {
  const { flightCode, from, to, departDate, arriveDate } = featuresCopy.boardingPass
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl sm:mt-16">
      <motion.div
        className="relative flex w-full rounded-xl bg-linear-to-br from-zinc-900 to-zinc-800 shadow-xl [--notch-x:calc(100%-4rem)] sm:[--notch-x:calc(100%-6rem)] lg:[--notch-x:calc(100%-7rem)]"
        style={{
          maskImage: notchMaskImage,
          WebkitMaskImage: notchMaskImage,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in, source-in",
        }}
        initial={shouldReduceMotion ? false : { y: 160, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={ENTRANCE_SPRING}
      >
        <div className="min-w-0 flex-1 p-5 text-white sm:p-8 lg:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-lime-400 uppercase sm:text-sm">
            {flightCode}
          </p>

          <div className="mt-4 flex items-center justify-between gap-2 sm:mt-6 sm:gap-4 lg:mt-8">
            <p className="truncate text-lg font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {from.city}
            </p>
            <p className="truncate text-lg font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {to.city}
            </p>
          </div>

          {/* Route bar: a pin at each end (generic map-pin shape, not a Feature
              Marker — no specific feature applies at a route's endpoint) joined
              by a dashed flight path, with the plane traveling origin→destination. */}
          <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
            <MapPin className="size-4 shrink-0 text-white/50 animate-bounce sm:size-5" />
            <div className="relative h-px min-w-4 flex-1">
              <div className="absolute inset-0 border-t-2 border-dashed border-white/25" />
              <TravelingPlane />
            </div>
            <MapPin className="size-4 shrink-0 text-white/50 animate-bounce sm:size-5" />
          </div>

          <div className="mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs text-white/50 sm:text-sm">{from.airport}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{departDate}</p>
            </div>
            <div className="min-w-0 text-right">
              <p className="truncate text-xs text-white/50 sm:text-sm">{to.airport}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{arriveDate}</p>
            </div>
          </div>
        </div>

        <div className="relative flex w-16 shrink-0 items-center justify-center border-l-2 border-dashed border-white/25 sm:w-24 lg:w-28">
          <Barcode className="rotate-90" />
        </div>
      </motion.div>

      <AirplaneOverlay />
    </div>
  )
}
