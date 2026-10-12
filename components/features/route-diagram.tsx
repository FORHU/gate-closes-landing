"use client"

import { useId, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { useReducedMotionSafe } from "@/components/motion/use-media-query"
import { PLANE_PATH } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { featuresCopy } from "./features-copy"

const { matches } = featuresCopy.connections
type MatchId = (typeof matches)[number]["id"]

// Your flight SIN→ICN, and one example traveler per match type. Geography is
// schematic (SIN bottom-left, BKK north of it, ICN top-right), not to scale.
const YOUR_PATH = "M190 384 Q 360 150 650 96"
const ARCS: Record<MatchId, string> = {
  "parallel-soul": "M190 384 Q 470 230 650 96",
  "destination-thread": "M140 214 Q 360 40 650 96",
  "baton-touch": "M650 96 Q 560 380 190 384",
}
const AIRPORTS = [
  { code: "SIN", city: "Singapore", x: 190, y: 384, lx: 208, ly: 410 },
  { code: "BKK", city: "Bangkok", x: 140, y: 214, lx: 60, ly: 244 },
  { code: "ICN", city: "Seoul", x: 650, y: 96, lx: 668, ly: 92 },
]

/**
 * Route Diagram: the three match types as flight arcs against your own. The
 * toggle buttons pick which match is highlighted; arcs draw in once on first view.
 */
export function RouteDiagram() {
  const [selected, setSelected] = useState<MatchId>("parallel-soul")
  const reduce = useReducedMotionSafe()
  const id = useId()
  const pathId = `${id}-you`
  const current = matches.find((m) => m.id === selected)!

  // Reduced motion: draw the arcs fully at once (not just skip the props, which
  // would leave them at the hidden pathLength the first render set).
  const draw = (delay: number) =>
    reduce
      ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0 } }
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 1.6, delay, ease: [0.3, 0.7, 0.1, 1] as const },
        }

  return (
    <div>
      <div role="group" aria-label="Match types" className="flex flex-wrap gap-2">
        {matches.map((match) => (
          <button
            key={match.id}
            type="button"
            aria-pressed={selected === match.id}
            onClick={() => setSelected(match.id)}
            className={cn(
              "inline-flex min-h-11 items-center gap-2.5 rounded-full py-1.5 pr-5 pl-1.5 text-sm font-semibold ring-1 ring-inset transition-colors duration-300",
              selected === match.id ? "bg-white/[0.08] text-white ring-white/20" : "text-white/55 ring-white/10 hover:text-white"
            )}
          >
            <Image src={match.badge} alt="" width={30} height={30} />
            {match.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-end">
        <div aria-live="polite" className="lg:pb-10">
          <p className="font-flight text-sm" style={{ color: current.color }}>
            {current.route}
          </p>
          <p className="mt-2 text-lg text-white/75">{current.body}</p>
        </div>

        <svg viewBox="0 0 800 460" className="h-auto w-full overflow-visible" role="img" aria-labelledby={`${id}-title`}>
          <title id={`${id}-title`}>
            {`Your flight ${featuresCopy.connections.yourFlight}, with a ${current.name} traveler flying ${current.route}.`}
          </title>
          {matches.map((match, i) => (
            <motion.path
              key={match.id}
              d={ARCS[match.id]}
              fill="none"
              stroke={match.color}
              strokeLinecap="round"
              className="transition-[opacity,stroke-width] duration-500"
              strokeWidth={selected === match.id ? 3.5 : 2}
              opacity={selected === match.id ? 1 : 0.16}
              {...draw(0.3 + i * 0.2)}
            />
          ))}
          <motion.path id={pathId} d={YOUR_PATH} fill="none" stroke="var(--color-theme)" strokeWidth={3.5} strokeLinecap="round" {...draw(0.1)} />
          {!reduce && (
            <g>
              <path d={PLANE_PATH} fill="var(--color-theme)" transform="translate(-24 -23) scale(0.75)" />
              <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </g>
          )}
          {AIRPORTS.map((a) => (
            <g key={a.code}>
              <circle cx={a.x} cy={a.y} r={6} fill="white" />
              <text x={a.lx} y={a.ly} className="fill-white/75 font-flight text-[15px] tracking-[0.08em]">
                {a.code}
              </text>
              <text x={a.lx} y={a.ly + 18} className="fill-white/40 font-flight text-[12px]">
                {a.city}
              </text>
            </g>
          ))}
          <text x={150} y={300} className="fill-theme font-flight text-[11px] tracking-[0.14em]">
            YOUR FLIGHT
          </text>
        </svg>
      </div>
    </div>
  )
}
