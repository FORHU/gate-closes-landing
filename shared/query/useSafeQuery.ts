import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query"
import { getRetryCount } from "@/shared/errors/retry-policy"

/** useQuery with the shared retry policy. Use this instead of useQuery. */
export function useSafeQuery<TData, TQueryKey extends QueryKey = QueryKey>(
  options: Omit<UseQueryOptions<TData, Error, TData, TQueryKey>, "retry">
) {
  return useQuery({ ...options, retry: (count, error) => count < getRetryCount(error) })
}
