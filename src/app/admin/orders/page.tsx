'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

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

  const statusOptions = [
    'PENDING',
    'CONFIRMED', 
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED'
  ];

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-auto">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Orders Management</h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-700">
              View and manage customer orders
            </p>
          </div>
          <div className="flex-none">
            <button
              onClick={fetchOrders}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="mt-6 sm:hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.orderType === 'DELIVERY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.orderType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900">{order.customerName || 'Guest'}</p>
                    <p className="text-xs text-gray-500 truncate">{order.customerEmail}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updateLoading === order.id}
                      className={`flex-1 rounded-md px-3 py-1 text-xs font-semibold border border-gray-300 focus:ring-2 focus:ring-indigo-500 ${
                        statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-indigo-600 text-white px-3 py-1 text-xs font-medium rounded-md hover:bg-indigo-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="mt-8 flow-root hidden sm:block">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{order.customerName || 'Guest'}</div>
                              <div className="text-gray-500">{order.customerEmail}</div>
                              <div className="text-gray-500">{order.customerPhone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderType === 'DELIVERY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {order.orderType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updateLoading === order.id}
                              className={`rounded-full px-3 py-1 text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${
                                statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-2 sm:p-4">
            <div className="relative top-4 sm:top-20 mx-auto border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-10rem)] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Order Details - {selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
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
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedOrder.customerName || 'Guest'}</p>
                        <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                        <p className="sm:col-span-2 break-all"><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Type and Delivery */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Order Type</h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> {selectedOrder.orderType}</p>
                        {selectedOrder.orderType === 'DELIVERY' && (
                          <>
                            <p><span className="font-medium">Address:</span> {selectedOrder.deliveryAddress}</p>
                            <p><span className="font-medium">City:</span> {selectedOrder.deliveryCity}</p>
                            <p><span className="font-medium">ZIP:</span> {selectedOrder.deliveryZip}</p>
                            {selectedOrder.deliveryInstructions && (
                              <p><span className="font-medium">Instructions:</span> {selectedOrder.deliveryInstructions}</p>
                            )}
                          </>
                        )}
                        {selectedOrder.scheduledTime && (
                          <p><span className="font-medium">Scheduled Time:</span> {formatDate(selectedOrder.scheduledTime)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={item.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1">
                            <h5 className="font-medium text-sm">Pizza #{index + 1}</h5>
                            <span className="font-bold text-sm">{formatCurrency(item.totalPrice)}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                              <p><span className="font-medium">Size:</span> {item.pizzaSize.name} ({item.pizzaSize.diameter})</p>
                              <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                              <p><span className="font-medium">Crust:</span> {item.pizzaCrust.name}</p>
                              <p><span className="font-medium">Sauce:</span> {item.pizzaSauce.name}</p>
                            </div>
                            {item.toppings.length > 0 && (
                              <div className="mt-2">
                                <span className="font-medium">Toppings:</span>
                                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                                  {item.toppings.map((topping) => (
                                    <div key={topping.id} className="flex justify-between text-xs">
                                      <span>{topping.pizzaTopping.name} (x{topping.quantity})</span>
                                      <span>{formatCurrency(topping.price)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.notes && (
                              <p className="mt-2 p-2 bg-yellow-50 rounded text-xs"><span className="font-medium">Notes:</span> {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Order Summary</h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        {selectedOrder.deliveryFee > 0 && (
                          <div className="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                      {selectedOrder.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm"><span className="font-medium">Order Notes:</span> {selectedOrder.notes}</p>
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm"><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
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
