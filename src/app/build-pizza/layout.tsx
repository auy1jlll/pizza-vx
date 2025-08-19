import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Custom Pizza | RestoApp - Fresh Made to Order',
  description: 'Create your perfect pizza with our interactive pizza builder. Choose from premium toppings, crusts, and sizes. Fresh ingredients, made to order.',
  keywords: 'custom pizza, pizza builder, fresh pizza, made to order, pizza toppings, pizza crust, pizza sizes',
  openGraph: {
    title: 'Build Your Custom Pizza | RestoApp',
    description: 'Create your perfect pizza with our interactive pizza builder. Choose from premium toppings, crusts, and sizes.',
    type: 'website',
  },
};

export default function BuildPizzaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
