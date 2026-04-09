import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  basePath: '/portfolio',
  trailingSlash: true,
  experimental: {
    externalDir: true
  },
  turbopack: {
    root: path.resolve(__dirname)
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp']
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false
  }
};

export default nextConfig;

