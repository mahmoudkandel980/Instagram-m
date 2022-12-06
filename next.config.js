/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["i.pravatar.cc", "firebasestorage.googleapis.com"]
  }
}

module.exports = nextConfig
