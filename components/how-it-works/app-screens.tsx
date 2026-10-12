import { cn } from "@/lib/utils"

// Live previews of three app screens, built from the app's real flows and
// copy (gate-closes-app-v2: boarding_pass, airport, terminal_echo). Rendered
// inside a PhoneMockup; purely illustrative, so callers mark them aria-hidden.
// Sizes use container query units so the screens scale with the phone.

const SCREEN = "absolute inset-0 flex flex-col gap-[3cqw] px-[5cqw] pt-[15cqw] pb-[6cqw] text-[4cqw] leading-snug text-white"

// A deterministic waveform, so server and client renders match.
export const WAVE = [22, 38, 30, 56, 70, 48, 82, 64, 92, 74, 58, 86, 66, 44, 72, 90, 60, 40, 68, 52, 34, 46, 28, 18]

function ScreenTitle({ children, aside }: { children: string; aside?: string }) {
  return (
    <div className="flex items-center justify-between text-[5cqw] font-semibold">
      {children}
      {aside && <span className="font-flight text-[3.4cqw] font-normal tracking-[0.12em] text-white/40">{aside}</span>}
    </div>
  )
}

export function ScanScreen() {
  return (
    <div className={SCREEN}>
      <ScreenTitle>Add Boarding Pass</ScreenTitle>
      <div className="grid grid-cols-3 rounded-[3.5cqw] bg-white/[0.06] p-[1cqw] text-center text-white/45">
        <span className="rounded-[2.8cqw] bg-white/10 py-[2cqw] text-white">Scan</span>
        <span className="py-[2cqw]">Photo</span>
        <span className="py-[2cqw]">Manual</span>
      </div>
      <div className="relative grid flex-1 place-items-center overflow-hidden rounded-[6cqw] bg-[radial-gradient(120%_80%_at_50%_40%,#1b1f27,#08090c)]">
        {["top-[16%] left-[9%] border-t-2 border-l-2 rounded-tl-[3cqw]", "top-[16%] right-[9%] border-t-2 border-r-2 rounded-tr-[3cqw]", "bottom-[16%] left-[9%] border-b-2 border-l-2 rounded-bl-[3cqw]", "bottom-[16%] right-[9%] border-r-2 border-b-2 rounded-br-[3cqw]"].map((corner) => (
          <span key={corner} className={cn("absolute size-[7cqw] border-theme", corner)} />
        ))}
        <div className="grid w-[76%] -rotate-3 gap-[2.5cqw] rounded-[4cqw] bg-[#f1efe8] p-[4cqw] text-[#15171b] shadow-[0_20px_40px_-14px_#000]">
          <div className="flex justify-between font-flight text-[2.8cqw] tracking-[0.12em] text-[#6a6d73]">
            <span>FLIGHT GC 452</span>
            <span>SEAT 24A</span>
          </div>
          <div className="flex items-baseline justify-between text-[7cqw] font-bold tracking-tight">
            <span>SIN</span>
            <span className="text-[3cqw] font-normal text-[#6a6d73]">to</span>
            <span>ICN</span>
          </div>
          <div className="h-[11cqw] rounded-sm bg-[repeating-linear-gradient(90deg,#15171b_0_2px,transparent_2px_3px,#15171b_3px_4px,transparent_4px_7px,#15171b_7px_9px,transparent_9px_10px)] [mask-image:repeating-linear-gradient(180deg,#000_0_5px,transparent_5px_6px)]" />
        </div>
        {/* Full-height track so the line's translateY percentages are of the viewfinder. */}
        <span className="absolute inset-x-[9%] inset-y-0 animate-scan motion-reduce:translate-y-1/2 motion-reduce:animate-none">
          <span className="block h-0.5 bg-theme shadow-[0_0_18px_2px_rgb(187_228_10/0.7)]" />
        </span>
      </div>
      <p className="text-center text-[3.6cqw] text-white/60">Point your camera at the barcode on your boarding pass.</p>
    </div>
  )
}

export function ZoneScreen() {
  return (
    <div className={SCREEN}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_1.5px),radial-gradient(80%_60%_at_50%_40%,#182019,#0b0d0e)] bg-[length:14px_14px,auto]" />
      <span className="absolute top-[40%] left-1/2 h-[1.6cqw] w-[46%] -translate-1/2 -rotate-[24deg] rounded-full bg-white/15" />
      <span className="absolute top-[44%] left-[54%] h-[1.6cqw] w-[36%] -translate-1/2 -rotate-[24deg] rounded-full bg-white/10" />
      <div className="absolute top-[40%] left-1/2 aspect-square w-[66%] -translate-1/2 rounded-full border-[1.5px] border-theme/55 bg-theme/[0.06]">
        <span className="absolute inset-0 animate-radar rounded-full border-[1.5px] border-theme motion-reduce:hidden" />
      </div>
      <span className="absolute top-[40%] left-1/2 size-[5cqw] -translate-1/2 rounded-full bg-theme shadow-[0_0_0_1.6cqw_rgb(187_228_10/0.25),0_0_24px_4px_rgb(187_228_10/0.5)]" />
      <div className="relative mt-auto grid gap-[1cqw] rounded-[6cqw] bg-[#16181c]/95 p-[4.5cqw] ring-1 ring-white/10">
        <span className="text-[3.4cqw] text-white/45">Terminal zone</span>
        <span className="text-[5.2cqw] font-semibold">Singapore Changi</span>
        <span className="font-medium text-theme">You&apos;re inside the airport</span>
      </div>
    </div>
  )
}

export function RecordScreen() {
  return (
    <div className={SCREEN}>
      <ScreenTitle aside="SIN">New echo</ScreenTitle>
      <div className="rounded-[4cqw] bg-white/[0.05] p-[3.5cqw] text-white/40 ring-1 ring-white/10">What&apos;s happening?</div>
      <div className="grid flex-1 place-items-center content-center gap-[5cqw]">
        <div className="flex h-[16cqw] w-[88%] items-center justify-between">
          {WAVE.map((h, i) => (
            <i key={i} className="w-[1.2cqw] shrink-0 rounded-full bg-theme/85" style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className="font-flight text-[8cqw] tracking-tight">
          0:07 <span className="text-[5cqw] text-white/40">/ 0:10</span>
        </span>
        <span className="grid size-[22cqw] place-items-center rounded-full bg-theme/10 ring-1 ring-theme/40">
          <span className="size-[14cqw] rounded-full bg-theme shadow-[0_0_30px_rgb(187_228_10/0.5)]" />
        </span>
      </div>
      <p className="text-center text-[3.4cqw] text-white/45">
        Record up to 10 seconds. Visible to everyone at your airport right now.
      </p>
    </div>
  )
}
