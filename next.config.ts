import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for faster loading
  compress: true,
  
  // Enable React Strict Mode (helps catch bugs)
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};

export default nextConfig;