import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/career',
        destination: '/careers',
      },
      {
        source: '/career/:path*',
        destination: '/careers/:path*',
      },
    ];
  },
};

export default nextConfig;
