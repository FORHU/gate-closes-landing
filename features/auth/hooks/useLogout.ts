import { useQueryClient } from "@tanstack/react-query"
import { logout } from "../api/auth.client"

/** Ends the session, forgets cached data, back to the login page. */
export function useLogout() {
  const client = useQueryClient()
  return async () => {
    await logout()
    client.clear()
    window.location.assign("/admin/login")
  }
}
