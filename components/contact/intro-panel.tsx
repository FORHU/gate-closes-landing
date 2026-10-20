import Image from "next/image"
import { contactCopy } from "./contact-copy"

export function IntroPanel() {
  return (
    <div className="flex h-full flex-col gap-6 bg-linear-to-br from-night-inset to-[#0b0d10] px-7 py-10 sm:px-12 sm:py-14">
      <div className="flex items-center gap-2.5">
        <Image src="/gate-closes-logo.svg" alt="" width={40} height={40} />
        <span className="text-lg font-bold tracking-tight text-theme">GateCloses</span>
      </div>

      <div>
        <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-white">
          {contactCopy.intro.heading}
        </h2>
        <p className="mt-4 max-w-sm text-white/65">{contactCopy.intro.subheading}</p>
      </div>

      <div className="mt-auto grid gap-5 pt-6">
        <div className="flex items-center gap-3">
          {contactCopy.featureBadges.map((badge) => (
            <Image key={badge.src} src={badge.src} alt={badge.alt} width={36} height={36} />
          ))}
        </div>
        <p className="font-flight text-sm break-all text-white/75 select-all">{contactCopy.recipientEmail}</p>
      </div>
    </div>
  )
}
