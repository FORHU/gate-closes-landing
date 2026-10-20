// Admin UI preferences, kept in cookies so the server renders the first
// paint already right (no theme or sidebar flash on load).

/** "light" or "dark" (default) for the admin area. */
export const ADMIN_THEME_COOKIE = "gc_admin_theme"
/** "collapsed" when the desktop sidebar is minimized. */
export const ADMIN_SIDEBAR_COOKIE = "gc_admin_sidebar"

export type AdminTheme = "light" | "dark"
