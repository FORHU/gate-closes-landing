import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Phone bezel around a live, coded preview of an app screen. Width comes from
 * the caller; height follows the 9:19.5 screen ratio.
 */
export function PhoneMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] rounded-[2.75rem] bg-linear-to-br from-zinc-700 via-zinc-950 to-zinc-800 p-2.5 shadow-[0_50px_100px_-30px_rgb(0_0_0/0.8),0_30px_80px_-40px_rgb(187_228_10/0.18)] ring-1 ring-white/10",
        className
      )}
    >
      <div className="@container relative h-full overflow-hidden rounded-[2.25rem] bg-[#111111]">
        <div className="absolute top-2.5 left-1/2 z-10 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  )
}
