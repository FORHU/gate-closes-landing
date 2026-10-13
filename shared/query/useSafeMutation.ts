import { useMutation, type UseMutationOptions } from "@tanstack/react-query"

/**
 * useMutation without its own error handling: toasts and logout-on-AUTH are
 * done once, globally, by the MutationCache in shared/providers. Forms read
 * `mutation.error` to show VALIDATION/CONFLICT messages inline.
 */
export function useSafeMutation<TData, TVariables = void>(
  options: Omit<UseMutationOptions<TData, Error, TVariables>, "onError">
) {
  return useMutation(options)
}
