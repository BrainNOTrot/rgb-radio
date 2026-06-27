import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — Vercel handles this with ISR/SSG automatically
  // All data comes from the filesystem (archive/) at build time
};

export default nextConfig;
