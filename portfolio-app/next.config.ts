import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/portfolio',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  poweredByHeader: false
};

export default nextConfig;

