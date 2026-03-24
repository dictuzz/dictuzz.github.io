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
    unoptimized: true
  },
  reactStrictMode: true,
  poweredByHeader: false
};

export default nextConfig;

