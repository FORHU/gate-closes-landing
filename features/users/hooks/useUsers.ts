import { useQueryClient } from "@tanstack/react-query"
import { useSafeMutation } from "@/shared/query/useSafeMutation"
import { useSafeQuery } from "@/shared/query/useSafeQuery"
import { getUsers, setUserRole } from "../api/users.client"
import { usersKeys } from "../api/users.keys"
import type { UsersFilter } from "../contracts/users.contract"

export function useUsers(filter: UsersFilter) {
  return useSafeQuery({
    queryKey: usersKeys.list(filter),
    queryFn: () => getUsers(filter),
    placeholderData: (previous) => previous,
  })
}

export function useSetUserRole() {
  const client = useQueryClient()
  return useSafeMutation<void, { id: string; role: string }>({
    mutationFn: ({ id, role }) => setUserRole(id, role),
    onSuccess: () => client.invalidateQueries({ queryKey: usersKeys.lists() }),
  })
}
