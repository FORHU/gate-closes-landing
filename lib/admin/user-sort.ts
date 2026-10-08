// Sort orders for the admin Users table. The values are the API's `sort`
// parameter; the database does the ordering. Plain module so both the server
// page and the client dropdown can read it.
export const USER_SORTS = [
  { value: "newest", label: "Joined: latest first" },
  { value: "oldest", label: "Joined: oldest first" },
  { value: "username_asc", label: "Username: A–Z" },
  { value: "username_desc", label: "Username: Z–A" },
] as const

export type UserSort = (typeof USER_SORTS)[number]["value"]

export const DEFAULT_USER_SORT: UserSort = "newest"

export function parseUserSort(raw: unknown): UserSort {
  return USER_SORTS.some((s) => s.value === raw) ? (raw as UserSort) : DEFAULT_USER_SORT
}
