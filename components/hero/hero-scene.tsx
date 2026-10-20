"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "motion/react"
import { AmbientVideo } from "@/components/media/ambient-video"
import { useReducedMotionSafe } from "@/components/motion/use-media-query"
import { GRAIN } from "@/lib/grain"
import { Airliner } from "./airliner"
import { heroCopy } from "./hero-copy"

/**
 * Hero Sky, back to front: sunset footage (poster first), the Airliner, a
 * near cloud bank that passes in front of the plane, then shade and grain.
 * Scrolling splits them into three depth planes: the sky lags behind the page
 * (slowest, farthest), the near clouds rise a little faster than it, and the
 * plane climbs away up-right fastest of all.
 */
export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()
  const inView = useInView(ref)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const planeX = useTransform(scrollYProgress, [0, 1], ["0vw", "9vw"])
  const planeY = useTransform(scrollYProgress, [0, 1], ["0vh", "-20vh"])
  const planeScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const cloudsY = useTransform(scrollYProgress, [0, 1], ["0vh", "-9vh"])
  const skyY = useTransform(scrollYProgress, [0, 1], ["0vh", "30vh"])

  return (
    <div ref={ref} data-paused={!inView} aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div style={reduce ? { y: 0 } : { y: skyY }} className="absolute inset-0 will-change-transform">
        <AmbientVideo
          sources={heroCopy.video.sources}
          poster={heroCopy.video.poster}
          priority
          mediaClassName="object-[50%_35%]"
        />
      </motion.div>

      <motion.div
        style={reduce ? { x: 0, y: 0, scale: 1 } : { x: planeX, y: planeY, scale: planeScale }}
        className="absolute top-[13%] -right-[4vw] w-[106vw] will-change-transform sm:top-[12%] md:-right-[3vw] md:w-[min(64vw,960px)]"
      >
        <div className="animate-plane-in motion-reduce:animate-none">
          <div className="origin-[60%_50%] animate-plane-float motion-reduce:animate-none">
            <Airliner className="block h-auto w-full -rotate-8" />
          </div>
        </div>
      </motion.div>

      <motion.div
        style={reduce ? { y: 0 } : { y: cloudsY }}
        className="absolute inset-x-0 -bottom-[6%] h-[48%] [mask-image:linear-gradient(to_bottom,transparent,black_42%)]"
      >
        <div
          className="absolute inset-y-0 -right-[12%] left-0 animate-cloud-drift bg-cover bg-[50%_0%] opacity-95 motion-reduce:animate-none"
          style={{ backgroundImage: `url(${heroCopy.nearClouds})` }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(7_8_10/0.72)_0%,rgb(7_8_10/0.3)_42%,transparent_70%),linear-gradient(180deg,rgb(7_8_10/0.55)_0%,transparent_18%,transparent_55%,var(--night)_100%)] max-md:bg-[linear-gradient(180deg,rgb(7_8_10/0.5)_0%,transparent_22%,rgb(7_8_10/0.12)_44%,rgb(7_8_10/0.86)_74%,var(--night)_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}
