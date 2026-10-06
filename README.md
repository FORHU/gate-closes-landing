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

Before writing code, read the matching guide in `node_modules/next/dist/docs/`: Next.js 16 differs from older versions (see `AGENTS.md`).

## Environment

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Share links, `robots.txt`, `sitemap.xml`. **Set it in production**; it defaults to `http://localhost:3000`. |
| `ALLOWED_DEV_ORIGINS` | Comma-separated LAN IPs allowed to use the dev server, e.g. when testing from a phone. |

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

## Words we use

`CONTEXT.md` names every part of the page (Hero Showcase, Feature Map, Boarding Pass...). Decisions are in `docs/adr/`.
