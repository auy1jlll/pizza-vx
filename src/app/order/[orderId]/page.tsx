import { OrderDetails } from '@/components/OrderDetails';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Order, OrderItem, PizzaSize, PizzaTopping, PizzaSauce, PizzaCrust, OrderItemTopping } from '@prisma/client';

// Re-define types here to match what the page and component expect
type ToppingInfo = OrderItemTopping & {
  pizzaTopping: PizzaTopping;
};

type FullOrderItem = OrderItem & {
  pizzaSize: PizzaSize;
  pizzaCrust: PizzaCrust;
  pizzaSauce: PizzaSauce;
  toppings: ToppingInfo[];
};

type FullOrder = Order & {
  orderItems: FullOrderItem[];
};

interface OrderConfirmationPageProps {
  params: {
    orderId: string;
  };
}

async function getOrder(id: string): Promise<FullOrder | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          pizzaSize: true,
          pizzaCrust: true,
          pizzaSauce: true,
          toppings: {
            include: {
              pizzaTopping: true,
            },
          },
        },
      },
    },
  });

  // The type assertion is necessary because Prisma's include type is not specific enough
  return order as FullOrder | null;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  // Destructuring orderId from params immediately.
  const { orderId } = params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              Thank You For Your Order!
            </h1>
            <p className="text-gray-600 mt-2">
              Your order has been placed successfully. A confirmation will be sent to your email.
            </p>
          </div>
          <OrderDetails order={order} />
        </div>
      </div>
    </div>
  );
}
