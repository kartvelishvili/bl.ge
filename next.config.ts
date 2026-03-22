import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.iserv.ge",
      },
      {
        protocol: "https",
        hostname: "bolero-storage.fra1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "fra1.digitaloceanspaces.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  serverExternalPackages: ["typeorm", "mysql2", "reflect-metadata"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
