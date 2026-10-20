import { Download } from "lucide-react"
import { Parallax } from "@/components/motion/parallax"
import { PillLink } from "@/components/pill-link"
import { SectionContainer } from "@/components/section-container"
import { PLANE_PATH } from "@/lib/brand"
import { site } from "@/lib/site"

// A dashed flight route in the style of the 404/admin Backdrop, scoped to this
// band. It arcs above the headline so the plane never crosses the text.
const ROUTE = "M-80 170 C 260 60, 520 40, 760 95 S 1160 180, 1540 50"

export function CtaSection() {
  return (
    <div className="relative isolate overflow-hidden bg-[radial-gradient(45%_40%_at_50%_58%,rgb(187_228_10/0.08),transparent)] py-32 text-center sm:py-44">
      {/* The route sits on a slower layer than the text, so it drifts behind it. */}
      <Parallax className="pointer-events-none absolute inset-0 -z-10" y={[60, -60]}>
        <svg aria-hidden viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" className="size-full">
          <path id="gc-cta-route" d={ROUTE} fill="none" stroke="rgb(187 228 10 / 0.22)" strokeWidth={1.3} strokeDasharray="2 9" strokeLinecap="round" />
          <g className="motion-reduce:hidden">
            <path d={PLANE_PATH} fill="var(--color-theme)" opacity={0.85} transform="translate(-22 -22) scale(0.7)" />
            <animateMotion dur="28s" repeatCount="indefinite" rotate="auto">
              <mpath href="#gc-cta-route" />
            </animateMotion>
          </g>
        </svg>
      </Parallax>

      <SectionContainer>
        <h2 className="mx-auto max-w-[14ch] font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-white">
          Your next gate is full of people going your way.
        </h2>
        <p className="mx-auto mt-6 max-w-[32rem] text-lg text-white/65">
          Get GateCloses, add your boarding pass, and say hello before the gate closes.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3 max-sm:[&>a]:w-full">
          <PillLink href={site.downloadUrl}>
            <Download aria-hidden />
            {site.downloadLabel}
          </PillLink>
          <PillLink href="#contact" variant="ghost">
            {site.contactLabel}
          </PillLink>
        </div>
      </SectionContainer>
    </div>
  )
}
