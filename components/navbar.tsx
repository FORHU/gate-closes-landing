"use client"

import { useState, useEffect} from "react"
import Image from "next/image"
import { Download } from "lucide-react"
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
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const updateScroll = () => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  };

  updateScroll();

  window.addEventListener("scroll", updateScroll, {
    passive: true,
  });

  return () => window.removeEventListener("scroll", updateScroll);
}, []);

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
          <Image
            src="/gate-closes-logo.svg"
            alt="GateCloses Logo"
            width={40}
            height={40}
          />
          <span
            className={cn(
              "text-lg font-bold tracking-tight transition-colors duration-300 text-theme",
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
            nativeButton={false}
            size="lg"
            render={(props) => <a href="#" {...props} />} 
            className={cn(
              "rounded-xl px-3 py-5 text-sm font-semibold transition-all duration-300 text-secondary bg-secondary-foreground",
            )}
          >
            <Download className="size-4" />
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
                    "transition-colors duration-300 ",
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
                <Button
                  nativeButton={false}
                  size="lg"
                  render={(props) => <a href="#" {...props} />} 
                  className="w-full rounded-xl px-2 py-5 bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
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
