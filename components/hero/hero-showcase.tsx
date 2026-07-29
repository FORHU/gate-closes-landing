"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { heroCopy } from "./hero-copy"
import { PhoneMockup } from "./phone-mockup"

const PHONE_SPRING = { type: "spring", stiffness: 140, damping: 18, mass: 0.9 } as const

// Entrance order: center, then right, then left.
const PHONE_ENTRANCE_DELAY = { center: 0, right: 0.15, left: 0.3 } as const

// Terminal Echo cards slide in once the phone sequence has settled, staggered
// slightly from each other.
const ECHO_ENTRANCE_START = 1.1
const ECHO_ENTRANCE_STAGGER = 0.1
const ECHO_SLIDE_DISTANCE = 40
const ECHO_SLIDE_DURATION = 0.5

const terminalEchoLayout = [
  {
    position: "top-4 left-2 md:top-8 lg:-left-8",
    mobileVisible: true,
    slideFrom: "left",
  },
  {
    position: "bottom-8 left-2 md:bottom-16 lg:-left-4",
    mobileVisible: false,
    slideFrom: "left",
  },
  {
    position: "top-4 right-2 md:top-8 lg:-right-4",
    mobileVisible: true,
    slideFrom: "right",
  },
  {
    position: "bottom-20 right-2 lg:-right-4",
    mobileVisible: false,
    slideFrom: "right",
  },
] as const

function PhoneEntrance({
  children,
  delay,
  className,
}: {
  children: ReactNode
  delay: number
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    // z-index must live here, not just on `children` — Framer's `transform`
    // makes this the element that establishes the stacking context, so an
    // un-indexed wrapper around a z-20 child still loses to the left/right
    // phones' own z-10/z-15 (they're animated directly, no wrapper).
    <motion.div
      className={className}
      initial={{ y: 160, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...PHONE_SPRING, delay }}
    >
      {children}
    </motion.div>
  )
}

function FloatingWrapper({
  children,
  className,
  slideFrom,
  entranceDelay,
}: {
  children: ReactNode
  className?: string
  slideFrom: "left" | "right"
  entranceDelay: number
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const slideOffset = slideFrom === "left" ? -ECHO_SLIDE_DISTANCE : ECHO_SLIDE_DISTANCE

  return (
    <motion.div
      className={className}
      initial={{ x: slideOffset, opacity: 0 }}
      animate={{ x: 0, opacity: 1, y: [0, -6, 0] }}
      transition={{
        x: { duration: ECHO_SLIDE_DURATION, ease: "easeOut", delay: entranceDelay },
        opacity: { duration: ECHO_SLIDE_DURATION, ease: "easeOut", delay: entranceDelay },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: entranceDelay + ECHO_SLIDE_DURATION,
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Left/right phones are absolutely-positioned flex children with no left/right
// set — their horizontal placement falls back to the CSS static-position
// algorithm, which accounts for the flex container's `justify-content: center`
// directly on that element. Wrapping them in another element (to animate y)
// changes what static position resolves to, so instead we animate PhoneMockup's
// own root directly and compose the permanent offset (translate-x/-y/scale)
// into the same x/y/scale motion values as the entrance animation.
const LEFT_PHONE_REST = { x: "-90%", y: 32, scale: 0.9 } as const
const RIGHT_PHONE_REST = { x: "90%", y: 16, scale: 0.95 } as const
const PHONE_SLIDE_RISE = 160

export function HeroShowcase() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto mt-32 mb-15 h-[360px] w-full max-w-6xl sm:mt-16 sm:h-[460px] sm:mb-15 lg:mt-20 lg:h-[560px]">
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
        <PhoneMockup
          {...heroCopy.phones.left}
          className="absolute bottom-0 z-10 hidden md:block"
          initial={
            shouldReduceMotion
              ? false
              : { ...LEFT_PHONE_REST, y: LEFT_PHONE_REST.y + PHONE_SLIDE_RISE, opacity: 0 }
          }
          animate={{ ...LEFT_PHONE_REST, opacity: 1 }}
          transition={{ ...PHONE_SPRING, delay: PHONE_ENTRANCE_DELAY.left }}
        />

        <PhoneEntrance delay={PHONE_ENTRANCE_DELAY.center} className="relative z-20">
          <PhoneMockup
            {...heroCopy.phones.center}
            priority
            className="translate-y-4 scale-110 sm:translate-y-6"
          />
        </PhoneEntrance>

        <PhoneMockup
          {...heroCopy.phones.right}
          className="absolute bottom-0 z-[15] hidden md:block"
          initial={
            shouldReduceMotion
              ? false
              : { ...RIGHT_PHONE_REST, y: RIGHT_PHONE_REST.y + PHONE_SLIDE_RISE, opacity: 0 }
          }
          animate={{ ...RIGHT_PHONE_REST, opacity: 1 }}
          transition={{ ...PHONE_SPRING, delay: PHONE_ENTRANCE_DELAY.right }}
        />
      </div>

      {heroCopy.terminalEchoes.map((echo, index) => {
        const layout = terminalEchoLayout[index]

        return (
          <FloatingWrapper
            key={echo.src}
            className={cn(
              "absolute z-30",
              layout.mobileVisible ? "block" : "hidden md:block",
              layout.position
            )}
            slideFrom={layout.slideFrom}
            entranceDelay={ECHO_ENTRANCE_START + index * ECHO_ENTRANCE_STAGGER}
          >
            <Image
              src={echo.src}
              alt=""
              width={379}
              height={223}
              className={cn(
                "h-auto",
                layout.mobileVisible ? "w-36 md:w-[270px] lg:w-[360px]" : "w-[270px] lg:w-[360px] h-auto"
              )}
            />
          </FloatingWrapper>
        )
      })}
    </div>
  )
}
