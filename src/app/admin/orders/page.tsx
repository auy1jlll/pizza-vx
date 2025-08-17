'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ToastProvider';

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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const { show: showToast } = useToast();

  // Helper functions for order categorization
  const getOrderTypeIcon = (orderType: string): string => {
    return orderType === 'DELIVERY' ? '🚚' : '🏪';
  };

  const getOrderTypeColor = (orderType: string): string => {
    return orderType === 'DELIVERY' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30';
  };

  const getOrderPriority = (status: string): number => {
    const priorities = {
      PENDING: 1,
      CONFIRMED: 2,
      PREPARING: 3,
      READY: 4,
      COMPLETED: 5,
      CANCELLED: 6
    };
    return priorities[status as keyof typeof priorities] || 5;
  };

  const getTimeElapsed = (createdAt: string): string => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const statusOptions = [
    'PENDING',
    'CONFIRMED', 
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED'
  ];

  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    CONFIRMED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    PREPARING: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    READY: 'bg-green-500/20 text-green-300 border-green-500/30',
    COMPLETED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  const statusIcons = {
    PENDING: '⏳',
    CONFIRMED: '✅', 
    PREPARING: '👨‍🍳',
    READY: '🍕',
    COMPLETED: '📦',
    CANCELLED: '❌'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdateLoading(orderId);
      
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the order in the list
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        
        // Update selected order if it's the one being updated
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        setError(data.error || 'Failed to update order');
      }
    } catch (err) {
      setError('Failed to update order');
      console.error('Error updating order:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const clearAllOrders = async () => {
    if (!confirm('Are you sure you want to clear ALL orders? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/orders?clearAll=true', {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders([]);
        setSelectedOrder(null);
        showToast(data.message || 'All orders cleared', { type: 'success' });
      } else {
        setError(data.error || 'Failed to clear orders');
      }
    } catch (err) {
      setError('Failed to clear orders');
      console.error('Error clearing orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setUpdateLoading(orderId);
      
      const response = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } else {
        setError(data.error || 'Failed to delete order');
      }
    } catch (err) {
      setError('Failed to delete order');
      console.error('Error deleting order:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-auto">
            <h1 className="text-3xl font-bold text-white">Orders Management</h1>
            <p className="mt-2 text-lg text-gray-300">
              View and manage customer orders
            </p>
          </div>
          <div className="flex-none flex gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">🔄</span>
              <span>Refresh Orders</span>
            </button>
            <button
              onClick={clearAllOrders}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">🗑️</span>
              <span>Clear All Orders</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex">
              <span className="text-red-400 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-300">Error</h3>
                <p className="mt-1 text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Cards */}
        <div className="mt-8">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-lg text-gray-300">No orders found</p>
              <p className="text-sm text-gray-400 mt-2">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders
                .sort((a, b) => getOrderPriority(a.status) - getOrderPriority(b.status))
                .map((order) => (
                <div
                  key={order.id}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))`,
                  }}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{order.orderNumber.slice(-3)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-green-300 transition-colors">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-xs text-gray-400">{getTimeElapsed(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-400">👤</span>
                      <span className="text-white font-medium">{order.customerName || 'Guest'}</span>
                    </div>
                    {order.customerPhone && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-green-400">📞</span>
                        <span className="text-gray-300 text-sm">{order.customerPhone}</span>
                      </div>
                    )}
                    {order.customerEmail && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-yellow-400">📧</span>
                        <span className="text-gray-300 text-sm truncate">{order.customerEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Type & Items Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium border ${getOrderTypeColor(order.orderType)}`}>
                      <span>{getOrderTypeIcon(order.orderType)}</span>
                      <span>{order.orderType}</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">Status</span>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updateLoading === order.id}
                      className={`w-full rounded-lg px-3 py-2 text-sm font-medium border bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        statusColors[order.status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                      }`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status} className="bg-gray-800 text-white">
                          {statusIcons[status as keyof typeof statusIcons]} {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-400 mb-2">Items:</div>
                    <div className="space-y-1">
                      {order.orderItems.slice(0, 2).map((item, index) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            {item.quantity}x {item.pizzaSize.name} {item.pizzaCrust.name}
                          </span>
                          <span className="text-green-400">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                      {order.orderItems.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{order.orderItems.length - 2} more item{order.orderItems.length - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-blue-500/30 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      disabled={updateLoading === order.id}
                      className="bg-red-600/80 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-red-500/30 text-sm font-medium disabled:opacity-50"
                    >
                      {updateLoading === order.id ? '...' : '🗑️'}
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"></div>
                  </div>

                  {/* Priority Indicator */}
                  {(order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'PREPARING') && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-2 sm:p-4">
            <div className="relative top-4 sm:top-20 mx-auto border border-white/10 w-full max-w-4xl shadow-2xl rounded-2xl bg-gray-800/90 backdrop-blur-md max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-10rem)] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    Order Details - #{selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-white mb-2">Customer Information</h4>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                        <p className="text-gray-300"><span className="font-medium text-white">Name:</span> {selectedOrder.customerName || 'Guest'}</p>
                        <p className="text-gray-300"><span className="font-medium text-white">Phone:</span> {selectedOrder.customerPhone}</p>
                        <p className="sm:col-span-2 break-all text-gray-300"><span className="font-medium text-white">Email:</span> {selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Type and Delivery */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-white mb-2">Order Type</h4>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4 rounded-xl">
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300"><span className="font-medium text-white">Type:</span> {selectedOrder.orderType}</p>
                        {selectedOrder.orderType === 'DELIVERY' && (
                          <>
                            <p className="text-gray-300"><span className="font-medium text-white">Address:</span> {selectedOrder.deliveryAddress}</p>
                            <p className="text-gray-300"><span className="font-medium text-white">City:</span> {selectedOrder.deliveryCity}</p>
                            <p className="text-gray-300"><span className="font-medium text-white">ZIP:</span> {selectedOrder.deliveryZip}</p>
                            {selectedOrder.deliveryInstructions && (
                              <p className="text-gray-300"><span className="font-medium text-white">Instructions:</span> {selectedOrder.deliveryInstructions}</p>
                            )}
                          </>
                        )}
                        {selectedOrder.scheduledTime && (
                          <p className="text-gray-300"><span className="font-medium text-white">Scheduled Time:</span> {formatDate(selectedOrder.scheduledTime)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-white mb-2">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4 rounded-xl">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1">
                            <h5 className="font-medium text-sm text-white">Pizza #{index + 1}</h5>
                            <span className="font-bold text-sm text-green-400">{formatCurrency(item.totalPrice)}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <p><span className="font-medium text-white">Size:</span> {item.pizzaSize.name} ({item.pizzaSize.diameter})</p>
                              <p><span className="font-medium text-white">Quantity:</span> {item.quantity}</p>
                              <p><span className="font-medium text-white">Crust:</span> {item.pizzaCrust.name}</p>
                              <p><span className="font-medium text-white">Sauce:</span> {item.pizzaSauce.name}</p>
                            </div>
                            {item.toppings.length > 0 && (
                              <div className="mt-2">
                                <span className="font-medium text-white">Toppings:</span>
                                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                                  {item.toppings.map((topping) => (
                                    <div key={topping.id} className="flex justify-between text-xs">
                                      <span className="text-gray-300">{topping.pizzaTopping.name} (x{topping.quantity})</span>
                                      <span className="text-green-400">{formatCurrency(topping.price)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.notes && (
                              <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded text-xs">
                                <div className="font-medium text-blue-200 mb-1">Pizza Details:</div>
                                <div className="text-blue-100 whitespace-pre-line">{item.notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-white mb-2">Order Summary</h4>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 sm:p-4 rounded-xl">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        {selectedOrder.deliveryFee > 0 && (
                          <div className="flex justify-between text-gray-300">
                            <span>Delivery Fee:</span>
                            <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-300">
                          <span>Tax:</span>
                          <span>{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base sm:text-lg border-t border-white/20 pt-2 text-white">
                          <span>Total:</span>
                          <span className="text-green-400">{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                      {selectedOrder.notes && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-sm text-gray-300"><span className="font-medium text-white">Order Notes:</span> {selectedOrder.notes}</p>
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-sm text-gray-300"><span className="font-medium text-white">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
