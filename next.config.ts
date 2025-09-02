import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Docker build optimization
  output: 'standalone',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization - disable caching in dev
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: isDev ? 0 : 60, // No caching in dev
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  
  // Headers for better SEO and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Disable caching in development
          ...(isDev ? [{
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          }] : []),
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            // No caching in dev, normal caching in prod
            value: isDev 
              ? 'no-cache, no-store, must-revalidate, max-age=0'
              : 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      // SEO-friendly redirects
      {
        source: "/pizza-builder",
        destination: "/build-pizza",
      },
      {
        source: "/specialty-pizzas", 
        destination: "/gourmet-pizzas",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
    ];
  },
};

export default nextConfig;
