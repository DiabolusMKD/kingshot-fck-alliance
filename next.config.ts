import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
