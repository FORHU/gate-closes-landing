"use client"

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"

import { dmMono } from "@/lib/fonts"
import { cn } from "@/lib/utils"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

// One split-flap tile: two-tone face with a hairline split across the middle.
const TILE =
  "relative inline-grid h-[1.45em] w-[1.05em] place-items-center rounded-[0.14em] bg-[linear-gradient(to_bottom,#181818_0_49.5%,#0e0e0e_50.5%_100%)] leading-none font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_1px_0_rgb(0_0_0/0.6)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/85"

function Tiles({ text, className, tileClassName }: { text: string; className?: string; tileClassName?: string }) {
  return (
    <div role="img" aria-label={text} className={cn("flex gap-[3px]", className)}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          data-final={ch}
          className={cn(TILE, tileClassName, ch === " " && "text-transparent")}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </div>
  )
}

const ROWS = [
  { area: "[grid-area:flight]", label: "Flight", value: "GC404" },
  { area: "[grid-area:gate]", label: "Gate", value: "404" },
  { area: "[grid-area:dest]", label: "Destination", value: "NOT FOUND" },
  { area: "[grid-area:status]", label: "Status", value: "CLOSED", status: true },
] as const

// Local time, rendered as --:-- on the server so hydration matches.
const subscribeMinute = (onChange: () => void) => {
  const id = setInterval(onChange, 15_000)
  return () => clearInterval(id)
}
const localTime = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

function Clock() {
  const time = useSyncExternalStore(subscribeMinute, localTime, () => "--:--")
  return <span className="tracking-normal tabular-nums">{time} LOCAL</span>
}

/** The requested URL, shortened with an ellipsis when long. */
export function RequestedPath() {
  const pathname = usePathname()
  return (
    <span
      className={cn(
        dmMono.className,
        "min-w-0 truncate text-[11px] tracking-[0.14em] text-white/30 uppercase max-sm:hidden"
      )}
    >
      Requested{" "}
      <b className="font-medium tracking-[0.02em] text-white/50 normal-case" title={pathname}>
        {pathname}
      </b>
    </span>
  )
}

/**
 * The 404 departure board. Tiles flip through random characters before
 * settling, like an airport board; clicking the board replays it.
 */
export function DepartureBoard() {
  const boardRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  const flip = useCallback(() => {
    timers.current.splice(0).forEach(clearTimeout)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const tiles = [...(boardRef.current?.querySelectorAll<HTMLElement>("[data-final]") ?? [])].filter(
      (tile) => tile.dataset.final !== " "
    )
    tiles.forEach((tile, i) => {
      const flips = 6 + Math.floor(Math.random() * 6) + Math.floor(i / 2)
      for (let n = 0; n <= flips; n++) {
        timers.current.push(
          window.setTimeout(() => {
            tile.textContent =
              n === flips ? tile.dataset.final! : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            tile.classList.remove("animate-flick")
            void tile.offsetWidth // restart the flick animation
            tile.classList.add("animate-flick")
          }, 260 + i * 28 + n * 70)
        )
      }
    })
  }, [])

  useEffect(() => {
    const pending = timers.current
    flip()
    return () => {
      pending.splice(0).forEach(clearTimeout)
    }
  }, [flip])

  return (
    <section
      aria-label="Departure board"
      className={cn(
        dmMono.className,
        "min-w-0 self-center rounded-[28px] bg-white/[0.03] p-1.5 shadow-[0_40px_120px_-50px_oklch(0.86_0.18_124/0.25)] ring-1 ring-white/10 animate-rise [animation-delay:80ms] motion-reduce:animate-none"
      )}
    >
      <div
        ref={boardRef}
        onClick={flip}
        title="Replay the board"
        className="flex cursor-pointer flex-col gap-[clamp(12px,3.2vh,34px)] rounded-[22px] bg-[#0b0b0b] p-[clamp(16px,min(4vw,4.4vh),44px)] shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)]"
      >
        <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.22em] text-white/50 uppercase [@media(max-height:560px)]:hidden">
          <span className="flex items-center gap-2.5">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
              <path
                d="M2 12.5h12M3.2 9.6 2 7.4l1-.3 1.3 1 2-.5L4 4.4l1.2-.3 3.5 3 2.4-.6a1 1 0 0 1 .5 1.9L3.2 9.6Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            Departures<span className="max-sm:hidden">&nbsp;&middot; Terminal 404</span>
          </span>
          <span className="max-sm:hidden">
            <Clock />
          </span>
        </div>

        <div className="flex items-end justify-between gap-[clamp(16px,3vw,40px)] max-sm:flex-col max-sm:items-start">
          <Tiles
            text="404"
            className="gap-[clamp(4px,0.7vw,8px)] text-[clamp(44px,min(12vw,26vh),200px)] max-sm:text-[clamp(44px,min(24vw,18vh),130px)]"
            tileClassName="rounded-[0.09em] text-theme"
          />

          <dl className="m-0 grid grid-cols-[repeat(2,auto)] gap-x-[clamp(18px,2.4vw,32px)] gap-y-[clamp(10px,2vh,18px)] [grid-template-areas:'flight_gate'_'dest_status'] max-sm:w-full max-sm:grid-cols-[repeat(3,auto)] max-sm:justify-between max-sm:gap-x-2.5 max-sm:[grid-template-areas:'flight_gate_status'_'dest_dest_dest']">
            {ROWS.map((row) => (
              <div key={row.label} className={cn("flex min-w-0 flex-col gap-1.5", row.area)}>
                <dt className="text-[clamp(10px,1.4vh,12px)] tracking-[0.22em] text-white/30 uppercase">
                  {row.label}
                </dt>
                <dd className="m-0 text-[clamp(13px,min(2vw,3.1vh),25px)] max-sm:text-[clamp(11px,min(3.6vw,2.2vh),16px)]">
                  <Tiles
                    text={row.value}
                    className={"status" in row ? "animate-blink motion-reduce:animate-none" : undefined}
                    tileClassName={"status" in row ? "text-theme" : "text-white"}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
