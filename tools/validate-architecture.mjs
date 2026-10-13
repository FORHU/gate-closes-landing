#!/usr/bin/env node
/**
 * Admin architecture check (same rules as the marketPlace admin's FAOS
 * validator). Scans imports with regexes: a guardrail next to ESLint and
 * tsc, not a full parser.
 *
 *   app/(admin)  composes features; never uses @tanstack/react-query directly
 *   features/x   never imports another feature (compose them in app/)
 *   shared/      never imports features/ or app/
 *   everywhere   no deep "../.." imports: use @/...
 *   anywhere     feature.manifest.ts is never imported at runtime
 *
 * The marketing site (app/(marketing), components/, lib/) isn't checked.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SCANNED = ["app/(admin)", "features", "shared"]
const violations = []

const importsOf = (source) => [
  ...[...source.matchAll(/import\s+[\s\S]*?\s+from\s+["']([^"']+)["']/g)].map((m) => m[1]),
  ...[...source.matchAll(/import\(["']([^"']+)["']\)/g)].map((m) => m[1]),
]

function layerOf(file) {
  if (file.startsWith("app/")) return { layer: "app" }
  if (file.startsWith("shared/")) return { layer: "shared" }
  if (file.startsWith("features/")) return { layer: "features", feature: file.split("/")[1] }
  return { layer: "other" }
}

function targetOf(imp) {
  const clean = imp.replace(/^@\//, "")
  if (clean.startsWith("features/")) return { layer: "features", feature: clean.split("/")[1] }
  if (clean.startsWith("shared/")) return { layer: "shared" }
  if (clean.startsWith("app/")) return { layer: "app" }
  return { layer: "other" }
}

function check(file) {
  const from = layerOf(file)
  for (const imp of importsOf(fs.readFileSync(path.join(ROOT, file), "utf8"))) {
    const to = targetOf(imp)
    const fail = (rule, detail) => violations.push({ file, rule, detail: `${detail} ("${imp}")` })

    if (imp.startsWith("../..")) fail("Import strategy", "Deep relative import; use @/ instead")
    if (imp.includes("feature.manifest")) fail("Manifest", "feature.manifest.ts is never imported")
    if (from.layer === "shared" && (to.layer === "features" || to.layer === "app")) {
      fail("Shared kernel", "shared/ can't depend on features/ or app/")
    }
    if (from.layer === "features" && to.layer === "features" && to.feature !== from.feature) {
      fail("Feature isolation", `features/${from.feature} imports features/${to.feature}; compose in app/`)
    }
    if (from.layer === "app" && imp === "@tanstack/react-query") {
      fail("App layer", "app/ uses feature hooks, not React Query directly")
    }
  }
}

function walk(dir) {
  const full = path.join(ROOT, dir)
  if (!fs.existsSync(full)) return
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name)
    if (entry.isDirectory()) walk(rel)
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith("feature.manifest.ts")) check(rel)
  }
}

SCANNED.forEach(walk)

if (violations.length) {
  for (const v of violations) console.error(`✗ ${v.file}\n  ${v.rule}: ${v.detail}\n`)
  console.error(`${violations.length} architecture violation(s).`)
  process.exit(1)
}
console.log("✓ Admin architecture OK (app → features → shared).")
