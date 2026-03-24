import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.dummyjson.com" },
      { hostname: "via.placeholder.com" },
      { hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
