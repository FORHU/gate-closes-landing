import Image from "next/image"
import { SectionContainer } from "@/components/section-container"
import { cn } from "@/lib/utils"
import { EchoCard } from "./echo-card"
import { featuresCopy } from "./features-copy"
import { OfferCard } from "./offer-card"
import { RouteDiagram } from "./route-diagram"

const PANEL = "rounded-[28px] bg-night-raised ring-1 ring-white/[0.08]"
const H3 = "font-display text-[clamp(1.6rem,2.8vw,2.35rem)] leading-[1.08] font-semibold tracking-[-0.028em] text-balance text-white"

function FeatureName({ children, badge, className }: { children: string; badge?: string; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 font-semibold", className)}>
      {badge && <Image src={badge} alt="" width={28} height={28} />}
      {children}
    </p>
  )
}

export function FeaturesSection() {
  const { echo, connections, map, offers } = featuresCopy

  return (
    <SectionContainer className="py-28 sm:py-36">
      <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4.3vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.032em] text-balance text-white">
        {featuresCopy.heading}
      </h2>
      <p className="mt-6 max-w-[36rem] text-lg text-white/65">{featuresCopy.subheading}</p>

      {/* Terminal Echo: split panel, copy left, live card right */}
      <article className={cn(PANEL, "mt-14 grid overflow-hidden sm:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]")}>
        <div className="flex flex-col gap-5 p-7 sm:p-12 lg:p-16">
          <FeatureName badge={echo.badge} className="text-theme">
            {echo.name}
          </FeatureName>
          <h3 className={H3}>{echo.heading}</h3>
          <p className="max-w-[30rem] text-white/65">{echo.body}</p>
        </div>
        <div
          className="grid place-items-center p-6 sm:p-12 lg:p-14"
          style={{ background: "radial-gradient(90% 90% at 70% 30%, rgb(240 165 101 / 0.14), transparent 60%), var(--night-inset)" }}
        >
          <EchoCard />
        </div>
      </article>

      {/* Connections: full-width diagram with tabs */}
      <article className={cn(PANEL, "mt-5 p-7 sm:p-12 lg:p-16")}>
        <FeatureName className="text-white/70">{connections.name}</FeatureName>
        <h3 className={cn(H3, "mt-5 max-w-[22ch]")}>{connections.heading}</h3>
        <p className="mt-5 mb-10 max-w-[36rem] text-white/65">{connections.body}</p>
        <RouteDiagram />
      </article>

      {/* Bento: map (wide) + offers */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <article className={cn(PANEL, "flex flex-col gap-4 p-7 sm:p-10")}>
          <FeatureName className="text-white/70">{map.name}</FeatureName>
          <h3 className={cn(H3, "text-[clamp(1.35rem,2vw,1.7rem)]")}>{map.heading}</h3>
          <p className="max-w-[30rem] text-white/65">{map.body}</p>
          <div
            aria-hidden
            className="relative mt-4 h-64 overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.07)_1px,transparent_1.5px),radial-gradient(70%_80%_at_45%_50%,#161c18,#0b0c0e)] bg-[length:16px_16px,auto] ring-1 ring-white/[0.08] sm:h-72"
          >
            <div className="absolute top-1/2 left-[46%] aspect-square w-[min(300px,70%)] -translate-1/2 rounded-full border-[1.5px] border-theme/50 bg-theme/[0.05]" />
            {map.pins.map((pin) => (
              <span
                key={pin.badge}
                className="absolute grid size-9 -translate-1/2 place-items-center drop-shadow-[0_8px_10px_rgb(0_0_0/0.6)]"
                style={{ left: pin.x, top: pin.y }}
              >
                <Image src={pin.badge} alt="" width={36} height={36} />
                {"count" in pin && <span className="absolute text-xs font-bold text-[#111]">{pin.count}</span>}
              </span>
            ))}
          </div>
        </article>

        <article className={cn(PANEL, "flex flex-col gap-4 p-7 sm:p-10")}>
          <FeatureName className="text-destination-thread">{offers.name}</FeatureName>
          <h3 className={cn(H3, "text-[clamp(1.35rem,2vw,1.7rem)]")}>{offers.heading}</h3>
          <p className="text-white/65">{offers.body}</p>
          <div className="mt-auto pt-4">
            <OfferCard />
          </div>
        </article>
      </div>
    </SectionContainer>
  )
}
