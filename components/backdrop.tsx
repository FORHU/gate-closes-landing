// Dark ambient background shared by the admin sign-in and the 404 page:
// drifting glows, a faint grid, a dashed flight path with a plane on it, and
// film grain. Fixed and inert, so it never repaints on scroll. Place it in a
// parent with `isolate` so the -z-10 layer stays behind that page's content.

// Fine film grain, drawn once as an SVG data URI.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const PLANE =
  "M19 44.72L11.5 31.9075L16.3 30.575L21.9 35.3925L28.9 33.4963L18.55 19.3513L24.35 17.7625L39.3 30.6263L47.8 28.2688C48.8667 27.9613 49.875 28.0894 50.825 28.6531C51.775 29.2169 52.4 30.0454 52.7 31.1388C53 32.2321 52.875 33.2656 52.325 34.2394C51.775 35.2131 50.9667 35.8538 49.9 36.1613L19 44.72Z"

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
