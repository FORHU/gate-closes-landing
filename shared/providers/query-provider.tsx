"use client"

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useState } from "react"
import { toast, Toaster } from "sonner"
import { routeError } from "@/shared/errors/error-router"
import { getRetryCount } from "@/shared/errors/retry-policy"

/** Fired on an ended session; features/auth's AuthListener sends to login. */
export const UNAUTHORIZED_EVENT = "auth:unauthorized"

function handleError(error: unknown) {
  const { toast: message, action } = routeError(error)
  if (action === "log") console.error(error)
  if (message) toast.error(message)
  if (action === "logout") window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handleError }),
        mutationCache: new MutationCache({
          // A mutation with `meta.localErrors` shows its own errors (the
          // login form: a wrong password is a 401 but not an ended session).
          onError: (error, _variables, _context, mutation) => {
            if (!mutation.meta?.localErrors) handleError(error)
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: (count, error) => count < getRetryCount(error),
          },
        },
      })
  )
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
