// Static metadata generation with fallback to environment variables
import { Metadata } from 'next';

// Static metadata - no database dependency during build
function getStaticAppSettings() {
  return {
    app_name: process.env.NEXT_PUBLIC_APP_NAME || 'Pizza Builder Pro',
    meta_title: process.env.NEXT_PUBLIC_META_TITLE || 'Best Pizza & Roast Beef Near Me | Authentic Italian Restaurant | Fresh Local Ingredients',
    meta_description: process.env.NEXT_PUBLIC_META_DESCRIPTION || 'Order the best pizza near me, roast beef sandwiches, and authentic Italian food. Custom pizza builder with fresh local ingredients. Fast delivery & great ratings. Open for lunch & dinner.',
    meta_keywords: process.env.NEXT_PUBLIC_META_KEYWORDS || 'pizza near me, roast beef near me, restaurant near me, good lunch near me, italian restaurant near me, best pizza delivery, fresh pizza dough, custom pizza builder, calzone near me, local restaurant, family restaurant, authentic italian food',
    business_phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-PIZZA',
    business_address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '123 Main St, Your City, State 12345',
    business_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourpizzaplace.com'
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = getStaticAppSettings();
  
  return {
    title: settings.meta_title,
    description: settings.meta_description,
    keywords: settings.meta_keywords,
    authors: [{ name: settings.app_name }],
    creator: settings.app_name,
    publisher: settings.app_name,
    metadataBase: new URL(settings.business_url),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: settings.meta_title,
      description: settings.meta_description,
      type: 'website',
      locale: 'en_US',
      url: settings.business_url,
      siteName: settings.app_name,
      images: [
        {
          url: '/pizza-hero.jpg',
          width: 1200,
          height: 630,
          alt: settings.meta_title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.meta_title,
      description: settings.meta_description,
      images: ['/pizza-hero.jpg'],
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
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}
