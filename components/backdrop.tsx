// Dark ambient background shared by the admin sign-in and the 404 page:
// drifting glows, a faint grid, a dashed flight path with a plane on it, and
// film grain. Fixed and inert, so it never repaints on scroll. Place it in a
// parent with `isolate` so the -z-10 layer stays behind that page's content.

import { PLANE_PATH as PLANE } from "@/lib/brand"
import { GRAIN } from "@/lib/grain"

/** `plane={false}` keeps the dashed flight path but drops the moving plane. */
export function Backdrop({ plane = true }: { plane?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] size-[42rem] rounded-full bg-theme/[0.14] blur-[120px] animate-drift motion-reduce:animate-none" />
      <div className="absolute -right-[15%] -bottom-[25%] size-[38rem] rounded-full bg-[oklch(0.7_0.08_220)]/[0.10] blur-[140px] animate-drift [animation-delay:-9s] motion-reduce:animate-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--ink)_4%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--ink)_4%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path
          id="gc-flight-route"
          d="M-80 760 C 260 620, 420 300, 760 330 S 1180 640, 1260 420 S 1180 120, 980 160 S 1100 -40, 1540 60"
          fill="none"
          stroke="oklch(0.86 0.18 124 / 0.18)"
          strokeWidth={1.2}
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        {plane && (
          <g className="fill-theme opacity-80 motion-reduce:hidden">
            <path transform="translate(-22 -22) scale(0.68)" d={PLANE} />
            <animateMotion dur="26s" repeatCount="indefinite" rotate="auto">
              <mpath href="#gc-flight-route" />
            </animateMotion>
          </g>
        )}
      </svg>
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}
