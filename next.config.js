/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: '*.public.blob.vercel-storage.com' },
    ]
  }
}

module.exports = nextConfig
