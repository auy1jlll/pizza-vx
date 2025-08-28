import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Perfect Pizza | Custom Pizza Builder | Local Pizza House',
  description: 'Create your dream pizza with our interactive pizza builder. Choose from fresh toppings, premium crusts, and signature sauces. Order online for delivery or pickup.',
  keywords: [
    'pizza builder',
    'custom pizza',
    'build pizza online',
    'pizza maker',
    'fresh toppings',
    'pizza delivery',
    'Boston pizza',
    'Local Pizza House'
  ],
  openGraph: {
    title: 'Build Your Perfect Pizza | Local Pizza House',
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
    title: 'Build Your Perfect Pizza | Local Pizza House',
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
