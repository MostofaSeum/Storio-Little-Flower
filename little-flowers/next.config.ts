import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: "https://api.storio.cloud/media/:path*",
      },
    ];
  },
};

export default nextConfig;
