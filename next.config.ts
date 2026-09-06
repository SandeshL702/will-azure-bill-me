import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/will-azure-bill-me",
  assetPrefix: "/will-azure-bill-me",
};

export default nextConfig;
