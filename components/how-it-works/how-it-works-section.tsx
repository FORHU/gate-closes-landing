"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { PhoneMockup } from "@/components/phone-mockup"
import { SectionContainer } from "@/components/section-container"
import { cn } from "@/lib/utils"
import { RecordScreen, ScanScreen, ZoneScreen } from "./app-screens"

const STEPS: { title: string; body: string; screen: ReactNode }[] = [
  {
    title: "Add your boarding pass",
    body: "Scan the barcode, upload a screenshot, or type it in. Photos are read on your phone and never uploaded.",
    screen: <ScanScreen />,
  },
  {
    title: "Arrive at the airport",
    body: "GateCloses checks that you're inside the airport's radius, sized from 1.5 to 4 km. Then the terminal opens up.",
    screen: <ZoneScreen />,
  },
  {
    title: "Speak up",
    body: "Record a Terminal Echo of up to 10 seconds, or send a voice note to a traveler whose flight matches yours.",
    screen: <RecordScreen />,
  },
]

/**
 * Sticky split: steps scroll on the left while one phone stays pinned on the
 * right and cross-fades to the active step's screen. The active step is
 * whichever crosses the middle band of the viewport (IntersectionObserver, no
 * scroll math). Below lg there's no pinned phone: each step shows its own.
 */
export function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(stepRefs.current.indexOf(entry.target as HTMLLIElement))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    stepRefs.current.forEach((step) => step && observer.observe(step))
    return () => observer.disconnect()
  }, [])

  return (
    <SectionContainer className="py-28 sm:py-36">
      <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.3vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.032em] text-balance text-white">
        From boarding pass to first hello.
      </h2>

      <div className="mt-10 grid gap-x-[clamp(40px,8vw,128px)] lg:mt-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <ol className="relative">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={cn(
                "border-l-2 py-12 pl-6 transition-[opacity,border-color] duration-500 sm:pl-8 lg:py-[18vh]",
                i === active ? "border-theme" : "border-white/10 lg:opacity-40"
              )}
            >
              <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.35rem)] leading-[1.1] font-semibold tracking-[-0.028em] text-white">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[30rem] text-lg text-white/65">{step.body}</p>
              <div aria-hidden className="mt-10 w-[min(270px,72vw)] lg:hidden">
                <PhoneMockup>{step.screen}</PhoneMockup>
              </div>
            </li>
          ))}
        </ol>

        <div aria-hidden className="hidden lg:block">
          <div className="sticky top-[calc(50vh-min(310px,38vh))] w-[calc(min(620px,76vh)*9/19.5)]">
            <PhoneMockup>
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    i === active ? "opacity-100" : "opacity-0"
                  )}
                >
                  {step.screen}
                </div>
              ))}
            </PhoneMockup>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
