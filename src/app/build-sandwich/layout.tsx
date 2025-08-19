import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Custom Sandwich | RestoApp - Fresh Artisan Sandwiches',
  description: 'Customize your perfect sandwich with fresh ingredients. Choose your bread, proteins, vegetables, and sauces. Made fresh to order.',
  keywords: 'custom sandwich, sandwich builder, fresh sandwich, artisan sandwich, deli sandwich, sandwich customization',
  openGraph: {
    title: 'Build Your Custom Sandwich | RestoApp',
    description: 'Customize your perfect sandwich with fresh ingredients. Choose your bread, proteins, vegetables, and sauces.',
    type: 'website',
  },
};

export default function BuildSandwichLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
