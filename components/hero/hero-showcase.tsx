"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { heroCopy } from "./hero-copy"
import { PhoneMockup } from "./phone-mockup"

const terminalEchoLayout = [
  {
    position: "top-4 left-2 md:top-8 lg:-left-8",
    mobileVisible: true,
  },
  {
    position: "bottom-8 left-2 md:bottom-16 lg:-left-4",
    mobileVisible: false,
  },
  {
    position: "top-4 right-2 md:top-8 lg:-right-4",
    mobileVisible: true,
  },
  {
    position: "bottom-20 right-2 lg:-right-4",
    mobileVisible: false,
  },
]

function FloatingWrapper({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

export function HeroShowcase() {
  return (
    <div className="relative mx-auto mt-32 mb-15 h-[360px] w-full max-w-6xl sm:mt-16 sm:h-[460px] sm:mb-15 lg:mt-20 lg:h-[560px]">
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
        <PhoneMockup
          {...heroCopy.phones.left}
          className={cn(
            "absolute bottom-0 z-10 hidden -translate-x-[90%] translate-y-8 scale-90 md:block"
          )}
        />

        <PhoneMockup
          {...heroCopy.phones.center}
          priority
          className="relative z-20 translate-y-4 scale-110 sm:translate-y-6"
        />

        <PhoneMockup
          {...heroCopy.phones.right}
          className={cn(
            "absolute bottom-0 z-[15] hidden translate-x-[90%] translate-y-4 scale-95 md:block"
          )}
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
            delay={echo.delay}
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
