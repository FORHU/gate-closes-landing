"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Check, Copy } from "lucide-react"
import { featuresCopy } from "./features-copy"

const { badge, sample } = featuresCopy.offers

/** Preview of claiming an airport offer: claim reveals the code, which can be copied. */
export function OfferCard() {
  const [claimed, setClaimed] = useState(false)
  const [status, setStatus] = useState("")
  const codeRef = useRef<HTMLElement>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(sample.code)
      setStatus("Copied")
    } catch {
      const range = document.createRange()
      if (codeRef.current) range.selectNodeContents(codeRef.current)
      window.getSelection()?.removeAllRanges()
      window.getSelection()?.addRange(range)
      setStatus("Selected. Press Ctrl+C to copy.")
    }
  }

  return (
    <div
      className="grid gap-4 rounded-[20px] p-5 ring-1 ring-destination-thread/25"
      style={{ background: "linear-gradient(160deg, rgb(255 180 87 / 0.15), rgb(255 180 87 / 0.03) 60%), var(--night-inset)" }}
    >
      <div className="flex items-center gap-3">
        <Image src={badge} alt="" width={38} height={38} />
        <div>
          <p className="font-semibold text-white">{sample.title}</p>
          <p className="font-flight text-xs text-white/45">{sample.meta}</p>
        </div>
        <span className="ml-auto rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-white/50">Example</span>
      </div>

      {claimed ? (
        <div className="flex items-center justify-between gap-3 rounded-[12px] border border-dashed border-destination-thread/50 px-4 py-3">
          <code ref={codeRef} className="font-flight text-lg tracking-[0.12em] text-white select-all">
            {sample.code}
          </code>
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            {status === "Copied" ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            Copy code
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setClaimed(true)}
          className="min-h-12 rounded-full bg-destination-thread px-6 font-semibold text-[#1d1206] transition-transform active:scale-[0.98]"
        >
          Claim offer
        </button>
      )}
      <p aria-live="polite" className="min-h-5 text-sm text-white/50">
        {status}
      </p>
    </div>
  )
}
