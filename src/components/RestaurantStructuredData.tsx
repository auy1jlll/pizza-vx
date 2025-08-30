import Script from 'next/script';

interface RestaurantStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  phone?: string;
  address?: string;
}

export default function RestaurantStructuredData({
  name = process.env.NEXT_PUBLIC_APP_NAME || "Greenland Famous Roast Beef N' Pizza",
  description = process.env.NEXT_PUBLIC_META_DESCRIPTION || "Authentic local Italian restaurant serving the best pizza near me, roast beef sandwiches, and fresh calzones. Family-owned with great ratings and exceptional quality.",
  url = process.env.NEXT_PUBLIC_SITE_URL || "https://greenlandfamous.net",
  phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "(555) 123-PIZZA",
  address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "123 Main St, Greenland, NH 03840"
}: RestaurantStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
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
    "servesCuisine": ["Italian", "Pizza", "Calzone"],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "USD",
    "hasMenu": `${url}/menu`,
    "acceptsReservations": false,
    "takeout": true,
    "delivery": false,
    "dineIn": true,
    "image": `${url}/pizza-hero.jpg`,
    "logo": `${url}/next.svg`,
    "sameAs": [
      "https://www.facebook.com/yourpizzaplace",
      "https://www.instagram.com/yourpizzaplace",
      "https://www.twitter.com/yourpizzaplace"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "464",
      "bestRating": "5",
      "worstRating": "1"
    },
    "menu": {
      "@type": "Menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Pizza",
          "description": "Custom and specialty pizzas with fresh ingredients",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Build Your Own Pizza",
              "description": "Create your perfect pizza with our interactive builder",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": "12.99"
              }
            }
          ]
        },
        {
          "@type": "MenuSection", 
          "name": "Calzones",
          "description": "Authentic Italian calzones with traditional recipes",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Build Your Own Calzone",
              "description": "Customize your calzone with fresh ingredients",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD", 
                "price": "13.99"
              }
            }
          ]
        }
      ]
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are your hours?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We are open Monday-Thursday 11AM-10PM, Friday-Saturday 11AM-11PM, and Sunday 12PM-9PM."
          }
        },
        {
          "@type": "Question", 
          "name": "Do you offer pickup?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer convenient pickup service. Place your order online and pick it up at your convenience."
          }
        },
        {
          "@type": "Question",
          "name": "What makes your pizza special?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "We use fresh local ingredients and traditional Italian recipes. Our dough is made fresh daily and we offer custom pizza building."
          }
        },
        {
          "@type": "Question",
          "name": "Do you cater events?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer catering services for parties, events, and corporate functions. Contact us for menu options and pricing."
          }
        }
      ]
    }
  };

  return (
    <Script
      id="restaurant-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
