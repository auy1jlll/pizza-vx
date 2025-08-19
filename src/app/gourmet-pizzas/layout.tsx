import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gourmet Specialty Pizzas | RestoApp - Chef-Crafted Premium Pizzas',
  description: 'Discover our collection of gourmet specialty pizzas crafted by our chefs. Premium ingredients, unique flavor combinations, available in all sizes.',
  keywords: 'gourmet pizza, specialty pizza, premium pizza, chef crafted pizza, signature pizza, artisan pizza',
  openGraph: {
    title: 'Gourmet Specialty Pizzas | RestoApp',
    description: 'Discover our collection of gourmet specialty pizzas crafted by our chefs. Premium ingredients and unique flavor combinations.',
    type: 'website',
  },
};

export default function GourmetPizzasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
