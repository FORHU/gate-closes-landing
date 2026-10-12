"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import { Check, Copy, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDay, kindLabel, type PrototypeOffer } from "./offer-model"

// The app's map sheets always use its dark palette (GateColors.dark in
// gate-closes-app-v2/lib/theme/tokens/colors.dart), whatever the admin theme.
export const APP = {
  background: "#120A0D",
  surface: "#201519",
  surfaceElevated: "#2A1B20",
  textSecondary: "#CDC0C5",
  textMuted: "#A8969D",
  border: "rgb(244 238 240 / 0.16)",
  offer: "#F2994A",
} as const

/**
 * Phone bezel around an app screen. Width comes from the caller. `map` draws a
 * faint map with an airport circle behind the content, the way an offer sheet
 * opens over the map in the app.
 */
export function PhoneFrame({ children, className, map = false }: { children: ReactNode; className?: string; map?: boolean }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-full rounded-[2.6rem] bg-linear-to-br from-zinc-600 via-zinc-950 to-zinc-800 p-2 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] ring-1 ring-ink/15",
        className
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[2.15rem] text-white" style={{ background: APP.background }}>
        <div className="absolute top-2 left-1/2 z-20 h-5 w-[28%] -translate-x-1/2 rounded-full bg-black" />
        {map && (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.07)_1px,transparent_1.5px)] bg-[length:14px_14px]">
            <div
              className="absolute top-[30%] left-1/2 aspect-square w-[70%] -translate-1/2 rounded-full"
              style={{ border: `1.5px solid ${APP.offer}55`, background: `${APP.offer}0d` }}
            />
            <span className="absolute top-[30%] left-[58%] size-3 -translate-1/2 rounded-full" style={{ background: APP.offer }} />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/** Offer image at 16:9, or a quiet placeholder when there's none (or it fails to load). */
export function OfferImage({ offer, className }: { offer: PrototypeOffer; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null)
  const broken = failed === offer.imageUrl

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-[12px]", className)} style={{ background: APP.surface }}>
      {offer.imageUrl && !broken ? (
        <Image
          src={offer.imageUrl}
          alt=""
          fill
          unoptimized
          sizes="320px"
          className="object-cover"
          onError={() => setFailed(offer.imageUrl)}
        />
      ) : (
        <div className="grid size-full place-items-center" style={{ color: APP.textMuted }}>
          <ImageOff strokeWidth={1.5} className="size-6" aria-hidden />
        </div>
      )}
    </div>
  )
}

/**
 * Web port of the app's OfferSheet (worldMap/presentation/widgets/offer_sheet.dart):
 * image, "Kind · IATA", title, body, validity, Claim (reveals the voucher
 * code) and the optional link button. Claiming here is local only.
 */
export function OfferSheetPreview({ offer, airport }: { offer: PrototypeOffer; airport: string }) {
  const [claimed, setClaimed] = useState(false)
  const [copied, setCopied] = useState(false)
  const claimable = offer.rewardCode.trim().length > 0

  async function copy() {
    try {
      await navigator.clipboard.writeText(offer.rewardCode)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-t-[20px] px-4 pt-2.5 pb-5" style={{ background: APP.surfaceElevated }}>
      <span className="mx-auto h-1 w-9 rounded-full" style={{ background: APP.border }} />
      <OfferImage offer={offer} className="mt-1" />
      <div>
        <p className="text-[11px] font-semibold" style={{ color: APP.offer }}>
          {kindLabel(offer.kind)} · {airport}
        </p>
        <p className="mt-1 text-[17px] leading-snug font-bold text-white">{offer.title || "Untitled offer"}</p>
        {offer.body && (
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: APP.textSecondary }}>
            {offer.body}
          </p>
        )}
        {offer.endsAt && (
          <p className="mt-2 text-[11px]" style={{ color: APP.textMuted }}>
            Until {formatDay(offer.endsAt)}
          </p>
        )}
      </div>

      {claimed ? (
        <div
          className="flex flex-col items-center gap-1.5 rounded-[12px] p-3"
          style={{ background: "rgb(242 153 74 / 0.12)", border: "1px solid rgb(242 153 74 / 0.5)" }}
        >
          <span className="text-[13px] font-semibold" style={{ color: APP.offer }}>
            Claimed!
          </span>
          <span className="text-[19px] font-bold tracking-[0.12em] text-white select-all">{offer.rewardCode}</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium"
            style={{ color: APP.offer }}
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Code copied" : "Copy code"}
          </button>
        </div>
      ) : (
        claimable && (
          <button
            type="button"
            onClick={() => setClaimed(true)}
            className="h-11 rounded-[12px] text-[14px] font-semibold text-black transition-transform active:scale-[0.98]"
            style={{ background: APP.offer }}
          >
            Claim
          </button>
        )
      )}

      {offer.ctaUrl && (
        <span
          className="grid h-11 place-items-center rounded-[12px] text-[14px] font-medium text-white"
          style={{ border: `1px solid ${APP.border}` }}
        >
          {offer.ctaLabel || "Open"}
        </span>
      )}
    </div>
  )
}
