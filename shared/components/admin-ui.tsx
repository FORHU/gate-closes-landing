import { cn } from "@/lib/utils"

/** Small building blocks shared by the admin pages. */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-rise motion-reduce:animate-none">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-ink/45">{description}</p>}
      </div>
      {action}
    </header>
  )
}

/** An outer shell holding a machined inner core; `className` styles the core. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-ink/10 animate-rise [animation-delay:80ms] motion-reduce:animate-none">
      <div
        className={cn(
          "rounded-[calc(1.75rem-0.375rem)] bg-panel shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error"
  children: React.ReactNode
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "w-fit rounded-full px-4 py-2.5 text-xs ring-1",
        tone === "error"
          ? "bg-destructive/10 text-red-600 ring-destructive/30 dark:text-red-300"
          : "bg-ink/[0.03] text-ink/50 ring-ink/10"
      )}
    >
      {children}
    </p>
  )
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  draft: "bg-zinc-100 text-zinc-700",
  paused: "bg-amber-100 text-amber-800",
  ended: "bg-zinc-200 text-zinc-500",
  ready: "bg-emerald-100 text-emerald-800",
  up: "bg-emerald-100 text-emerald-800",
  degraded: "bg-amber-100 text-amber-800",
  unhealthy: "bg-red-100 text-red-800",
  down: "bg-red-100 text-red-800",
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1",
        STATUS_STYLES[status] ?? "bg-ink/[0.03] text-ink/60 ring-ink/10"
      )}
    >
      {status}
    </span>
  )
}

/** A big number with its label, e.g. on the overview. */
export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-md bg-ink/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-ink/70 ring-1 ring-ink/10">
      {children}
    </span>
  )
}

/** Native select styled like the shadcn Input. */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-10 rounded-full border border-ink/10 bg-ink/[0.03] px-4 text-sm text-ink outline-none transition-[border-color,box-shadow] focus-visible:border-theme/60 focus-visible:ring-4 focus-visible:ring-theme/10",
        className
      )}
      {...props}
    />
  )
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

/** Full-screen message: loading, errors, no access. */
export function CenteredMessage({
  title,
  body,
  children,
}: {
  title: string
  body?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-medium tracking-[-0.02em]">{title}</h1>
      {body && <p className="max-w-md text-sm text-ink/45">{body}</p>}
      {children}
    </div>
  )
}
