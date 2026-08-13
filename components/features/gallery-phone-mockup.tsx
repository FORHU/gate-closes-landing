import type { ComponentProps } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type GalleryPhoneMockupProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
} & Omit<ComponentProps<typeof motion.div>, "className" | "children">

export function GalleryPhoneMockup({
  src,
  alt,
  className,
  priority = false,
  ...motionProps
}: GalleryPhoneMockupProps) {
  return (
    <motion.div
      className={cn(
        "relative w-[220px] shrink-0 rounded-[2.5rem] border-[6px] border-zinc-900 bg-zinc-900 p-2 sm:w-[240px] lg:w-[260px]",
        className
      )}
      {...motionProps}
    >
      <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem] bg-zinc-100">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover object-top"
          sizes="(max-width: 768px) 220px, 260px"
        />
      </div>
    </motion.div>
  )
}
