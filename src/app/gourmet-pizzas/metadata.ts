import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gourmet Specialty Pizzas | Artisan Pizza Collection | Omar Pizza',
  description: 'Discover our signature gourmet pizzas crafted with premium ingredients. From classic favorites to unique Boston-inspired creations. Order online for delivery or pickup.',
  keywords: [
    'gourmet pizza',
    'specialty pizza',
    'artisan pizza',
    'premium ingredients',
    'signature pizzas',
    'Boston pizza',
    'pizza delivery',
    'Omar Pizza'
  ],
  openGraph: {
    title: 'Gourmet Specialty Pizzas | Omar Pizza',
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
    title: 'Gourmet Specialty Pizzas | Omar Pizza',
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
