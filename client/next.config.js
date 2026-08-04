const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Shared cPanel hosting caps the account's process count (CloudLinux LVE);
    // spawning multiple build worker processes can hit that cap and fail with
    // "spawn ... EAGAIN". Use one in-process worker thread instead.
    cpus: 1,
    workerThreads: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
