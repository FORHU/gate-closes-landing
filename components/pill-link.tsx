import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const VARIANTS = {
  primary:
    "bg-theme text-[#11140a] shadow-[0_10px_40px_-12px_rgb(187_228_10/0.55)] hover:-translate-y-px hover:shadow-[0_16px_48px_-12px_rgb(187_228_10/0.7)]",
  ghost: "bg-white/[0.06] text-white ring-1 ring-white/15 ring-inset hover:bg-white/[0.11]",
} as const

/** Full-pill call-to-action link. Labels stay on one line at every width. */
export function PillLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"a"> & { variant?: keyof typeof VARIANTS }) {
  return (
    <a
      className={cn(
        "inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full px-7 text-[0.95rem] font-semibold whitespace-nowrap transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-theme active:scale-[0.98] [&_svg]:size-[18px] [&_svg]:shrink-0",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  )
}
