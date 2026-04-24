import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['http://192.168.1.34', '192.168.1.34', '192.168.1.34:3000'],
};

export default nextConfig;
