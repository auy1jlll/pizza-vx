// Individual page metadata configurations for SEO optimization
// Safe to add without breaking existing functionality

export const pageMetadata = {
  home: {
    title: "Authentic Boston Pizza | Fresh Italian Cuisine | Build Your Perfect Pizza",
    description: "Experience authentic Boston pizza with fresh, locally-sourced ingredients. Build custom pizzas & calzones or choose from our North End-inspired specialties. Order online 24/7 for delivery across Greater Boston.",
    keywords: "Boston pizza delivery, authentic Italian pizza Boston, custom pizza builder, fresh ingredients pizza, North End pizza, Greater Boston delivery, build your own pizza, artisan pizza Boston, local pizza restaurant, Boston calzones",
    h1: "Authentic Boston Pizza Experience"
  },
  
  "build-pizza": {
    title: "Build Your Perfect Pizza | Custom Pizza Creator | Boston's Best",
    description: "Create your dream pizza with our interactive pizza builder. Choose from 50+ fresh toppings, artisan crusts, and gourmet sauces. Unlimited customization for the perfect Boston-style pizza experience.",
    keywords: "custom pizza builder, build your own pizza, pizza customization tool, fresh pizza toppings, interactive pizza creator, personalized pizza Boston, pizza builder online, custom pizza delivery, gourmet pizza options, artisan pizza crusts",
    h1: "Build Your Perfect Pizza"
  },
  
  "build-calzone": {
    title: "Build Your Custom Calzone | Calzone Creator | Fresh Italian Flavors",
    description: "Craft the perfect calzone with our custom builder. Choose your fillings, cheeses, and sauces for a personalized Italian experience. Fresh ingredients, authentic recipes, delivered hot to your door.",
    keywords: "custom calzone builder, build your own calzone, calzone creator tool, Italian calzone Boston, fresh calzone fillings, personalized calzone, calzone delivery Boston, gourmet calzone options, authentic Italian calzone, calzone customization",
    h1: "Build Your Perfect Calzone"
  },
  
  "specialty-pizzas": {
    title: "Gourmet Specialty Pizzas | Chef-Crafted Italian Classics | Boston Delivery",
    description: "Discover our signature specialty pizzas inspired by Boston's North End. From classic Margherita to unique local favorites, each pizza features premium ingredients and traditional Italian techniques.",
    keywords: "specialty pizza Boston, gourmet pizza delivery, North End pizza recipes, signature pizza creations, Italian specialty pizzas, chef-crafted pizzas, premium pizza ingredients, traditional Italian pizza, Boston pizza specialties, artisan pizza menu",
    h1: "Our Signature Specialty Pizzas"
  },
  
  "specialty-calzones": {
    title: "Specialty Calzones | Authentic Italian Recipes | Boston's Finest",
    description: "Savor our chef-designed specialty calzones featuring traditional Italian recipes with a Boston twist. Each calzone is hand-folded with premium ingredients and baked to golden perfection.",
    keywords: "specialty calzones Boston, authentic Italian calzones, gourmet calzone delivery, traditional calzone recipes, chef-designed calzones, premium calzone ingredients, Italian cuisine Boston, hand-folded calzones, Boston calzone delivery, artisan calzone menu",
    h1: "Our Signature Specialty Calzones"
  },
  
  menu: {
    title: "Full Menu | Pizza, Calzones & More | Boston Italian Restaurant",
    description: "Browse our complete menu featuring custom pizza builders, specialty pies, gourmet calzones, and Italian favorites. Fresh ingredients, authentic recipes, and convenient online ordering.",
    keywords: "pizza menu Boston, Italian restaurant menu, pizza delivery menu, calzone menu options, Boston pizza prices, online pizza menu, Italian food delivery, restaurant menu Boston, pizza restaurant menu, food delivery Boston",
    h1: "Our Complete Menu"
  },
  
  checkout: {
    title: "Secure Checkout | Complete Your Boston Pizza Order",
    description: "Complete your order with our secure checkout. Choose delivery or pickup and enjoy fresh Boston pizza delivered to your door across Greater Boston area.",
    keywords: "pizza checkout, order pizza Boston, pizza delivery Boston, secure ordering, Boston pizza online",
    h1: "Complete Your Order"
  }
};

// Schema.org structured data for rich snippets
export const structuredData = {
  restaurant: {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Boston Authentic Pizza",
    "description": "Authentic Boston pizza restaurant serving fresh, locally-sourced Italian cuisine with custom pizza and calzone builders. Inspired by North End traditions.",
    "servesCuisine": ["Italian", "Pizza", "Calzone"],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Apple Pay", "Google Pay"],
    "hasMenu": true,
    "orderType": ["TakeOut", "Delivery"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Boston",
      "addressRegion": "MA", 
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 42.3601,
      "longitude": -71.0589
    },
    "telephone": "+1-XXX-XXX-XXXX",
    "url": "https://your-domain.com",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "11:00",
        "closes": "23:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  },
  
  foodEstablishment: {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Boston Authentic Pizza",
    "description": "Custom pizza and calzone builder with fresh, locally-sourced ingredients from Greater Boston area",
    "servesCuisine": ["Pizza", "Italian", "Calzone"],
    "hasMenu": {
      "@type": "Menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Custom Pizzas",
          "description": "Build your own pizza with 50+ fresh ingredients and artisan crusts"
        },
        {
          "@type": "MenuSection", 
          "name": "Custom Calzones",
          "description": "Create your perfect calzone with authentic Italian fillings"
        },
        {
          "@type": "MenuSection",
          "name": "Specialty Pizzas", 
          "description": "Chef-crafted signature pizzas inspired by Boston's North End"
        },
        {
          "@type": "MenuSection",
          "name": "Specialty Calzones",
          "description": "Traditional Italian calzone recipes with a Boston twist"
        }
      ]
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "42.3601",
        "longitude": "-71.0589"
      },
      "geoRadius": "25000"
    }
  },

  // Local Business schema for enhanced local SEO
  localBusiness: {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "name": "Boston Authentic Pizza",
    "description": "Authentic Boston pizza restaurant with custom builders and North End-inspired specialties",
    "url": "https://your-domain.com",
    "logo": "https://your-domain.com/logo.png",
    "image": "https://your-domain.com/restaurant-image.jpg",
    "priceRange": "$$",
    "smokingAllowed": false,
    "delivery": true,
    "takeaway": true,
    "sameAs": [
      "https://www.facebook.com/your-page",
      "https://www.instagram.com/your-account", 
      "https://twitter.com/your-account"
    ]
  }
};
