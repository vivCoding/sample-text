/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'http://0.0.0.0:5000/api/:slug*'
      },
    ]
  },
}

module.exports = nextConfig
