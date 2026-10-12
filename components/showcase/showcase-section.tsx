import Image from "next/image"
import { AmbientVideo } from "@/components/media/ambient-video"
import { Parallax } from "@/components/motion/parallax"
import { SectionContainer } from "@/components/section-container"
import { cn } from "@/lib/utils"

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`

// One real moment per feature. Unsplash photos (Unsplash License); credits in
// public/media/CREDITS.md.
const MOMENTS = [
  {
    title: "At the gate",
    body: "Hear how long the security line is from someone standing in it.",
    badge: "/badges/terminal-echo.svg",
    feature: "Terminal Echo",
    photo: unsplash("1530521954074-e64f6810b32d"),
    alt: "A traveler waiting at the gate with their feet up on a suitcase while a plane takes off outside",
    frame: "aspect-[4/5] md:aspect-[4/5]",
  },
  {
    title: "On a layover",
    body: "Meet someone else heading to Seoul, landing the same evening as you.",
    badge: "/badges/destination-thread.svg",
    feature: "Destination Thread",
    photo: unsplash("1490430657723-4d607c1503fc"),
    alt: "An airport departures board listing flights and times",
    frame: "aspect-[4/5] md:mt-24 md:aspect-square",
  },
  {
    title: "Heading home",
    body: "Trade arrival tips with a traveler flying the way you came.",
    badge: "/badges/baton-touch.svg",
    feature: "Baton Touch",
    photo: unsplash("1520437358207-323b43b50729"),
    alt: "An airliner on final approach at night with its landing lights on",
    frame: "aspect-[4/5] md:aspect-[4/5]",
  },
]

export function ShowcaseSection() {
  return (
    <>
      {/* Window seat: full-bleed footage with the statement over its dark lower third. */}
      <div className="relative isolate flex min-h-[min(92svh,860px)] items-end overflow-hidden">
        <Parallax className="absolute inset-x-0 -inset-y-[15%]" y={["-12%", "12%"]}>
          <AmbientVideo
            sources={[{ src: "/media/window-1280.mp4" }]}
            poster="/media/window-poster.webp"
            mediaClassName="object-[62%_50%]"
          />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night via-night/30 to-night/40" />
        <SectionContainer className="relative w-full pb-16 sm:pb-24">
          <h2 className="max-w-[15ch] font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.04] font-semibold tracking-[-0.032em] text-balance text-white">
            Echoes stay at the airport. Conversations come with you.
          </h2>
          <p className="mt-6 max-w-[34rem] text-lg text-white/70">
            An echo belongs to the terminal it was recorded in. A conversation with a matched traveler goes
            wherever you land.
          </p>
        </SectionContainer>
      </div>

      {/* Moments: asymmetric row on desktop, swipeable strip on mobile. */}
      <SectionContainer className="pt-20 pb-28 sm:pt-28 sm:pb-36">
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-[1.15fr_1fr_1.15fr] md:gap-6 md:overflow-visible md:px-0 lg:gap-10">
          {MOMENTS.map((moment, i) => (
            <li key={moment.title} className="w-[78vw] shrink-0 snap-start sm:w-[55vw] md:w-auto">
              {/* Desktop only: the middle column drifts further than the outer two. On
                  phones this row is a sideways swipe strip and stays still. */}
              <Parallax y={i === 1 ? [72, -72] : [32, -32]} desktopOnly>
                <div className={cn("relative overflow-hidden rounded-[28px] ring-1 ring-white/10", moment.frame)}>
                  <Image src={moment.photo} alt={moment.alt} fill sizes="(min-width: 768px) 33vw, 78vw" className="object-cover" />
                </div>
                <div className="mt-5 flex items-start gap-3">
                  <Image src={moment.badge} alt={moment.feature} width={30} height={30} className="mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">{moment.title}</h3>
                    <p className="mt-1 text-white/60">{moment.body}</p>
                  </div>
                </div>
              </Parallax>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </>
  )
}
