import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to support dynamic API routes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
