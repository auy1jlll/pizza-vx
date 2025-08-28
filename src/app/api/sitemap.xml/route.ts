import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourpizzaplace.com';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/build-pizza',
    '/gourmet-pizzas',
    '/build-calzone',
    '/specialty-calzones',
    '/menu',
    '/auth/login',
    '/auth/register'
  ];

  // Menu categories
  const menuCategories = [
    '/menu/pizza',
    '/menu/calzones',
    '/menu/appetizers',
    '/menu/salads',
    '/menu/sandwiches',
    '/menu/desserts',
    '/menu/beverages'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
    ${page === '' ? `
    <image:image>
      <image:loc>${baseUrl}/pizza-hero.jpg</image:loc>
      <image:title>Pizza Builder Pro - Custom Pizza Builder</image:title>
      <image:caption>Build your perfect pizza with fresh ingredients</image:caption>
    </image:image>` : ''}
  </url>`).join('')}
  ${menuCategories.map(category => `
  <url>
    <loc>${baseUrl}${category}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}