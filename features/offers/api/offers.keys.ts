export const offersKeys = {
  all: ["offers"] as const,
  lists: () => [...offersKeys.all, "list"] as const,
  list: (status: string) => [...offersKeys.lists(), status] as const,
  detail: (id: string) => [...offersKeys.all, "detail", id] as const,
  stats: (id: string) => [...offersKeys.all, "stats", id] as const,
}
