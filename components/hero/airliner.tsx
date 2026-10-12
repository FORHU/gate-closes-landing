import { PLANE_PATH } from "@/lib/brand"
import { cn } from "@/lib/utils"

// GateCloses airliner: a climbing three-quarter view, starboard side toward
// the viewer, lit from behind by the sunset in the hero footage, so the body
// reads mostly as a cool silhouette with a warm rim along the top. Livery is
// the brand's own: dark tail carrying the lime logo glyph, lime cheatline.
// Nav lights follow real convention: green on the starboard (near) wingtip,
// red on the port (far) tip, white tail strobe, red belly beacon.
// SVG ids are prefixed `gc-air-` since the page renders exactly one airliner.
export function Airliner({ className }: { className?: string }) {
  const lights = "motion-reduce:animate-none"

  return (
    <svg viewBox="0 0 1000 340" className={cn("overflow-visible", className)} aria-hidden focusable="false">
      <defs>
        <linearGradient id="gc-air-body" x1="0" y1="140" x2="0" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffdcb8" />
          <stop offset="0.09" stopColor="#c7c2c0" />
          <stop offset="0.38" stopColor="#8a8e99" />
          <stop offset="0.72" stopColor="#474c58" />
          <stop offset="1" stopColor="#1f222a" />
        </linearGradient>
        <linearGradient id="gc-air-warm" x1="60" y1="0" x2="940" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9a5a" stopOpacity="0.38" />
          <stop offset="0.55" stopColor="#ff9a5a" stopOpacity="0" />
          <stop offset="1" stopColor="#10131c" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="gc-air-fin" x1="100" y1="30" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2a2e36" />
          <stop offset="1" stopColor="#0e1014" />
        </linearGradient>
        <linearGradient id="gc-air-wing-near" x1="0" y1="205" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7c8291" />
          <stop offset="1" stopColor="#2b2f39" />
        </linearGradient>
        <linearGradient id="gc-air-wing-far" x1="0" y1="70" x2="0" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6b7181" />
          <stop offset="1" stopColor="#363b46" />
        </linearGradient>
        <linearGradient id="gc-air-nacelle" x1="0" y1="234" x2="0" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ead9c8" />
          <stop offset="0.45" stopColor="#8a8f9a" />
          <stop offset="1" stopColor="#272a33" />
        </linearGradient>
        <radialGradient id="gc-air-intake" cx="0.4" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#05060a" />
          <stop offset="1" stopColor="#2c313c" />
        </radialGradient>
        <linearGradient id="gc-air-trail-a" x1="448" y1="0" x2="-560" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff1e2" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff1e2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gc-air-trail-b" x1="420" y1="0" x2="-400" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff1e2" stopOpacity="0.34" />
          <stop offset="1" stopColor="#fff1e2" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="gc-air-green">
          <stop offset="0" stopColor="#7dffb0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7dffb0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gc-air-red">
          <stop offset="0" stopColor="#ff5a52" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff5a52" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gc-air-white">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id="gc-air-windows" width="15" height="12" patternUnits="userSpaceOnUse">
          <rect width="7" height="10" rx="3" fill="#f6d8a4" />
        </pattern>
        <clipPath id="gc-air-body-clip">
          <path
            id="gc-air-body-path"
            d="M64 150C120 146 200 142 300 142L780 142C845 142 890 155 914 172C924 180 922 192 906 198C880 210 835 218 780 218L330 218C230 218 140 190 64 158Z"
          />
        </clipPath>
        <clipPath id="gc-air-fin-clip">
          <path d="M250 146L140 30C134 24 112 22 104 26L100 30L120 150Z" />
        </clipPath>
      </defs>

      {/* contrails */}
      <path d="M448 252H-560" stroke="url(#gc-air-trail-a)" strokeWidth="5" strokeLinecap="round" />
      <path d="M420 166H-400" stroke="url(#gc-air-trail-b)" strokeWidth="4" strokeLinecap="round" />

      {/* far wing and stabiliser, behind the fuselage */}
      <path d="M530 150L398 72C392 67 384 67 381 71L383 77L470 152Z" fill="url(#gc-air-wing-far)" />
      <path d="M383 73L370 46L377 45L392 70Z" fill="#555b69" />
      <path d="M160 152L96 116C92 114 88 115 90 119L104 128L186 152Z" fill="url(#gc-air-wing-far)" />

      {/* tail fin in brand livery */}
      <path d="M250 146L140 30C134 24 112 22 104 26L100 30L120 150Z" fill="url(#gc-air-fin)" />
      <g clipPath="url(#gc-air-fin-clip)">
        <path d="M140 30L250 146L242 150L132 34Z" fill="#bbe40a" />
        <path d={PLANE_PATH} fill="#bbe40a" transform="translate(85.6 45.7) scale(1.6)" />
      </g>

      {/* fuselage */}
      <use href="#gc-air-body-path" fill="url(#gc-air-body)" />
      <g clipPath="url(#gc-air-body-clip)">
        <rect x="60" y="138" width="880" height="84" fill="url(#gc-air-warm)" />
        <rect x="330" y="163" width="452" height="10" fill="url(#gc-air-windows)" />
        <path d="M320 186H900" stroke="#bbe40a" strokeWidth="2.2" />
        <rect x="303" y="152" width="13" height="32" rx="4" fill="none" stroke="rgb(10 12 18 / 0.3)" strokeWidth="1.2" />
        <rect x="792" y="152" width="13" height="32" rx="4" fill="none" stroke="rgb(10 12 18 / 0.3)" strokeWidth="1.2" />
      </g>
      <path d="M842 157L858 157.5L866 168L846 168Z" fill="#14171d" />
      <path d="M862 158L888 160L899 168L871 169Z" fill="#14171d" />
      <path d="M300 143L780 143C842 143 886 155 912 171" fill="none" stroke="#ffe3c4" strokeWidth="1.6" strokeOpacity="0.9" />

      {/* near stabiliser */}
      <path d="M178 176L74 214C66 218 66 223 74 223L94 223L206 186Z" fill="url(#gc-air-wing-near)" />

      {/* near wing, flap line and winglet */}
      <path d="M585 207L345 300L318 300L452 213Z" fill="url(#gc-air-wing-near)" />
      <path d="M585 207L345 300" stroke="#f2d3b3" strokeWidth="1.6" strokeOpacity="0.75" />
      <path d="M440 222L332 292" stroke="rgb(10 12 18 / 0.3)" strokeWidth="1.2" />
      <path d="M318 300L301 268L310 266L335 299Z" fill="#646a78" />

      {/* engine */}
      <path d="M505 224L547 221L550 240L500 242Z" fill="#3c414d" />
      <path
        d="M480 236L560 234C574 234 582 242 582 252C582 262 574 270 560 270L480 268C470 266 464 260 464 252C464 244 470 238 480 236Z"
        fill="url(#gc-air-nacelle)"
      />
      <ellipse cx="579" cy="252" rx="7" ry="17" fill="url(#gc-air-intake)" stroke="#d9cfc4" strokeWidth="2" />
      <path d="M466 246L448 249L448 255L466 258Z" fill="#2b2f39" />
      <path d="M486 238L556 236" stroke="#fff3e6" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />

      {/* lights */}
      <g className={cn("animate-nav-light", lights)}>
        <circle cx="304" cy="270" r="16" fill="url(#gc-air-green)" />
        <circle cx="304" cy="270" r="2.6" fill="#b6ffd2" />
      </g>
      <g className={cn("animate-nav-light [animation-delay:0.7s]", lights)}>
        <circle cx="372" cy="48" r="13" fill="url(#gc-air-red)" />
        <circle cx="372" cy="48" r="2.2" fill="#ffc4bf" />
        <circle cx="560" cy="218" r="10" fill="url(#gc-air-red)" />
        <circle cx="560" cy="218" r="2" fill="#ffc4bf" />
      </g>
      <circle cx="66" cy="154" r="22" fill="url(#gc-air-white)" className={cn("animate-strobe", lights, "motion-reduce:opacity-0")} />
    </svg>
  )
}
