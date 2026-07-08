import type { NextConfig } from "next";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/users/:path*",
        destination: `${EXPRESS_API_URL}/api/users/:path*`,
      },
    ];
  },
};

export default nextConfig;
