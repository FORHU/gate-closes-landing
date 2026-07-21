"use client"

import { useState, useEffect, useCallback } from "react"
import { ScrollProgress } from "./scroll-progress"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const

const SCROLL_THRESHOLD = 50

export function Navbar() {
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window === "undefined") return false
    return window.scrollY > SCROLL_THRESHOLD
  })

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-black/5 bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <ScrollProgress />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <span
            className={cn(
              "text-lg font-bold tracking-tight transition-colors duration-300 text-primary",
            )}
          >
            GateCloses
          </span>
        </a>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 text-primary hover:bg-primary-foreground",
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:block">
          <Button
            size="lg"
            render={<a href="#" />}
            className={cn(
              "rounded-full px-5 text-sm font-semibold transition-all duration-300 text-secondary bg-secondary-foreground",
            )}
          >
            Download APK
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className={cn(
                    "transition-colors duration-300",
                    scrolled
                      ? "text-zinc-900 hover:bg-zinc-100"
                      : "text-white hover:bg-white/10"
                  )}
                />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-12 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="my-4 h-px bg-zinc-200" />
                <Button
                  size="lg"
                  render={<a href="#" />}
                  className="w-full rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Download APK
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
