import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs separately in CI; skip during Vercel build to avoid version conflicts
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors surface in dev; keep builds unblocked on Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
