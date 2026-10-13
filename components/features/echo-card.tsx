"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Laugh, Pause, Play, ThumbsUp } from "lucide-react"
import { WAVE } from "@/components/how-it-works/app-screens"
import { cn } from "@/lib/utils"
import { featuresCopy } from "./features-copy"

const { sample } = featuresCopy.echo

function Waveform({ className, onAnimationEnd }: { className?: string; onAnimationEnd?: () => void }) {
  return (
    <span className={cn("flex h-9 items-center justify-between", className)} onAnimationEnd={onAnimationEnd}>
      {WAVE.map((h, i) => (
        <i key={i} className="w-[3px] shrink-0 rounded-full bg-current" style={{ height: `${h}%` }} />
      ))}
    </span>
  )
}

/**
 * Preview of an echo as it appears in the app's feed. The play button runs
 * the waveform's progress fill for the clip's 8 seconds (visual only, there's
 * no audio); the fill's own animationend resets it.
 */
export function EchoCard() {
  const [playing, setPlaying] = useState(false)

  return (
    <article className="grid w-full max-w-[460px] gap-4 rounded-[20px] bg-[#1a1d23] p-5 shadow-[0_30px_60px_-30px_#000] ring-1 ring-white/15">
      <header className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-parallel-soul/20 font-bold text-parallel-soul">
          M
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-white">{sample.author}</p>
          <p className="font-flight text-xs text-white/45">{sample.meta}</p>
        </div>
        <Image src="/badges/parallel-soul.svg" alt="Parallel Soul" width={30} height={30} className="ml-auto" />
      </header>

      <p className="text-white/90">{sample.caption}</p>

      <div className="flex items-center gap-3 rounded-[20px] bg-white/[0.04] py-2.5 pr-4 pl-2.5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          aria-label={playing ? "Pause echo" : "Play echo"}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-theme text-[#11140a] transition-transform active:scale-90"
        >
          {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
        </button>
        <span className="relative min-w-0 flex-1">
          <Waveform className="text-white/30" />
          {playing && (
            <Waveform
              className="absolute inset-0 animate-wave-progress text-theme motion-reduce:animate-none"
              onAnimationEnd={() => setPlaying(false)}
            />
          )}
        </span>
        <span className="font-flight text-sm text-white/60">{sample.duration}</span>
      </div>

      <footer className="flex flex-wrap items-center gap-2 text-sm">
        {[
          { Icon: ThumbsUp, count: sample.reactions.like, label: "likes" },
          { Icon: Heart, count: sample.reactions.love, label: "loves" },
          { Icon: Laugh, count: sample.reactions.haha, label: "laughs" },
        ].map(({ Icon, count, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-white/80">
            <Icon className="size-3.5" aria-hidden />
            {count}
            <span className="sr-only">{label}</span>
          </span>
        ))}
        <span className="ml-auto text-white/45">{sample.footer}</span>
      </footer>
    </article>
  )
}
