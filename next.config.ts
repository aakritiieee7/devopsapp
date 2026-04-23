import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // @ts-expect-error Allow webpack-hmr from mobile/network testing
  allowedDevOrigins: ['http://192.168.1.34', '192.168.1.34', '192.168.1.34:3000'],
};

export default nextConfig;
