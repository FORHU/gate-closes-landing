"use client"

import { useSyncExternalStore } from "react"

const ROOT = "[data-admin-root]"

function subscribe(onChange: () => void) {
  const root = document.querySelector(ROOT)
  if (!root) return () => {}
  const observer = new MutationObserver(onChange)
  observer.observe(root, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

/**
 * Whether the admin is in dark mode. Sheets and dialogs render in a portal
 * outside `[data-admin-root]` (which carries the `.dark` class and the
 * ink/panel tokens), so their content adds `dark` itself from this.
 */
export function useAdminDark() {
  return useSyncExternalStore(
    subscribe,
    () => document.querySelector(ROOT)?.classList.contains("dark") ?? true,
    () => true
  )
}
