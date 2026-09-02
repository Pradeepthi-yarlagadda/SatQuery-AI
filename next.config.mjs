/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
