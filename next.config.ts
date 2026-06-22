import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // This single line fixes the mobile speed by removing unused code
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-countup'],
  },
};

export default nextConfig;