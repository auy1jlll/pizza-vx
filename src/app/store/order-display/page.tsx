'use client';

// Force dynamic rendering to avoid build-time prerender errors due to client-only APIs
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Clock, Printer, User, Phone, MapPin, Calendar, DollarSign, Package, Maximize2, Minimize2 } from 'lucide-react';

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

export default function StoreOrderDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchOrders();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/store/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
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

  // Print order
  const printOrder = (order: Order) => {
    const printContent = `
================================
         ORDER RECEIPT
================================
Order #: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Time: ${new Date(order.createdAt).toLocaleTimeString()}

Customer: ${order.customerName || 'N/A'}
Email: ${order.customerEmail || 'N/A'}
Phone: ${order.customerPhone || 'N/A'}

Order Type: ${order.orderType}
${order.deliveryAddress ? `
Delivery Address:
${order.deliveryAddress}
${order.deliveryCity}, ${order.deliveryZip}
` : ''}

Status: ${order.status}

--------------------------------
ITEMS:
--------------------------------
${(order.orderItems || []).map(item => {
  const itemName = getItemDisplayName(item);
  const toppings = item.toppings?.map(t => `${t.quantity}x ${t.pizzaTopping.name}`).join(', ') || '';
  const customizations = item.customizations?.map(c => `${c.name}: ${c.value}`).join(', ') || '';
  
  return `${item.quantity}x ${itemName}
   ${toppings ? `Toppings: ${toppings}` : ''}
   ${customizations ? `Customizations: ${customizations}` : ''}
   ${item.notes ? `Notes: ${item.notes}` : ''}
   Price: ${formatCurrency(item.totalPrice)}`;
}).join('\n\n')}

--------------------------------
TOTALS:
--------------------------------
Subtotal: ${formatCurrency(order.subtotal)}
Delivery Fee: ${formatCurrency(order.deliveryFee)}
Tax: ${formatCurrency(order.tax)}
TOTAL: ${formatCurrency(order.total)}

${order.notes ? `
Order Notes:
${order.notes}
` : ''}${order.deliveryInstructions ? `
Delivery Instructions:
${order.deliveryInstructions}
` : ''}
================================
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.orderNumber}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                line-height: 1.4;
                margin: 20px;
                background: white;
                color: black;
              }
              pre { margin: 0; }
            </style>
          </head>
          <body>
            <pre>${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Get status counts
  const getStatusCounts = () => {
    if (!Array.isArray(orders)) {
      return {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        ready: 0,
        completed: 0,
        total: 0
      };
    }
    
    return {
      pending: orders.filter(o => o.status === 'PENDING').length,
      confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
      preparing: orders.filter(o => o.status === 'PREPARING').length,
      ready: orders.filter(o => o.status === 'READY').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      total: orders.length
    };
  };

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      // Silently handle fullscreen errors
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-enter fullscreen on page load
  useEffect(() => {
    const autoFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        // User denied fullscreen permission
      }
    };
    
    // Delay to ensure page is fully loaded
    setTimeout(autoFullscreen, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 overflow-x-hidden text-white p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              📋 Order Display - Store View
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 py-2 rounded transition-colors shadow-lg"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <div className="flex items-center gap-2 text-3xl font-mono bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-xl">
              <Clock size={32} />
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Status Overview */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-yellow-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <div className="text-yellow-200">Pending</div>
          </div>
          <div className="bg-blue-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.confirmed}</div>
            <div className="text-blue-200">Confirmed</div>
          </div>
          <div className="bg-orange-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.preparing}</div>
            <div className="text-orange-200">Preparing</div>
          </div>
          <div className="bg-green-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.ready}</div>
            <div className="text-green-200">Ready</div>
          </div>
          <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.completed}</div>
            <div className="text-gray-200">Completed</div>
          </div>
          <div className="bg-purple-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <div className="text-purple-200">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(orders) && orders.map(order => (
            <div
              key={order.id}
              className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 transition-all duration-200 border-l-4 border-gray-600 shadow-xl hover:shadow-2xl cursor-pointer"
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">#{order.orderNumber}</span>
                  <span className="text-2xl">{getOrderTypeIcon(order.orderType)}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[order.status as keyof typeof statusColors] || statusColors.PENDING}`}>
                  <span className="mr-1">{statusIcons[order.status as keyof typeof statusIcons] || statusIcons.PENDING}</span>
                  {order.status}
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-semibold">{order.customerName || 'Guest Customer'}</span>
                </div>
                
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{order.customerPhone}</span>
                  </div>
                )}
                
                {order.deliveryAddress && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm">{order.deliveryAddress}, {order.deliveryCity}</span>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Package size={16} className="text-gray-400" />
                  <span className="text-sm">{order.orderItems?.length || 0} items</span>
                </div>
                
                <div className="flex items-center gap-2 text-green-400">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm">{getTimeElapsed(order.createdAt)}</span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Items:</div>
                <div className="space-y-1">
                  {(order.orderItems || []).slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-300 flex justify-between">
                      <span>{item.quantity}x {getItemDisplayName(item)}</span>
                      <span className="text-green-400">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                  {(order.orderItems || []).length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{(order.orderItems || []).length - 3} more items...
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder?.id === order.id && (
                <div className="border-t border-gray-600 pt-4 mt-4">
                  <div className="space-y-4">
                    {/* Complete Items List */}
                    <div>
                      <div className="text-sm font-semibold text-white mb-2">Complete Order Details:</div>
                      <div className="space-y-3">
                        {(order.orderItems || []).map((item, idx) => (
                          <div key={idx} className="bg-gray-700/50 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">
                                {item.quantity}x {getItemDisplayName(item)}
                              </div>
                              <div className="text-green-400 font-semibold">
                                {formatCurrency(item.totalPrice)}
                              </div>
                            </div>
                            
                            {/* Pizza Details */}
                            {item.pizzaSize && item.pizzaCrust && item.pizzaSauce && (
                              <div className="text-sm text-gray-300 mb-2">
                                <div>Size: {item.pizzaSize.name} ({item.pizzaSize.diameter})</div>
                                <div>Crust: {item.pizzaCrust.name}</div>
                                <div>Sauce: {item.pizzaSauce.name}</div>
                              </div>
                            )}
                            
                            {/* Toppings */}
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="text-sm text-gray-300 mb-2">
                                <div className="font-medium text-yellow-400 mb-1">Toppings:</div>
                                {item.toppings.map((topping, tIdx) => (
                                  <div key={tIdx} className="ml-2">
                                    • {topping.quantity}x {topping.pizzaTopping.name}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Customizations */}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="text-sm text-gray-300 mb-2">
                                <div className="font-medium text-blue-400 mb-1">Customizations:</div>
                                {item.customizations.map((customization, cIdx) => (
                                  <div key={cIdx} className="ml-2">
                                    • {customization.name}: {customization.value}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Item Notes */}
                            {item.notes && (
                              <div className="text-sm text-gray-400 italic">
                                Note: {item.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Totals */}
                    <div className="bg-gray-700/50 rounded p-3">
                      <div className="text-sm font-semibold text-white mb-2">Order Totals:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="flex justify-between text-gray-300">
                            <span>Delivery Fee:</span>
                            <span>{formatCurrency(order.deliveryFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-300">
                          <span>Tax:</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-white font-semibold text-lg border-t border-gray-600 pt-2">
                          <span>Total:</span>
                          <span className="text-green-400">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Special Notes */}
                    {(order.notes || order.deliveryInstructions) && (
                      <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3">
                        <div className="text-yellow-400 font-semibold text-sm mb-2">Special Notes:</div>
                        {order.notes && (
                          <div className="text-sm text-yellow-200 mb-2">
                            <strong>Order Notes:</strong> {order.notes}
                          </div>
                        )}
                        {order.deliveryInstructions && (
                          <div className="text-sm text-yellow-200">
                            <strong>Delivery Instructions:</strong> {order.deliveryInstructions}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    printOrder(order);
                  }}
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
                  }}
                  className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm transition-colors"
                >
                  {selectedOrder?.id === order.id ? 'Collapse' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {!Array.isArray(orders) || orders.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl mb-2">No Orders Found</h3>
            <p>No orders to display at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
