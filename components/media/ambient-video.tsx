"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Source = { src: string; media?: string }

type AmbientVideoProps = {
  /** Most specific first: `<source media>` picks the first match. */
  sources: readonly Source[]
  poster: string
  posterSizes?: string
  /** Hero only: preload the poster as the LCP image. */
  priority?: boolean
  className?: string
  mediaClassName?: string
}

const REDUCE = "(prefers-reduced-motion: reduce)"

type NetworkInformation = { saveData?: boolean }

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCE)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

// Playback is opt-in: never under reduced motion or Save-Data, and never during
// SSR (the poster renders first, the video mounts on the client).
function canPlay() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  return !window.matchMedia(REDUCE).matches && !connection?.saveData
}

/**
 * Decorative looping background video. The poster is always rendered beneath
 * (and is all that shows if the video can't load or play). The clip only
 * downloads once it nears the viewport and pauses whenever it leaves it.
 */
export function AmbientVideo({
  sources,
  poster,
  posterSizes = "100vw",
  priority = false,
  className,
  mediaClassName,
}: AmbientVideoProps) {
  const allowed = useSyncExternalStore(subscribe, canPlay, () => false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true

    const reveal = () => video.setAttribute("data-ready", "")
    video.addEventListener("playing", reveal)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay refused (low-power mode, browser policy): keep the poster.
          })
        } else {
          video.pause()
        }
      },
      { rootMargin: "200px 0px" }
    )
    observer.observe(video)

    return () => {
      observer.disconnect()
      video.removeEventListener("playing", reveal)
    }
  }, [allowed])

  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={poster}
        alt=""
        fill
        priority={priority}
        sizes={posterSizes}
        className={cn("object-cover", mediaClassName)}
      />
      {allowed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          className={cn(
            "absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 data-ready:opacity-100",
            mediaClassName
          )}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} media={source.media} type="video/mp4" />
          ))}
        </video>
      )}
    </div>
  )
}
