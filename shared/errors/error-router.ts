import { ApiError } from "./api-error"

type Routed = {
  toast: string | null
  action: "logout" | "form" | "retryable" | "log" | "none"
}

/**
 * What the app does with an error, in one place: the query provider shows
 * the toast and logs out on AUTH. VALIDATION and CONFLICT stay with the form
 * that caused them (no global toast), which shows the API's message inline.
 */
export function routeError(error: unknown): Routed {
  if (!(error instanceof ApiError)) return { toast: "Something went wrong.", action: "log" }

  switch (error.category) {
    case "AUTH":
      return { toast: "Your session ended. Please log in again.", action: "logout" }
    case "FORBIDDEN":
      return { toast: "You don't have access to that.", action: "none" }
    case "VALIDATION":
    case "CONFLICT":
      return { toast: null, action: "form" }
    case "NETWORK":
      return { toast: "Can't reach the server. Check your connection.", action: "retryable" }
    default:
      return { toast: error.message, action: "log" }
  }
}
