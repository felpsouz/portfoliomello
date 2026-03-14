import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',             value: 'DENY' },
          { key: 'X-Content-Type-Options',       value: 'nosniff' },
          { key: 'Referrer-Policy',              value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security',    value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy',           value: 'camera=(), microphone=(), geolocation=()' },
          // Remove o header que expõe a versão do Next.js
          { key: 'X-Powered-By',                value: '' },
        ],
      },
    ]
  },
  // Esconde o header Server e X-Powered-By globalmente
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig