import Image from "next/image"
import { cn } from "@/lib/utils"

type PhoneMockupProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function PhoneMockup({
  src,
  alt,
  className,
  priority = false,
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative w-[220px] shrink-0 rounded-[2.5rem] border-[6px] border-zinc-900 bg-zinc-900 p-2 shadow-2xl shadow-black/20 sm:w-[240px] lg:w-[260px]",
        className
      )}
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
    </div>
  )
}
