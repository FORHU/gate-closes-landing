export const overviewKeys = {
  all: ["overview"] as const,
  summary: () => [...overviewKeys.all, "summary"] as const,
  readiness: () => [...overviewKeys.all, "readiness"] as const,
}
