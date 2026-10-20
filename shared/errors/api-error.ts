export type ApiErrorCategory =
  | "AUTH"
  | "FORBIDDEN"
  | "VALIDATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER"
  | "NETWORK"
  | "UNKNOWN"

/** Every failed API call becomes one of these, sorted into a category. */
export class ApiError extends Error {
  constructor(
    message: string,
    public category: ApiErrorCategory,
    public status?: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function categorize(status: number): ApiErrorCategory {
  if (status === 401) return "AUTH"
  if (status === 403) return "FORBIDDEN"
  if (status === 404) return "NOT_FOUND"
  // gate-closes-api answers bad input with 400 and refused changes with 409.
  if (status === 400 || status === 422) return "VALIDATION"
  if (status === 409) return "CONFLICT"
  if (status >= 500) return "SERVER"
  return "UNKNOWN"
}
