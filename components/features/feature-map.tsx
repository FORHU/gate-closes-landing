"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"
import { PhoneMockup } from "@/components/hero/phone-mockup"
import { featuresCopy } from "./features-copy"

type Marker = (typeof featuresCopy.markers)[number]
type MarkerSide = "left" | "right"

const markerSide: Record<Marker["position"], MarkerSide> = {
  "top-left": "left",
  "top-right": "right",
  "bottom-left": "left",
  "bottom-right": "right",
}

// Anchored to the phone's edge (half its rendered width + a fixed gap), not the
// container edge — PhoneMockup renders at 240px (md) / 336px (lg) wide. The
// md phone is deliberately smaller than lg's (240px vs. 336px, matching the
// reduced-motion branch's own md size): md's container is narrower (tablet,
// e.g. the 768-1023px range covering iPad Mini/Air portrait) and doesn't
// have room for both a full desktop-sized phone and unwrapped marker titles
// (verified against "Destination Thread", the longest title, at the 768px
// floor of the md range).
const markerCorner = {
  "top-left": "md:top-0 md:right-[calc(50%+136px)] lg:right-[calc(50%+232px)]",
  "top-right": "md:top-0 md:left-[calc(50%+136px)] lg:left-[calc(50%+232px)]",
  "bottom-left": "md:bottom-0 md:right-[calc(50%+136px)] lg:right-[calc(50%+232px)]",
  "bottom-right": "md:bottom-0 md:left-[calc(50%+136px)] lg:left-[calc(50%+232px)]",
} as const

const phoneVariants: Variants = {
  hidden: { y: 160, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 18, mass: 0.9 },
  },
}

// When each marker's landing bounce (spring) starts. The pulse rings reuse
// this plus a settle buffer so they only start once the marker has landed.
const MARKER_LANDING_DELAY = (index: number) => 0.5 + index * 0.15
const MARKER_LANDING_SETTLE = 0.4

const markerVariants: Variants = {
  hidden: { y: 24, opacity: 0, scale: 0 },
  visible: (index: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 580,
      damping: 14,
      delay: MARKER_LANDING_DELAY(index),
    },
  }),
}

// 4 rings per marker, evenly staggered across one cycle (`pulseAnimate` in
// globals.css: scale 1→1.8, opacity 0.6→0, on loop) so multiple rings are
// always visible at different stages at once — a continuous ripple instead
// of a single ring with a visible gap between pulses. Every pin SVG shares
// the same head geometry (centered at 30.5/61 horizontally, 29.5/71
// vertically in a 61x71 viewBox), so one fixed position/size works for all
// four markers, matching the pin's own outer colored edge (51/71 of height).
const PULSE_RING_COUNT = 4
const PULSE_DURATION = 2.4
const PULSE_STAGGER = PULSE_DURATION / PULSE_RING_COUNT

function MarkerPulse({ color, index }: { color: string; index: number }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return null
  }

  const startDelay = MARKER_LANDING_DELAY(index) + MARKER_LANDING_SETTLE

  return (
    <>
      {Array.from({ length: PULSE_RING_COUNT }, (_, ring) => (
        <span
          key={ring}
          className="absolute left-1/2 top-[41.5%] z-0 aspect-square h-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: color,
            animationName: "pulseAnimate",
            animationDuration: `${PULSE_DURATION}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${startDelay + ring * PULSE_STAGGER}s`,
          }}
        />
      ))}
    </>
  )
}

function markerClassName(marker: Marker) {
  const side = markerSide[marker.position]
  return cn(
    "flex w-full max-w-sm items-center justify-center gap-4",
    "md:absolute md:z-10 md:w-auto md:max-w-none md:justify-start",
    side === "left" ? "md:flex-row-reverse" : "md:flex-row",
    markerCorner[marker.position]
  )
}

function MarkerBody({ marker, index }: { marker: Marker; index: number }) {
  const side = markerSide[marker.position]

  return (
    <>
      <div className="relative shrink-0">
        <MarkerPulse color={marker.color} index={index} />
        <Image
          src={marker.src}
          alt=""
          width={61}
          height={71}
          className="relative z-10 h-24 w-auto drop-shadow-sm md:h-24 lg:h-32"
        />
      </div>
      <div className={cn("-translate-y-1", side === "left" ? "md:text-right" : "md:text-left")}>
        <p className="text-md whitespace-nowrap font-semibold text-foreground">{marker.title}</p>
        <p className="mt-0.5 max-w-48 text-xs text-muted-foreground md:max-w-40 lg:max-w-48">
          {marker.description}
        </p>
      </div>
    </>
  )
}

export function FeatureMap() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="mt-2 flex w-full flex-col items-center gap-10 md:relative md:h-170 lg:h-190">
        <div className="md:absolute md:inset-0 md:flex md:items-center md:justify-center">
          <PhoneMockup
            {...featuresCopy.anchorPhone}
            className="w-65 sm:w-70 md:w-60 lg:w-65"
          />
        </div>

        {featuresCopy.markers.map((marker, index) => (
          <div key={marker.src} className={markerClassName(marker)}>
            <MarkerBody marker={marker} index={index} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="mx-auto mt-16 flex w-full flex-col items-center gap-10 md:relative md:h-170 lg:h-190"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        variants={phoneVariants}
        className="md:absolute md:inset-0 md:flex md:items-center md:justify-center"
      >
        <PhoneMockup
          {...featuresCopy.anchorPhone}
          className="w-72 sm:w-84 md:w-60 lg:w-84"
        />
      </motion.div>

      {featuresCopy.markers.map((marker, index) => (
        <motion.div
          key={marker.src}
          custom={index}
          variants={markerVariants}
          className={markerClassName(marker)}
        >
          <MarkerBody marker={marker} index={index} />
        </motion.div>
      ))}
    </motion.div>
  )
}
