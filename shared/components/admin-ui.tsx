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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-xl border bg-background", className)} {...props} />
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
        "rounded-lg px-3 py-2 text-sm",
        tone === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
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
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
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
    <span className="inline-flex rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px]">
      {children}
    </span>
  )
}

/** Native select styled like the shadcn Input. */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
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
      <h1 className="text-lg font-semibold">{title}</h1>
      {body && <p className="max-w-md text-sm text-muted-foreground">{body}</p>}
      {children}
    </div>
  )
}
