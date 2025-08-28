'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminPageLayout from '@/components/AdminPageLayout';
import { useToast } from '@/components/ToastProvider';
import { useSexyToast } from '@/components/SexyToastProvider';
import { ThermalPrinter, type PrinterOrder } from '@/lib/thermal-printer';

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

interface MenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
}

interface OrderItemTopping {
  id: string;
  quantity: number;
  price: number;
  pizzaTopping: PizzaTopping;
}

interface OrderItemCustomization {
  id: string;
  name: string;
  value: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  notes?: string;
  pizzaSize?: PizzaSize | null;
  pizzaCrust?: PizzaCrust | null;
  pizzaSauce?: PizzaSauce | null;
  menuItem?: MenuItem | null;
  toppings: OrderItemTopping[];
  customizations: OrderItemCustomization[];
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
  const [printLoading, setPrintLoading] = useState<string | null>(null);
  const { show: showToast } = useToast();
  const sexyToast = useSexyToast();

  // Helper functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getOrderTypeIcon = (orderType: string): string => {
    return orderType === 'DELIVERY' ? '🚚' : '🏪';
  };

  const getOrderTypeColor = (orderType: string): string => {
    return orderType === 'DELIVERY' 
      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
      : 'bg-green-500/20 text-green-300 border-green-500/30';
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

  const getItemDisplayName = (item: OrderItem): string => {
    if (item.menuItem) {
      return item.menuItem.name;
    }
    if (item.pizzaSize && item.pizzaCrust) {
      return `${item.pizzaSize.name} ${item.pizzaCrust.name} Pizza`;
    }
    return 'Custom Item';
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
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }

        sexyToast.showSuccess(`Order ${newStatus.toLowerCase()} successfully!`);
      } else {
        setError(data.error || 'Failed to update order');
        sexyToast.showError(data.error || 'Failed to update order');
      }
    } catch (err) {
      setError('Failed to update order');
      sexyToast.showError('Failed to update order');
      console.error('Error updating order:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const clearAllOrders = async () => {
    sexyToast.showConfirm({
      title: 'Clear All Orders',
      message: 'Are you sure you want to clear ALL orders? This action cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
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
            sexyToast.showSuccess('All orders cleared successfully!');
          } else {
            setError(data.error || 'Failed to clear orders');
            sexyToast.showError(data.error || 'Failed to clear orders');
          }
        } catch (err) {
          setError('Failed to clear orders');
          sexyToast.showError('Failed to clear orders');
          console.error('Error clearing orders:', err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const printOrderReceipt = async (order: Order) => {
    try {
      setPrintLoading(order.id);
      
      // Convert order to printer format
      const printerOrder: PrinterOrder = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderType: order.orderType,
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        deliveryZip: order.deliveryZip,
        deliveryInstructions: order.deliveryInstructions,
        status: order.status,
        createdAt: order.createdAt,
        orderItems: order.orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          notes: item.notes,
          pizzaSize: item.pizzaSize,
          pizzaCrust: item.pizzaCrust,
          pizzaSauce: item.pizzaSauce,
          menuItem: item.menuItem,
          toppings: item.toppings,
          customizations: item.customizations
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        total: order.total,
        notes: order.notes
      };

      await ThermalPrinter.printReceipt(printerOrder);
      sexyToast.showSuccess('Receipt sent to printer successfully!');
      
    } catch (error) {
      console.error('Print error:', error);
      sexyToast.showError('Failed to print receipt. Check printer connection.');
    } finally {
      setPrintLoading(null);
    }
  };

  const downloadOrderReceipt = (order: Order) => {
    try {
      // Convert order to printer format
      const printerOrder: PrinterOrder = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderType: order.orderType,
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        deliveryZip: order.deliveryZip,
        deliveryInstructions: order.deliveryInstructions,
        status: order.status,
        createdAt: order.createdAt,
        orderItems: order.orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          notes: item.notes,
          pizzaSize: item.pizzaSize,
          pizzaCrust: item.pizzaCrust,
          pizzaSauce: item.pizzaSauce,
          menuItem: item.menuItem,
          toppings: item.toppings,
          customizations: item.customizations
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        total: order.total,
        notes: order.notes
      };

      ThermalPrinter.downloadReceipt(printerOrder);
      sexyToast.showSuccess('Receipt downloaded successfully!');
      
    } catch (error) {
      console.error('Download error:', error);
      sexyToast.showError('Failed to download receipt.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
            <p className="font-semibold">Error loading orders:</p>
            <p>{error}</p>
            <button 
              onClick={fetchOrders}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Order Management"
        description={`${orders.length} total order${orders.length !== 1 ? 's' : ''}`}
        actionButton={
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center font-semibold shadow-lg disabled:opacity-50"
          >
            <svg className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Orders
          </button>
        }
      >
        {/* Error and success messages */}
        {error && (
          <div className="mb-8 backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-100">Error</h3>
                <p className="mt-1 text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Active Orders</h2>
              
              {orders
                .sort((a, b) => {
                  const statusPriority = {
                    PENDING: 1,
                    CONFIRMED: 2,
                    PREPARING: 3,
                    READY: 4,
                    COMPLETED: 5,
                    CANCELLED: 6
                  };
                  return (statusPriority[a.status as keyof typeof statusPriority] || 5) - 
                         (statusPriority[b.status as keyof typeof statusPriority] || 5);
                })
                .map((order) => (
                  <div
                    key={order.id}
                    className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{statusIcons[order.status as keyof typeof statusIcons]}</span>
                        <div>
                          <h3 className="font-semibold text-white">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-400">{getTimeElapsed(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{formatCurrency(order.total)}</div>
                        <div className={`text-xs px-2 py-1 rounded border ${getOrderTypeColor(order.orderType)}`}>
                          {getOrderTypeIcon(order.orderType)} {order.orderType}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {order.customerName && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-300">
                          👤 {order.customerName}
                          {order.customerPhone && (
                            <span className="ml-2">📞 {order.customerPhone}</span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Status Selector */}
                    <div className="mb-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updateLoading === order.id}
                        className={`w-full px-3 py-2 rounded border text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]} bg-black/50`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status} className="bg-gray-800 text-white">
                            {statusIcons[status as keyof typeof statusIcons]} {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Print Buttons */}
                    <div className="mb-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          printOrderReceipt(order);
                        }}
                        disabled={printLoading === order.id}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        {printLoading === order.id ? '⏳' : '🖨️'} Print
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadOrderReceipt(order);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        💾 Download
                      </button>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-400 mb-2">Items:</div>
                      <div className="space-y-1">
                        {order.orderItems.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              {item.quantity}x {getItemDisplayName(item)}
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

                    {/* Delivery Address */}
                    {order.orderType === 'DELIVERY' && order.deliveryAddress && (
                      <div className="text-sm text-gray-400">
                        📍 {order.deliveryAddress}, {order.deliveryCity} {order.deliveryZip}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Order Details */}
            <div className="lg:sticky lg:top-6">
              {selectedOrder ? (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Order #{selectedOrder.orderNumber}</h2>
                      <p className="text-gray-400">{getTimeElapsed(selectedOrder.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded border text-sm font-medium ${statusColors[selectedOrder.status as keyof typeof statusColors]}`}>
                        {statusIcons[selectedOrder.status as keyof typeof statusIcons]} {selectedOrder.status}
                      </div>
                      <button
                        onClick={() => printOrderReceipt(selectedOrder)}
                        disabled={printLoading === selectedOrder.id}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        {printLoading === selectedOrder.id ? '⏳' : '🖨️'} Print
                      </button>
                      <button
                        onClick={() => downloadOrderReceipt(selectedOrder)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        💾 Download
                      </button>
                    </div>
                  </div>

                  {/* Customer Details */}
                  {selectedOrder.customerName && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Customer Information</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">👤 {selectedOrder.customerName}</p>
                        {selectedOrder.customerEmail && <p className="text-gray-300">✉️ {selectedOrder.customerEmail}</p>}
                        {selectedOrder.customerPhone && <p className="text-gray-300">📞 {selectedOrder.customerPhone}</p>}
                      </div>
                    </div>
                  )}

                  {/* Delivery Details */}
                  {selectedOrder.orderType === 'DELIVERY' && selectedOrder.deliveryAddress && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Delivery Information</h3>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p>📍 {selectedOrder.deliveryAddress}</p>
                        <p>{selectedOrder.deliveryCity}, {selectedOrder.deliveryZip}</p>
                        {selectedOrder.deliveryInstructions && (
                          <p className="mt-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100">
                            💬 {selectedOrder.deliveryInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-white">
                              {item.menuItem ? item.menuItem.name : `Pizza #${index + 1}`}
                            </h5>
                            <span className="font-bold text-green-400">{formatCurrency(item.totalPrice)}</span>
                          </div>
                          
                          <div className="text-sm text-gray-300 space-y-1">
                            <p><span className="font-medium text-white">Quantity:</span> {item.quantity}</p>
                            
                            {/* Pizza Details */}
                            {item.pizzaSize && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <p><span className="font-medium text-white">Size:</span> {item.pizzaSize.name} ({item.pizzaSize.diameter})</p>
                                {item.pizzaCrust && <p><span className="font-medium text-white">Crust:</span> {item.pizzaCrust.name}</p>}
                                {item.pizzaSauce && <p><span className="font-medium text-white">Sauce:</span> {item.pizzaSauce.name}</p>}
                              </div>
                            )}

                            {/* Pizza Toppings */}
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="mt-2">
                                <span className="font-medium text-white">Toppings:</span>
                                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                                  {item.toppings.map((topping) => (
                                    <div key={topping.id} className="flex justify-between text-xs">
                                      <span className="text-gray-300">
                                        {topping.pizzaTopping?.name || 'Unknown Topping'} (x{topping.quantity})
                                      </span>
                                      <span className="text-green-400">{formatCurrency(topping.price)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Menu Item Customizations */}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="mt-2">
                                <span className="font-medium text-white">Customizations:</span>
                                <div className="mt-1 space-y-1">
                                  {item.customizations.map((customization) => (
                                    <div key={customization.id} className="flex justify-between text-xs">
                                      <span className="text-gray-300">
                                        {customization.name}: {customization.value}
                                      </span>
                                      {customization.price > 0 && (
                                        <span className="text-green-400">+{formatCurrency(customization.price)}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {item.notes && (
                              <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded text-xs">
                                <div className="font-medium text-blue-200 mb-1">Notes:</div>
                                <div className="text-blue-100 whitespace-pre-line">{item.notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="border-t border-white/10 pt-4">
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
                      <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2">
                        <span>Total:</span>
                        <span className="text-green-400">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {selectedOrder.notes && (
                    <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded text-sm">
                      <div className="font-medium text-yellow-200 mb-1">Order Notes:</div>
                      <div className="text-yellow-100 whitespace-pre-line">{selectedOrder.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Select an Order</h3>
                  <p className="text-gray-400">Click on an order from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminPageLayout>
    </AdminLayout>
  );
}
