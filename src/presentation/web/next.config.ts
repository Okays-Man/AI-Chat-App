import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-markdown': require.resolve('react-markdown'),
    };
    return config;
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;