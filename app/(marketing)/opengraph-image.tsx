import { ImageResponse } from "next/og"
import { site } from "@/lib/site"

// The preview shown when the site is shared (chat apps, social posts).
export const alt = site.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: site.themeColor }}>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            {site.tagline}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", lineHeight: 1.4 }}>
            {site.description}
          </div>
        </div>
      </div>
    ),
    size
  )
}
