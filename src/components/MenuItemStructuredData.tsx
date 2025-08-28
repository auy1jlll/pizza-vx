import Script from 'next/script';

interface MenuItemStructuredDataProps {
  items?: Array<{
    name: string;
    description: string;
    price: number;
    category: string;
    ingredients?: string;
    imageUrl?: string;
  }>;
}

export default function MenuItemStructuredData({ items = [] }: MenuItemStructuredDataProps) {
  if (!items.length) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Pizza Builder Pro Menu Items",
    "description": "Fresh pizzas, calzones, and Italian dishes",
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "MenuItem",
      "position": index + 1,
      "name": item.name,
      "description": item.description,
      "menuAddOn": {
        "@type": "MenuSection",
        "name": item.category
      },
      "offers": {
        "@type": "Offer",
        "price": item.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "nutrition": {
        "@type": "NutritionInformation",
        "description": item.ingredients || "Fresh ingredients"
      },
      ...(item.imageUrl && {
        "image": item.imageUrl
      })
    }))
  };

  return (
    <Script
      id="menu-items-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
