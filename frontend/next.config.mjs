/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['lucide-react'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      {
        source: '/v1/:path*',
        destination: 'http://127.0.0.1:8000/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
