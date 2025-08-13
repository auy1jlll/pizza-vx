'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
  basePrice: number;
}

interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
}

interface PizzaSauce {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
}

interface PizzaTopping {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItemTopping {
  id: string;
  quantity: number;
  price: number;
  pizzaTopping: PizzaTopping;
}

interface OrderItem {
  id: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  notes?: string;
  pizzaSize: PizzaSize;
  pizzaCrust: PizzaCrust;
  pizzaSauce: PizzaSauce;
  toppings: OrderItemTopping[];
}

interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status: string;
  orderType: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryInstructions?: string;
  scheduledTime?: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderReceived() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/order/${orderNumber}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order details');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusMessage = (status: string, orderType: string) => {
    const messages = {
      PENDING: 'Your order has been received and is being processed.',
      CONFIRMED: 'Your order has been confirmed and is in the queue.',
      PREPARING: 'Your pizza is being prepared by our kitchen team.',
      READY: orderType === 'PICKUP' ? 'Your order is ready for pickup!' : 'Your order is ready for delivery!',
      COMPLETED: 'Your order has been completed. Thank you!',
      CANCELLED: 'Your order has been cancelled.'
    };
    return messages[status as keyof typeof messages] || 'Order status updated.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex flex-col items-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600 text-center">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow sm:rounded-lg w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">Order Not Found</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 px-2 break-words">
                {error || 'The order you are looking for could not be found.'}
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="w-full mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-3">
            <div className="flex items-center min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">🍕 Pizza Builder</h1>
            </div>
            <Link
              href="/"
              className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100">
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600 px-4">
            Thank you for your order. Here are your order details:
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
          {/* Order Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-orange-50 border-b border-orange-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">Order #{order.orderNumber}</h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className={`flex-shrink-0 inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-start sm:items-center gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 sm:mt-0 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                {getStatusMessage(order.status, order.orderType)}
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-6">
            {/* Customer Information */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Customer Information</h4>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 truncate">{order.customerName || 'Guest'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 break-words">{order.customerEmail}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 truncate">{order.customerPhone}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Order Type</p>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 truncate">{order.orderType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {order.orderType === 'DELIVERY' && (
              <div className="mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Delivery Information</h4>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-sm sm:text-base break-words"><span className="font-medium">Address:</span> {order.deliveryAddress}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">City:</span> {order.deliveryCity}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">ZIP:</span> {order.deliveryZip}</p>
                    {order.deliveryInstructions && (
                      <p className="text-sm sm:text-base break-words"><span className="font-medium">Instructions:</span> {order.deliveryInstructions}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Your Order</h4>
              <div className="space-y-3 sm:space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 w-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                      <h5 className="font-medium text-gray-900 text-sm sm:text-base min-w-0 flex-1 truncate">Pizza #{index + 1}</h5>
                      <span className="font-bold text-gray-900 text-sm sm:text-base flex-shrink-0">{formatCurrency(item.totalPrice)}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="space-y-1 min-w-0">
                        <p className="truncate"><span className="font-medium">Size:</span> {item.pizzaSize.name} ({item.pizzaSize.diameter})</p>
                        <p className="truncate"><span className="font-medium">Crust:</span> {item.pizzaCrust.name}</p>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="truncate"><span className="font-medium">Sauce:</span> {item.pizzaSauce.name}</p>
                        <p className="truncate"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                      </div>
                    </div>
                    {item.toppings.length > 0 && (
                      <div className="mt-3 w-full overflow-hidden">
                        <p className="font-medium text-xs sm:text-sm mb-2">Toppings:</p>
                        <div className="w-full">
                          {item.toppings.map((topping) => (
                            <div key={topping.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0 min-w-0">
                              <span className="text-gray-700 text-xs sm:text-sm truncate flex-1 mr-2">{topping.pizzaTopping.name} (x{topping.quantity})</span>
                              <span className="font-medium text-xs sm:text-sm flex-shrink-0">{formatCurrency(topping.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.notes && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-md w-full overflow-hidden">
                        <p className="text-xs sm:text-sm break-words"><span className="font-medium">Notes:</span> {item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Order Summary</h4>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Delivery Fee:</span>
                      <span>{formatCurrency(order.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Tax:</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Order Notes</h4>
                <p className="text-xs sm:text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 w-full">
          <Link
            href="/pizza-builder"
            className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            🍕 Order Another Pizza
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
