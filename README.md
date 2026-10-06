# GateCloses landing

The public website for GateCloses, the app for travelers at airports. It will also host the staff admin area (`/admin`), which talks to `gate-closes-api`.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · shadcn/Base UI · Motion.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript |
| `npm run validate` | Admin architecture rules (below) |

Before writing code, read the matching guide in `node_modules/next/dist/docs/`: Next.js 16 differs from older versions (see `AGENTS.md`).

## Environment

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Share links, `robots.txt`, `sitemap.xml`. **Set it in production**; it defaults to `http://localhost:3000`. |
| `ALLOWED_DEV_ORIGINS` | Comma-separated LAN IPs allowed to use the dev server, e.g. when testing from a phone. |
| `API_URL` | gate-closes-api base URL (no `/api`), server-side only. The admin calls it as `/backend/*` on this site. This site's URL must be in the API's `ALLOWED_ORIGINS`. |

## Layout

```
app/
  layout.tsx              root: <html>, font, site metadata
  (marketing)/            the public site (URL: /)
    page.tsx
    opengraph-image.tsx   share preview image
  robots.ts, sitemap.ts
components/
  hero/ features/ contact/   one folder per section; text lives in each *-copy.ts
  ui/                        shadcn components
lib/
  site.ts                 site name, URL, title, description
public/                   images (prefer WebP/PNG for photos: SVGs skip Next.js image resizing)
```

`(marketing)` is a route group: it doesn't appear in the URL. The admin area goes in its own group, `app/(admin)/admin/`, with its own layout.

## Admin area (`/admin`)

Staff log in with their GateCloses account; what they see follows their role's permissions (roles live in gate-closes-api). Structured like the marketPlace admin (FAOS):

```
app/(admin)/admin/   pages only compose features (no React Query here)
  _screens/          the client parts of each page
features/            auth, offers, users, roles — each with
                     api/ (client + query keys), contracts/ (zod),
                     hooks/, components/, feature.manifest.ts
shared/              http client, errors, query wrappers, providers,
                     permissions, admin layout — no feature imports
```

Rules (checked by `npm run validate`): features never import each other (combine them in `app/`), `shared/` never imports features, no `../..` imports.

Session: the browser only talks to this site. `/backend/*` is forwarded to the API (`next.config.ts`), so the API's httpOnly login cookies belong to this domain and no token is readable by JavaScript. `proxy.ts` sends visitors without a session cookie to `/admin/login`; the API checks permissions on every request. An expired session is refreshed once, shared by all waiting requests (the API ends the session if a refresh token is used twice).

The marketing page doesn't load any of this: React Query and toasts are only in the admin layout.

## Words we use

`CONTEXT.md` names every part of the page (Hero Showcase, Feature Map, Boarding Pass...). Decisions are in `docs/adr/`.
