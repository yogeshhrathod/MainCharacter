import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH?.trim();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
