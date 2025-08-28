import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gourmet Specialty Pizzas | Artisan Pizza Collection | Local Pizza House',
  description: 'Discover our signature gourmet pizzas crafted with premium ingredients. From classic favorites to unique Boston-inspired creations. Order online for delivery or pickup.',
  keywords: [
    'gourmet pizza',
    'specialty pizza',
    'artisan pizza',
    'premium ingredients',
    'signature pizzas',
    'Boston pizza',
    'pizza delivery',
    'Local Pizza House'
  ],
  openGraph: {
    title: 'Gourmet Specialty Pizzas | Local Pizza House',
    description: 'Discover our signature gourmet pizzas crafted with premium ingredients. From classic favorites to unique Boston-inspired creations.',
    type: 'website',
    url: '/gourmet-pizzas',
    images: [
      {
        url: '/images/gourmet-pizzas-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Gourmet Specialty Pizzas - Premium Pizza Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gourmet Specialty Pizzas | Local Pizza House',
    description: 'Discover our signature gourmet pizzas crafted with premium ingredients.',
    images: ['/images/gourmet-pizzas-og.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/gourmet-pizzas'
  }
};

export default function GourmetPizzasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Gourmet Specialty Pizzas',
    description: 'Discover our signature gourmet pizzas crafted with premium ingredients. From classic favorites to unique Boston-inspired creations.',
    url: '/gourmet-pizzas',
    mainEntity: {
      '@type': 'Menu',
      name: 'Gourmet Pizza Menu',
      description: 'Premium specialty pizzas with artisan ingredients',
      hasMenuSection: {
        '@type': 'MenuSection',
        name: 'Specialty Pizzas',
        description: 'Chef-crafted gourmet pizzas'
      },
      provider: {
        '@type': 'Restaurant',
        name: 'Local Pizza House',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Boston',
          addressRegion: 'MA',
          addressCountry: 'US'
        },
        servesCuisine: 'Pizza'
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: '/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Gourmet Pizzas',
          item: '/gourmet-pizzas'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
