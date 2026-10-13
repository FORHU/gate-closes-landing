import Image from "next/image"
import { SectionContainer } from "@/components/section-container"
import { XIcon } from "@/components/icons/x-icon"
import { InstagramIcon } from "@/components/icons/instagram-icon"
import { FacebookIcon } from "@/components/icons/facebook-icon"
import { footerCopy } from "@/components/footer-copy"
import { site } from "@/lib/site"

const SOCIAL_ICONS = {
  X: XIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
} as const

const LINK = "py-1 text-white/60 transition-colors hover:text-white"

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08]">
      <SectionContainer className="pt-16 pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#home" className="inline-flex items-center gap-2.5">
              <Image src="/gate-closes-logo.svg" alt="" width={40} height={40} />
              <span className="text-lg font-bold tracking-tight text-theme">GateCloses</span>
            </a>
            <p className="mt-5 max-w-sm text-sm text-white/50">{footerCopy.tagline}</p>
          </div>

          {footerCopy.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col items-start gap-2 text-sm">
              <p className="mb-2 font-semibold text-white">{column.title}</p>
              {column.links.map((link) => (
                <a key={link.label} href={link.href} className={LINK}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}

          <div className="flex flex-col items-start gap-2 text-sm">
            <p className="mb-2 font-semibold text-white">Contact</p>
            <a href="#contact" className={LINK}>
              {site.contactLabel}
            </a>
            <p className="font-flight break-all text-white/60 select-all">{site.contactEmail}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
          <p className="text-sm text-white/40">{footerCopy.copyright}</p>
          <div className="flex items-center gap-1">
            {footerCopy.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label]
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`GateCloses on ${social.label}`}
                  className="grid size-11 place-items-center rounded-full text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </a>
              )
            })}
          </div>
        </div>
      </SectionContainer>
    </footer>
  )
}
