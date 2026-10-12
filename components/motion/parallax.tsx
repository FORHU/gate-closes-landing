"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { useMediaQuery, useReducedMotionSafe } from "./use-media-query"

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>
type Range<T> = readonly [T, T]

// Resting values, applied explicitly when the layer is still: an `undefined`
// style would leave the server-rendered transform stuck on the element.
const STILL = { y: 0, opacity: 1 }

/**
 * Moves its children as they pass through the viewport: `y` (and optionally
 * `opacity`) are mapped from scroll progress across `offset`, applied as
 * motion values so nothing re-renders per frame. Still under reduced motion,
 * and on phones when `desktopOnly` is set.
 *
 * The default offset covers the element's whole trip, from entering at the
 * bottom of the viewport to leaving at the top.
 */
export function Parallax({
  children,
  className,
  y,
  opacity,
  offset = ["start end", "end start"],
  desktopOnly = false,
}: {
  children?: ReactNode
  className?: string
  y: Range<string | number>
  opacity?: Range<number>
  offset?: ScrollOffset
  desktopOnly?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()
  const desktop = useMediaQuery("(min-width: 768px)", true)
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const yValue = useTransform(scrollYProgress, [0, 1], [y[0], y[1]] as (string | number)[])
  const [fadeFrom, fadeTo] = opacity ?? [1, 1]
  const opacityValue = useTransform(scrollYProgress, (p) => fadeFrom + (fadeTo - fadeFrom) * p)

  const still = reduce || (desktopOnly && !desktop)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={still ? STILL : { y: yValue, opacity: opacityValue, willChange: "transform" }}
    >
      {children}
    </motion.div>
  )
}
