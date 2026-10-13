import Image from "next/image"
import Link from "next/link"

import { Backdrop } from "@/components/backdrop"
import { DepartureBoard, RequestedPath } from "@/components/departure-board"
import { dmMono } from "@/lib/fonts"
import { cn } from "@/lib/utils"

// Site-wide 404: a single fixed screen (no scrolling) with a departure board.
// Next serves it with a 404 status and adds noindex automatically.
export default function NotFound() {
  return (
    <div className="dark relative isolate h-dvh overflow-hidden bg-[#050505] text-white">
      <Backdrop />
      <h1 className="sr-only">Error 404: page not found</h1>

      <div className="mx-auto grid h-full max-w-[78rem] grid-rows-[auto_minmax(0,1fr)] gap-[clamp(14px,3vh,32px)] px-4 py-[clamp(14px,3vh,32px)] sm:px-8">
        <header className="flex min-w-0 items-center justify-between gap-4 animate-rise motion-reduce:animate-none">
          <Link
            href="/"
            aria-label="Back to GateCloses home"
            className="group flex flex-none items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme"
          >
            <Image src="/gate-closes-logo.svg" alt="" width={34} height={34} />
            <span className="font-semibold tracking-tight text-theme">GateCloses</span>
            <span
              className={cn(
                dmMono.className,
                "ml-1 inline-flex items-center gap-1 rounded-full py-[5px] pr-2.5 pl-[7px] text-[10px] tracking-[0.18em] text-white/50 uppercase ring-1 ring-white/10 transition-[color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-theme group-hover:ring-theme/40"
              )}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="size-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5"
              >
                <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Home
            </span>
          </Link>
          <RequestedPath />
        </header>

        <DepartureBoard />
      </div>
    </div>
  )
}
