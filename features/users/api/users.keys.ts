import type { UsersFilter } from "../contracts/users.contract"

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (filter: UsersFilter) => [...usersKeys.lists(), filter] as const,
}
