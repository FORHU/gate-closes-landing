"use client"

import { useState } from "react"
import Image from "next/image"
import { Download, Menu, X } from "lucide-react"
import { useMotionValueEvent, useScroll } from "motion/react"
import { PillLink } from "@/components/pill-link"
import { ScrollProgress } from "@/components/scroll-progress"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { plusJakarta } from "@/lib/fonts"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const SCROLL_THRESHOLD = 40

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Only re-renders when crossing the threshold, not on every scroll frame.
  useMotionValueEvent(scrollY, "change", (y) => {
    const past = y > SCROLL_THRESHOLD
    if (past !== scrolled) setScrolled(past)
  })

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        scrolled
          ? "bg-night/90 shadow-[0_1px_0_rgb(255_255_255/0.08)] lg:bg-night/60 lg:backdrop-blur-md lg:backdrop-saturate-150"
          : "bg-transparent"
      )}
    >
      <ScrollProgress />
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <Image src="/gate-closes-logo.svg" alt="" width={38} height={38} priority />
          <span className="text-lg font-bold tracking-tight text-theme">GateCloses</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {site.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <PillLink href={site.downloadUrl} className="hidden min-h-11 px-5 text-sm lg:inline-flex">
          <Download aria-hidden />
          {site.downloadLabel}
        </PillLink>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            className="grid size-11 place-items-center rounded-full bg-white/[0.07] text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className={cn("dark w-[min(20rem,85vw)] border-white/10 bg-night p-6 text-white", plusJakarta.variable, "font-display")}
          >
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold text-white">Menu</SheetTitle>
              <SheetClose className="grid size-11 place-items-center rounded-full bg-white/[0.07]" aria-label="Close menu">
                <X className="size-5" />
              </SheetClose>
            </div>
            <div className="mt-8 flex flex-col">
              {site.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/[0.08] py-4 text-lg font-medium text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <PillLink href={site.downloadUrl} className="mt-8 w-full" onClick={() => setMenuOpen(false)}>
              <Download aria-hidden />
              {site.downloadLabel}
            </PillLink>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
