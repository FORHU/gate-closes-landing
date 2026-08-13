import Image from "next/image"
import { SectionContainer } from "@/components/section-container"
import { XIcon } from "@/components/icons/x-icon"
import { InstagramIcon } from "@/components/icons/instagram-icon"
import { FacebookIcon } from "@/components/icons/facebook-icon"
import { footerCopy } from "@/components/footer-copy"

const SOCIAL_ICONS = {
  X: XIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
} as const

export function Footer() {
  return (
    <footer className="rounded-t-2xl bg-linear-to-br from-zinc-900 to-zinc-800">
      <SectionContainer className="flex flex-col gap-8 py-12">
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

        <p className="max-w-md text-sm text-zinc-400">
          {footerCopy.tagline}
        </p>

        <div className="flex items-center gap-4">
          {footerCopy.socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.label]
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-zinc-400 transition-colors hover:text-white"
              >
                <Icon className="size-5" />
              </a>
            )
          })}
        </div>

        <div className="border-t border-zinc-700 pt-6">
          <p className="text-sm text-zinc-500">{footerCopy.copyright}</p>
        </div>
      </SectionContainer>
    </footer>
  )
}
