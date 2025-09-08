import { Metadata } from 'next';
import PizzaTestClient from '@/components/PizzaTestClient';

export const metadata: Metadata = {
  title: 'Pizza Test - Specialty Pizzas',
  description: 'Test page displaying all specialty pizzas from the database',
};

export default function PizzaTestPage() {
  return <PizzaTestClient />;
}
