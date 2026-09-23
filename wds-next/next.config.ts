import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'warsawduragstore.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.supabase.co https://js.stripe.com https://geowidget.inpost.pl https://*.inpost.pl; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://geowidget.inpost.pl https://*.inpost.pl; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.stripe.com https://geowidget.inpost.pl https://*.inpost.pl https://*.easypack24.net https://*.openstreetmap.org; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://geowidget.inpost.pl https://*.inpost.pl https://*.easypack24.net https://*.openstreetmap.org; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://geowidget.inpost.pl https://*.inpost.pl; media-src 'self' blob: data:; object-src 'none'; base-uri 'self'; form-action 'self' https://*.stripe.com; frame-ancestors 'self';",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self "https://geowidget.inpost.pl"), payment=(self "https://js.stripe.com")',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
