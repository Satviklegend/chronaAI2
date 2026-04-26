/** @type {import('next').NextConfig} */
const nextConfig = {
  // serverComponentsExternalPackages moved to top-level in Next.js 15
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}
module.exports = nextConfig
