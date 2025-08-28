import Script from 'next/script';

interface RestaurantStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  phone?: string;
  address?: string;
}

export default function RestaurantStructuredData({
  name = "Pizza Builder Pro",
  description = "Authentic local Italian pizza and calzones with fresh ingredients. Custom pizza builder and traditional recipes.",
  url = "https://yourpizzaplace.com",
  phone = "(555) 123-PIZZA",
  address = "123 Main St, Your City, State 12345"
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
      "streetAddress": address.split(',')[0] || "123 Main St",
      "addressLocality": address.split(',')[1]?.trim() || "Your City",
      "addressRegion": address.split(',')[2]?.trim() || "State",
      "postalCode": address.split(',')[3]?.trim() || "12345",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "42.3601",
      "longitude": "-71.0589"
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
    "delivery": true,
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
      "ratingValue": "4.5",
      "reviewCount": "250"
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
