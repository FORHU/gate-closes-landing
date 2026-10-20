# Debian, not Alpine. pnpm-workspace.yaml allows builds for `sharp`, whose
# prebuilt binaries are glibc-linked. On musl/arm64 pnpm falls back to compiling
# it, which needs a toolchain that is not in the image and fails late in the
# build with an error that does not mention sharp.
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN corepack enable

# Dependencies first so a source-only change does not reinstall them.
# pnpm-workspace.yaml is copied with the manifests because pnpm reads
# allowBuilds from it during install, not afterwards.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------------------------------------------------------------------------
# Each FROM starts from a clean filesystem, so corepack has to be enabled again
# here even though the builder already did it.
FROM node:22-bookworm-slim AS runner
WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# next.config.ts must exist at runtime, not just at build time: it carries the
# images.remotePatterns allowlist, and without it every optimised image 400s
# with "url parameter is not allowed" while the rest of the page looks fine.
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000
CMD ["pnpm", "start"]
