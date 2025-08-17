import type { Order, OrderItem, PizzaSize, PizzaTopping, PizzaSauce, PizzaCrust, OrderItemTopping } from '@prisma/client';

// Define more detailed types to reflect the nested includes from Prisma
type ToppingInfo = OrderItemTopping & {
  pizzaTopping: PizzaTopping;
};

type FullOrderItem = OrderItem & {
  pizzaSize: PizzaSize;
  pizzaCrust: PizzaCrust;
  pizzaSauce: PizzaSauce;
  toppings: ToppingInfo[];
};

// This is the main type for the order object expected by the component
type FullOrder = Order & {
  orderItems: FullOrderItem[];
};

interface OrderDetailsProps {
  order: FullOrder;
}

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-6 text-gray-800">
      {/* Order Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
        <p className="text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Items List */}
      <div className="border-t border-b border-gray-200 py-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Your Order</h3>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">
                  {item.quantity}x {item.pizzaSize?.name || 'Custom'} Pizza
                </p>
                <div className="text-sm text-gray-600 pl-3 mt-1">
                  {item.pizzaCrust && <p>Crust: {item.pizzaCrust.name}</p>}
                  {item.pizzaSauce && <p>Sauce: {item.pizzaSauce.name}</p>}
                  {item.toppings.length > 0 && (
                    <p>Toppings: {item.toppings.map(t => t.pizzaTopping.name).join(', ')}</p>
                  )}
                  {item.notes && <p className="italic mt-1">Notes: "{item.notes}"</p>}
                </div>
              </div>
              <p className="font-semibold text-gray-800">{formatCurrency(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer & Delivery Info */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Customer Information</h3>
        <div className="text-sm space-y-1 bg-gray-50 p-4 rounded-lg">
            <p><span className="font-medium text-gray-700">Name:</span> {order.customerName}</p>
            <p><span className="font-medium text-gray-700">Email:</span> {order.customerEmail}</p>
            <p><span className="font-medium text-gray-700">Phone:</span> {order.customerPhone}</p>
            {order.orderType === 'DELIVERY' && order.deliveryAddress && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                    <p className="font-medium text-gray-700">Delivery Address:</p>
                    <address className="not-italic">
                        {order.deliveryAddress}
                        <br />
                        {order.deliveryCity}, {order.deliveryZip}
                    </address>
                    {order.deliveryInstructions && <p className="italic mt-1">Instructions: "{order.deliveryInstructions}"</p>}
                </div>
            )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-gray-800 font-medium">{formatCurrency(order.subtotal)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Delivery Fee</p>
          <p className="text-gray-800 font-medium">{formatCurrency(order.deliveryFee)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Tax</p>
          <p className="text-gray-800 font-medium">{formatCurrency(order.tax)}</p>
        </div>
        {order.tipAmount && order.tipAmount > 0 && (
            <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tip</p>
                <p className="text-gray-800 font-medium">{formatCurrency(order.tipAmount)}</p>
            </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
          <p className="text-gray-900">Total</p>
          <p className="text-gray-900">{formatCurrency(order.total)}</p>
        </div>
      </div>
    </div>
  );
}