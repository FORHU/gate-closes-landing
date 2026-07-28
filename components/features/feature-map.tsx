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
// container edge — PhoneMockup renders at 240px (md) / 260px (lg) wide.
const markerCorner = {
  "top-left": "md:top-0 md:right-[calc(50%+132px)] lg:right-[calc(50%+142px)]",
  "top-right": "md:top-0 md:left-[calc(50%+132px)] lg:left-[calc(50%+142px)]",
  "bottom-left": "md:bottom-0 md:right-[calc(50%+132px)] lg:right-[calc(50%+142px)]",
  "bottom-right": "md:bottom-0 md:left-[calc(50%+132px)] lg:left-[calc(50%+142px)]",
} as const

const phoneVariants: Variants = {
  hidden: { y: 160, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 18, mass: 0.9 },
  },
}

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
      delay: 0.5 + index * 0.15,
    },
  }),
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

function MarkerBody({ marker }: { marker: Marker }) {
  const side = markerSide[marker.position]

  return (
    <>
      <Image
        src={marker.src}
        alt=""
        width={61}
        height={71}
        className="h-20 w-auto shrink-0 drop-shadow-sm md:h-24 lg:h-24"
      />
      <div className={cn("-translate-y-1", side === "left" ? "md:text-right" : "md:text-left")}>
        <p className="text-sm font-semibold text-foreground">{marker.title}</p>
        <p className="mt-0.5 max-w-48 text-xs text-muted-foreground md:max-w-32 lg:max-w-36">
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
      <div className="mt-2 flex w-full max-w-2xl flex-col items-center gap-10 md:relative md:h-150 lg:h-160">
        <div className="md:absolute md:inset-0 md:flex md:items-center md:justify-center">
          <PhoneMockup
            {...featuresCopy.anchorPhone}
            className="w-65 sm:w-70 md:w-60 lg:w-65"
          />
        </div>

        {featuresCopy.markers.map((marker) => (
          <div key={marker.src} className={markerClassName(marker)}>
            <MarkerBody marker={marker} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="mx-auto mt-16 flex w-full flex-col items-center gap-10 md:relative md:h-150 lg:h-160"
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
          className="w-65 sm:w-70 md:w-60 lg:w-65"
        />
      </motion.div>

      {featuresCopy.markers.map((marker, index) => (
        <motion.div
          key={marker.src}
          custom={index}
          variants={markerVariants}
          className={markerClassName(marker)}
        >
          <MarkerBody marker={marker} />
        </motion.div>
      ))}
    </motion.div>
  )
}
