import Script from 'next/script';

interface LocalBusinessStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  phone?: string;
  address?: string;
}

export default function LocalBusinessStructuredData({
  name = process.env.NEXT_PUBLIC_APP_NAME || "Greenland Famous Roast Beef N' Pizza",
  description = process.env.NEXT_PUBLIC_META_DESCRIPTION || "Local Italian restaurant serving authentic pizza, roast beef sandwiches, and calzones. Family-owned with fresh local ingredients and great ratings.",
  url = process.env.NEXT_PUBLIC_SITE_URL || "https://greenlandfamous.net",
  phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "(555) 123-PIZZA",
  address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "123 Main St, Greenland, NH 03840"
}: LocalBusinessStructuredDataProps) {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    "name": name,
    "description": description,
    "url": url,
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.split(',')[0]?.trim() || "123 Main St",
      "addressLocality": process.env.NEXT_PUBLIC_BUSINESS_CITY || address.split(',')[1]?.trim() || "Greenland",
      "addressRegion": process.env.NEXT_PUBLIC_BUSINESS_STATE || address.split(',')[2]?.trim() || "NH",
      "postalCode": process.env.NEXT_PUBLIC_BUSINESS_ZIP || address.split(',')[3]?.trim() || "03840",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": process.env.NEXT_PUBLIC_BUSINESS_LATITUDE || "43.0362",
      "longitude": process.env.NEXT_PUBLIC_BUSINESS_LONGITUDE || "-70.8328"
    },
    "openingHours": [
      "Mo-Th 11:00-22:00",
      "Fr-Sa 11:00-23:00",
      "Su 12:00-21:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Apple Pay", "Google Pay"],
    "currenciesAccepted": "USD",
    "servesCuisine": ["Italian", "Pizza", "American", "Sandwiches"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Food Menu",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pizza Delivery",
            "description": "Fast delivery of fresh pizza near me"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roast Beef Sandwiches",
            "description": "Authentic roast beef sandwiches made fresh daily"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "464",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Local Customer"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Best pizza near me! Fresh ingredients and amazing taste. Highly recommend for lunch or dinner."
      }
    ],
    "sameAs": [
      process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/greenlandfamous",
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/greenlandfamous",
      process.env.NEXT_PUBLIC_TRIPADVISOR_URL || "https://www.tripadvisor.com/greenlandfamous",
      process.env.NEXT_PUBLIC_YELP_URL || "https://www.yelp.com/biz/greenland-famous-roast-beef-n-pizza"
    ],
    "areaServed": {
      "@type": "City",
      "name": process.env.NEXT_PUBLIC_BUSINESS_CITY || "Greenland",
      "addressRegion": process.env.NEXT_PUBLIC_BUSINESS_STATE || "NH",
      "addressCountry": "US"
    },
    "knowsAbout": [
      "Italian Cuisine",
      "Fresh Pizza",
      "Roast Beef Sandwiches",
      "Local Restaurant",
      "Family Dining",
      "Delivery Service"
    ]
  };

  return (
    <Script
      id="local-business-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}
