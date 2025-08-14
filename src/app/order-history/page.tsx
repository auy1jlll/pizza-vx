'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';

interface OrderItem {
  id: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  notes?: string;
  size: {
    id: string;
    name: string;
    diameter: string;
  };
  crust: {
    id: string;
    name: string;
    description?: string;
  };
  sauce: {
    id: string;
    name: string;
    description?: string;
  };
  toppings: Array<{
    id: string;
    name: string;
    section: string;
    intensity: string;
    price: number;
  }>;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  scheduledTime?: string;
  itemCount: number;
  items: OrderItem[];
}

interface OrderHistoryResponse {
  orders: Order[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [reorderLoading, setReorderLoading] = useState<Set<string>>(new Set());
  
  const { addDetailedPizza } = useCart();
  const { user } = useUser();

  // Auto-fill email if user is authenticated
  useEffect(() => {
    if (user && user.email && !email) {
      setEmail(user.email);
      fetchOrders(user.email, 0);
    }
  }, [user]);

  const fetchOrders = async (customerEmail: string, offset = 0) => {
    if (!customerEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/customer/orders?email=${encodeURIComponent(customerEmail)}&offset=${offset}&limit=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: OrderHistoryResponse = await response.json();
      
      if (offset === 0) {
        setOrders(data.orders);
      } else {
        setOrders(prev => [...prev, ...data.orders]);
      }
      
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreOrders = () => {
    if (pagination.hasMore && !loading) {
      fetchOrders(email, pagination.offset + pagination.limit);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const reorderItem = async (item: OrderItem) => {
    const itemId = `reorder-${item.id}`;
    setReorderLoading(prev => new Set([...prev, itemId]));

    try {
      // Convert order item to cart format
      const detailedToppings = item.toppings.map(topping => ({
        toppingId: topping.id,
        toppingName: topping.name,
        section: topping.section as 'WHOLE' | 'LEFT' | 'RIGHT',
        intensity: topping.intensity as 'LIGHT' | 'REGULAR' | 'EXTRA',
        price: topping.price
      }));

      await addDetailedPizza({
        sizeId: item.size.id,
        sizeName: item.size.name,
        crustId: item.crust.id,
        crustName: item.crust.name,
        sauceId: item.sauce.id,
        sauceName: item.sauce.name,
        sauceIntensity: 'REGULAR' as const,
        crustCookingLevel: 'REGULAR' as const,
        detailedToppings,
        notes: item.notes,
        totalPrice: item.totalPrice
      });

      // Show success message
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error reordering item:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setReorderLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
          
          {/* Email Input */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your email to view order history
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      fetchOrders(email, 0);
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => fetchOrders(email, 0)}
                  disabled={loading || !email.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'View Orders'}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Orders ({pagination.total} total)
                </h2>
              </div>

              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {order.orderType} • {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-sm text-red-600 hover:text-red-700 mt-1"
                        >
                          {expandedOrders.has(order.id) ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  {expandedOrders.has(order.id) && (
                    <div className="px-6 py-4 bg-white">
                      {/* Delivery/Pickup Info */}
                      {order.orderType === 'DELIVERY' && order.deliveryAddress && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm font-medium text-blue-900">Delivery Address:</p>
                          <p className="text-sm text-blue-800">
                            {order.deliveryAddress}
                            {order.deliveryCity && `, ${order.deliveryCity}`}
                            {order.deliveryZip && ` ${order.deliveryZip}`}
                          </p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.size.name} Pizza ({item.size.diameter})
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.crust.name} • {item.sauce.name}
                                </p>
                                
                                {/* Toppings */}
                                {item.toppings.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">Toppings:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.toppings.map((topping) => (
                                        <span
                                          key={`${topping.id}-${topping.section}`}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                        >
                                          {topping.name}
                                          {topping.section !== 'WHOLE' && ` (${topping.section})`}
                                          {topping.intensity !== 'REGULAR' && ` - ${topping.intensity}`}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                {item.notes && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-medium">Notes:</span> {item.notes}
                                  </p>
                                )}
                              </div>
                              
                              <div className="ml-4 text-right">
                                <p className="font-medium text-gray-900">
                                  ${item.totalPrice.toFixed(2)}
                                  {item.quantity > 1 && (
                                    <span className="text-sm text-gray-600 ml-1">
                                      x{item.quantity}
                                    </span>
                                  )}
                                </p>
                                <button
                                  onClick={() => reorderItem(item)}
                                  disabled={reorderLoading.has(`reorder-${item.id}`)}
                                  className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                  {reorderLoading.has(`reorder-${item.id}`) ? 'Adding...' : 'Reorder'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Totals */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          {order.deliveryFee > 0 && (
                            <div className="flex justify-between">
                              <span>Delivery Fee:</span>
                              <span>${order.deliveryFee.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium text-base pt-1 border-t border-gray-200">
                            <span>Total:</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Notes */}
                      {order.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                          <p className="text-sm font-medium text-yellow-900">Order Notes:</p>
                          <p className="text-sm text-yellow-800">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="text-center pt-6">
                  <button
                    onClick={loadMoreOrders}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More Orders'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No Orders Message */}
          {orders.length === 0 && email && !loading && !error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No orders were found for this email address. Try a different email or place your first order!
                </p>
                <div className="mt-6">
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Start Ordering
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
