export const airportsKeys = {
  all: ["airports"] as const,
  lists: () => [...airportsKeys.all, "list"] as const,
  list: (q: string) => [...airportsKeys.lists(), q] as const,
}
