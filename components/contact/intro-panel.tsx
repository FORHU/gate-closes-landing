import Image from "next/image"
import { contactCopy } from "./contact-copy"

export function IntroPanel() {
  return (
    <div className="flex h-full flex-col justify-between bg-linear-to-br from-zinc-900 to-zinc-800 px-6 py-10 sm:px-8 sm:py-12">
      <div className="flex items-center gap-2.5">
        <Image
          src="/gate-closes-logo.svg"
          alt="GateCloses Logo"
          width={40}
          height={40}
        />
        <span className="text-lg font-bold tracking-tight text-theme">
          GateCloses
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 mt-2">
        {contactCopy.featureBadges.map((badge) => (
          <Image
            key={badge.src}
            src={badge.src}
            alt=""
            width={40}
            height={40}
            className="size-8 sm:size-10"
          />
        ))}
      </div>
    </div>
  )
}
