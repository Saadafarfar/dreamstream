import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 480, 640, 768, 1080],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-countup'],
  },
};

export default nextConfig;