/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://controle-bc.bubbleapps.io/:path*",
      },
    ]
  },
}

module.exports = nextConfig

