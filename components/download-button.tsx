"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"

/**
 * The app download button (navbar, mobile menu, hero). Until
 * `site.download.href` is set it's a disabled "coming soon" button rather
 * than a link to nowhere.
 */
export function DownloadButton({
  className,
  showIcon = true,
}: {
  className?: string
  showIcon?: boolean
}) {
  const { href, label, comingSoonLabel } = site.download
  const icon = showIcon ? <Download className="size-4" /> : null

  if (!href) {
    return (
      <Button size="lg" disabled className={className}>
        {icon}
        {comingSoonLabel}
      </Button>
    )
  }

  return (
    <Button
      nativeButton={false}
      size="lg"
      render={(props) => <a href={href} {...props} />}
      className={className}
    >
      {icon}
      {label}
    </Button>
  )
}
