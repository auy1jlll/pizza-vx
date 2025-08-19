import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Perfect Pizza | Custom Pizza Builder | Omar Pizza',
  description: 'Create your dream pizza with our interactive pizza builder. Choose from fresh toppings, premium crusts, and signature sauces. Order online for delivery or pickup.',
  keywords: [
    'pizza builder',
    'custom pizza',
    'build pizza online',
    'pizza maker',
    'fresh toppings',
    'pizza delivery',
    'Boston pizza',
    'Omar Pizza'
  ],
  openGraph: {
    title: 'Build Your Perfect Pizza | Omar Pizza',
    description: 'Create your dream pizza with our interactive pizza builder. Choose from fresh toppings, premium crusts, and signature sauces.',
    type: 'website',
    url: '/build-pizza',
    images: [
      {
        url: '/images/pizza-builder-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Pizza Builder - Create Your Perfect Pizza'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Your Perfect Pizza | Omar Pizza',
    description: 'Create your dream pizza with our interactive pizza builder.',
    images: ['/images/pizza-builder-og.jpg']
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
    canonical: '/build-pizza'
  }
};

export default function BuildPizzaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Build Your Perfect Pizza',
    description: 'Create your dream pizza with our interactive pizza builder. Choose from fresh toppings, premium crusts, and signature sauces.',
    url: '/build-pizza',
    mainEntity: {
      '@type': 'Product',
      name: 'Custom Pizza',
      description: 'Build your own custom pizza with fresh ingredients',
      category: 'Food',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        seller: {
          '@type': 'Restaurant',
          name: 'Omar Pizza',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Boston',
            addressRegion: 'MA',
            addressCountry: 'US'
          }
        }
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
          name: 'Build Pizza',
          item: '/build-pizza'
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
