import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  // Emit a self-contained server bundle (.next/standalone) so the Docker
  // runtime image only needs that output + .next/static.
  output: "standalone",
};

export default nextConfig;
