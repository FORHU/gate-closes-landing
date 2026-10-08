import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"

import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { Backdrop } from "@/components/backdrop"
import { getAdmin } from "@/lib/admin/dal"
import { ADMIN_HOME_PATH } from "@/lib/admin/routes"

// Hidden admin sign-in: not linked from the site and kept out of search results.
export const metadata: Metadata = {
  title: "Admin sign in · GateCloses",
  robots: { index: false, follow: false },
}

const BOARD = [
  { label: "Access", value: "Role-verified" },
  { label: "Session", value: "Secured" },
  { label: "Terminal", value: "Admin" },
] as const

// Staggered entrance: each block rises a beat after the one before it.
const rise = "animate-rise motion-reduce:animate-none"

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect(ADMIN_HOME_PATH)

  return (
    <div className="dark relative isolate flex min-h-[100dvh] flex-1 flex-col overflow-hidden bg-[#050505] text-white">
      <Backdrop plane={false} />

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-4 py-12 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-12">
        {/* Editorial column */}
        <section className="flex flex-col gap-8">
          <div className={`flex items-center gap-3 ${rise}`}>
            <Image src="/gate-closes-logo.svg" alt="GateCloses Logo" width={36} height={36} />
            <span className="text-base font-semibold tracking-tight text-theme">GateCloses</span>
          </div>

          <div className="flex flex-col gap-6">
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/60 uppercase ring-1 ring-white/10 [animation-delay:80ms] ${rise}`}
            >
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-theme/70 motion-reduce:animate-none" />
                <span className="relative size-1.5 rounded-full bg-theme" />
              </span>
              Restricted area
            </span>

            <h1
              className={`max-w-xl text-[2.75rem] leading-[0.95] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl [animation-delay:160ms] ${rise}`}
            >
              Mission control
              <span className="block text-white/35">for GateCloses.</span>
            </h1>

            <p
              className={`max-w-md text-sm/relaxed text-white/50 sm:text-base/relaxed [animation-delay:240ms] ${rise}`}
            >
              The operations console for the GateCloses team. Sign in with your administrator
              account to continue.
            </p>
          </div>

          <dl
            className={`hidden max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl ring-1 ring-white/10 sm:grid [animation-delay:320ms] ${rise}`}
          >
            {BOARD.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 px-4 py-3">
                <dt className="text-[10px] tracking-[0.2em] text-white/35 uppercase">{item.label}</dt>
                <dd className="text-xs font-medium tracking-wide text-white/80">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Sign-in card: an outer shell holding a machined inner core. */}
        <section className={`w-full lg:justify-self-end [animation-delay:240ms] ${rise}`}>
          <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10 shadow-[0_40px_120px_-40px_oklch(0.86_0.18_124/0.25)]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#0a0a0a] px-6 py-8 shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)] sm:px-10 sm:py-12">
              <div className="mb-10 flex flex-col gap-2">
                <h2 className="text-2xl font-medium tracking-[-0.02em]">Welcome back</h2>
                <p className="text-sm text-white/45">For GateCloses administrators only.</p>
              </div>
              <AdminLoginForm />
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-md text-center text-[11px] tracking-wide text-white/30">
            Every sign-in is verified on the server.
          </p>
        </section>
      </main>
    </div>
  )
}
