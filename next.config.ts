import type { NextConfig } from "next";

// gate-closes-api, reached only through /backend/* (see rewrites below).
const apiUrl = (process.env.API_URL ?? "http://localhost:3001").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // The admin area calls the API as /backend/* on this same site, so the
  // API's login cookies belong to this domain (no cross-site cookies).
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${apiUrl}/api/:path*` }];
  },
  // LAN IPs allowed to use the dev server (e.g. testing from a phone).
  allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;