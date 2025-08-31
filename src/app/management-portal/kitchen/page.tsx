'use client';

// Force dynamic rendering to avoid build-time prerender errors due to client-only APIs
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import { Clock, Printer, AlertCircle, Timer, Phone, MapPin, User, Maximize2, Minimize2 } from 'lucide-react';
import { KitchenConfig } from '@/lib/kitchen-config';

interface OrderItem {
  id: string;
  pizzaSize?: { name: string; diameter: number; } | null;
  pizzaCrust?: { name: string; } | null;
  pizzaSauce?: { name: string; } | null;
  quantity: number;
  totalPrice: number;
  notes?: string;
  // Pizza toppings (existing)
  toppings: Array<{
    pizzaTopping: { name: string; };
    quantity: number;
    section?: string;
    intensity?: string;
  }>;
  // Menu item information (NEW)
  menuItem?: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  } | null;
  // Menu item customizations (NEW - fixed field name)
  customizations: Array<{
    id: string;
    quantity: number;
    price: number;
    customizationOption: {
      id: string;
      name: string;
      group: {
        id: string;
        name: string;
      };
    };
  }>;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryInstructions?: string;
  scheduledTime?: string;
  total: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

const KitchenDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { show: showToast } = useToast();

  // Helper function to get menu item customizations from database relationships
  const getMenuItemCustomizations = (item: OrderItem) => {
    if (!item.customizations || item.customizations.length === 0) {
      return [];
    }

    // Group customizations by their group name
    const groupedCustomizations: { [groupName: string]: Array<{ name: string; quantity: number; price: number }> } = {};
    
    item.customizations.forEach(customization => {
      const groupName = customization.customizationOption.group.name;
      const optionName = customization.customizationOption.name;
      const quantity = customization.quantity || 1;
      const price = customization.price || 0;
      
      if (!groupedCustomizations[groupName]) {
        groupedCustomizations[groupName] = [];
      }
      
      groupedCustomizations[groupName].push({
        name: optionName,
        quantity,
        price
      });
    });

    // Convert to array format for display
    return Object.entries(groupedCustomizations).map(([groupName, options]) => ({
      groupName,
      options
    }));
  };

  // Helper function to parse menu item information from notes (FALLBACK ONLY)
  const parseMenuItemInfo = (notes: string) => {
    if (!notes) return null;
    
    // Extract item name and category: **Item Name** (category)
    const mainMatch = notes.match(/\*\*(.*?)\*\*\s*\((.*?)\)/);
    if (!mainMatch) return null;
    
    const itemName = mainMatch[1];
    const category = mainMatch[2];
    
    // Extract customizations (everything after the first |)
    const parts = notes.split(' | ');
    const rawCustomizations = parts.slice(1).filter(part => part.trim() !== '');
    
    // Clean up customizations - remove generic "Customization" entries and undefined values
    const cleanCustomizations = rawCustomizations
      .map(customization => {
        // Remove undefined values and empty entries
        const cleaned = customization
          .replace(/undefined: undefined/g, '')
          .replace(/\+\$[\d.]+/g, '') // Remove price modifiers for cleaner display
          .replace(/undefined/g, '')
          .replace(/,\s*,/g, ',') // Remove double commas
          .replace(/:\s*,/g, ':')  // Remove colons followed by commas
          .replace(/^\s*[:,]\s*|\s*[:,]\s*$/g, '') // Remove leading/trailing colons and commas
          .trim();
        
        // Filter out generic "Customization" entries and empty results
        if (cleaned === 'Customization' || cleaned === '' || cleaned.length < 2) {
          return null;
        }
        
        return cleaned;
      })
      .filter(Boolean); // Remove null/empty entries
    
    return {
      name: itemName,
      category: category,
      customizations: cleanCustomizations
    };
  };

  // Helper function to determine if an item is a pizza or menu item
  const isPizzaItem = (item: OrderItem) => {
    return item.pizzaSize && item.pizzaCrust && item.pizzaSauce;
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/management-portal/kitchen/orders', {
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Authentication required - please login as admin');
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = '/management-portal/login';
          }, 2000);
          setOrders([]);
          return;
        }
        if (response.status === 429) {
          console.log('Rate limited, will retry in 30 seconds...');
          setError('Rate limited - retrying in 30 seconds...');
          // Don't clear orders, just show the error temporarily
          setTimeout(() => {
            setError(null);
            fetchOrders(); // Retry after 30 seconds
          }, 30000);
          return;
        }
        if (response.status === 500) {
          const errorText = await response.text();
          if (errorText.includes('Unauthorized') || errorText.includes('Admin access required')) {
            setError('Admin authentication required - redirecting to login...');
            setTimeout(() => {
              window.location.href = '/management-portal/login';
            }, 2000);
          } else {
            setError('Server error - please try again');
          }
          setOrders([]);
          return;
        }
        setError(`Error ${response.status}: Unable to load orders`);
        setOrders([]);
        return;
      }
      
      const data = await response.json();
      
      // Handle various response formats
      if (Array.isArray(data)) {
        setOrders(data);
        setError(null);
      } else if (data && typeof data === 'object' && Array.isArray(data.orders)) {
        // In case API returns { orders: [...] }
        setOrders(data.orders);
        setError(null);
      } else {
        // API returned unexpected format, treat as no orders
        setOrders([]);
        setError(null);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error - please check your connection');
      } else {
        setError('Failed to load orders');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('/api/auth/admin', {
          credentials: 'include'
        });
        
        if (!authResponse.ok) {
          setError('Admin authentication required - redirecting to login...');
          setTimeout(() => {
            window.location.href = '/management-portal/login';
          }, 2000);
          return;
        }
        
        const authData = await authResponse.json();
        if (authData.role !== 'ADMIN') {
          setError('Admin access required - redirecting to login...');
          setTimeout(() => {
            window.location.href = '/management-portal/login';
          }, 2000);
          return;
        }
        
        // If authenticated, start fetching orders
        fetchOrders();
        
        // Set up dynamic polling interval
        const setupPolling = async () => {
          const pollingInterval = await KitchenConfig.getPollingInterval();
          console.log(`🔄 Kitchen display polling every ${pollingInterval/1000} seconds`);
          return setInterval(fetchOrders, pollingInterval);
        };
        
        setupPolling().then(interval => {
          return () => clearInterval(interval);
        });
        
        // Fallback cleanup
        return () => {};
        
      } catch (error) {
        setError('Network error - please check your connection');
      }
    };
    
    checkAuth();
  }, []);

  // Calculate elapsed time for each order
  const getElapsedTime = (orderTime: string) => {
    const elapsed = Math.floor((currentTime.getTime() - new Date(orderTime).getTime()) / 60000);
    return elapsed;
  };

  // Get urgency color based on elapsed time
  const getUrgencyColor = (orderTime: string) => {
    const elapsed = getElapsedTime(orderTime);
    
    if (elapsed >= 20) return 'text-red-400 bg-red-900/30';
    if (elapsed >= 15) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-green-400 bg-green-900/30';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-600';
      case 'confirmed': return 'bg-yellow-600';
      case 'preparing': return 'bg-orange-600';
      case 'ready': return 'bg-green-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/management-portal/kitchen/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders after updating
      fetchOrders();
    } catch (error) {
  showToast('Failed to update order status. Please try again.', { type: 'error' });
    }
  };

  // Print order
  const printOrder = (order: Order) => {
    const printContent = `
================================
        KITCHEN ORDER
================================
Order #: ${order.orderNumber}
Time: ${new Date(order.createdAt).toLocaleTimeString()}

Customer: ${order.customerName}
Phone: ${order.customerPhone || 'N/A'}
Type: ${order.orderType.toUpperCase()}
${order.deliveryAddress ? `Address: ${order.deliveryAddress}, ${order.deliveryCity} ${order.deliveryZip}` : ''}

--------------------------------
ITEMS:
--------------------------------
${(order.items || []).map(item => {
  if (isPizzaItem(item)) {
    // Pizza item formatting
    return `${item.quantity}x ${item.pizzaSize?.name || 'Unknown'}" ${item.pizzaCrust?.name || 'Unknown'}\n   Sauce: ${item.pizzaSauce?.name || 'Unknown'}${(item.toppings || []).length > 0 ? `\n   Toppings: ${(item.toppings || []).map(t => `${t.quantity}x ${t.pizzaTopping?.name || 'Unknown'} (${t.section || 'WHOLE'}, ${(t.intensity || 'REGULAR').toLowerCase()})`).join(', ')}` : ''}${item.notes ? `\n   *${item.notes}` : ''}\n   Price: $${item.totalPrice?.toFixed(2) || '0.00'}`;
  } else {
    // Menu item formatting
    if (item.menuItem) {
      // Use database data (preferred)
      const customizations = getMenuItemCustomizations(item);
      let customizationText = '';
      
      if (customizations.length > 0) {
        customizationText = customizations.map(group => {
          const options = group.options.map(option => {
            let optionText = option.name;
            if (option.quantity > 1) optionText = `${option.quantity}x ${optionText}`;
            if (option.price !== 0) optionText += ` (+$${option.price.toFixed(2)})`;
            return optionText;
          }).join(', ');
          return `${group.groupName}: ${options}`;
        }).join('\n   ');
      }
      
      return `${item.quantity}x ${item.menuItem.name} (${item.menuItem.category.name})${customizationText ? `\n   Customizations: ${customizationText}` : ''}\n   Price: $${item.totalPrice?.toFixed(2) || '0.00'}`;
    } else {
      // Fallback to notes parsing (legacy)
      const menuInfo = parseMenuItemInfo(item.notes || '');
      if (menuInfo) {
        return `${item.quantity}x ${menuInfo.name} (${menuInfo.category})${menuInfo.customizations.length > 0 ? `\n   Customizations: ${menuInfo.customizations.join(', ')}` : ''}\n   Price: $${item.totalPrice?.toFixed(2) || '0.00'}`;
      } else {
        return `${item.quantity}x Menu Item\n   Details: ${item.notes || 'No details'}\n   Price: $${item.totalPrice?.toFixed(2) || '0.00'}`;
      }
    }
  }
}).join('\n\n')}

--------------------------------
${order.notes ? `ORDER NOTES:\n${order.notes}\n--------------------------------\n` : ''}${order.deliveryInstructions ? `DELIVERY INSTRUCTIONS:\n${order.deliveryInstructions}\n--------------------------------\n` : ''}
Total: $${order.total.toFixed(2)}
Status: ${order.status.toUpperCase()}

================================
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow!.document.write(`
      <html>
        <head>
          <title>Kitchen Order ${order.orderNumber}</title>
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
    printWindow!.document.close();
    printWindow!.print();
  };

  // Get status counts
  const getStatusCounts = () => {
    if (!Array.isArray(orders)) {
      return {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        ready: 0,
        total: 0
      };
    }
    
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
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
      // Silently handle fullscreen errors (user may have denied permission)
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading kitchen orders...</p>
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden text-white p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Kitchen Display System
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded transition-colors shadow-lg"
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
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <div className="text-blue-200">Pending</div>
          </div>
          <div className="bg-yellow-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.confirmed}</div>
            <div className="text-yellow-200">Confirmed</div>
          </div>
          <div className="bg-orange-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.preparing}</div>
            <div className="text-orange-200">Preparing</div>
          </div>
          <div className="bg-green-800/90 backdrop-blur-sm p-4 rounded-lg text-center shadow-xl">
            <div className="text-2xl font-bold">{statusCounts.ready}</div>
            <div className="text-green-200">Ready</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <div className="text-gray-200">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Orders Grid - Full Width */}
      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(orders) && orders.map(order => (
            <div
              key={order.id}
              className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 transition-all duration-200 border-l-4 border-gray-600 shadow-xl`}
            >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white">#{order.orderNumber}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-400" />
                    <span className="font-semibold">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    {order.orderType === 'pickup' ? (
                      <MapPin size={16} className="text-gray-400" />
                    ) : (
                      <Phone size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm">{order.orderType === 'pickup' ? 'Pickup' : `Delivery - ${order.deliveryAddress}`}</span>
                  </div>
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 mb-4 p-2 rounded ${getUrgencyColor(order.createdAt)}`}>
                  <Timer size={16} />
                  <span className="font-mono font-bold">
                    {getElapsedTime(order.createdAt)}m elapsed
                  </span>
                </div>

                {/* Complete Items Details */}
                <div className="mb-4">
                  <div className="text-sm text-gray-300 mb-3 font-semibold">{(order.items || []).length} items • ${order.total?.toFixed(2) || '0.00'}</div>
                  <div className="space-y-3">
                    {(order.items || []).map((item, idx) => {
                      const isPizza = isPizzaItem(item);
                      const menuInfo = isPizza ? null : parseMenuItemInfo(item.notes || '');
                      
                      return (
                        <div key={idx} className={`p-3 rounded border-l-4 ${isPizza ? 'bg-gray-700/50 border-blue-500' : 'bg-purple-700/30 border-purple-500'}`}>
                          {isPizza ? (
                            // Pizza Item Display
                            <>
                              {/* Pizza Base Info */}
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-semibold text-white">
                                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2">
                                    {item?.quantity || 0}x
                                  </span>
                                  {item?.pizzaSize?.name || 'Unknown'}" {item?.pizzaCrust?.name || 'Unknown'}
                                </div>
                                <div className="text-green-400 font-semibold">${(item?.totalPrice || 0).toFixed(2)}</div>
                              </div>
                              
                              {/* Sauce */}
                              <div className="text-sm mb-2">
                                <span className="text-orange-400 font-medium">Sauce:</span> {item?.pizzaSauce?.name || 'Unknown'}
                              </div>
                              
                              {/* Toppings */}
                              {item?.toppings && item.toppings.length > 0 && (
                                <div className="text-sm mb-2">
                                  <div className="text-yellow-400 font-medium mb-1">Toppings:</div>
                                  <div className="space-y-1 ml-2">
                                    {item.toppings.map((topping, tIdx) => (
                                      <div key={tIdx} className="flex justify-between items-center">
                                        <span className="text-gray-300">
                                          {topping.pizzaTopping?.name || 'Unknown'} 
                                          <span className="text-blue-400 ml-1">({topping.quantity || 1}x)</span>
                                        </span>
                                        <div className="flex gap-2 text-xs">
                                          <span className={`px-2 py-1 rounded ${
                                            topping.section === 'WHOLE' ? 'bg-green-600' :
                                            topping.section === 'LEFT' ? 'bg-blue-600' :
                                            topping.section === 'RIGHT' ? 'bg-purple-600' : 'bg-gray-600'
                                          }`}>
                                            {topping.section === 'WHOLE' ? 'Whole' :
                                             topping.section === 'LEFT' ? 'Left' :
                                             topping.section === 'RIGHT' ? 'Right' : 'Whole'}
                                          </span>
                                          <span className={`px-2 py-1 rounded ${
                                            topping.intensity === 'LIGHT' ? 'bg-yellow-600' :
                                            topping.intensity === 'EXTRA' ? 'bg-red-600' : 'bg-orange-600'
                                          }`}>
                                            {topping.intensity === 'LIGHT' ? 'Light' :
                                             topping.intensity === 'EXTRA' ? 'Extra' : 'Regular'}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Pizza Notes */}
                              {item?.notes && (
                                <div className="bg-blue-900/40 border border-blue-600 p-2 rounded mt-2">
                                  <span className="text-blue-400 font-medium text-xs">Pizza Details:</span>
                                  <div className="text-blue-300 text-sm mt-1 whitespace-pre-line">{item.notes}</div>
                                </div>
                              )}
                            </>
                          ) : (
                            // Menu Item Display
                            <>
                              {/* Menu Item Header */}
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-semibold text-white">
                                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs mr-2">
                                    {item?.quantity || 0}x
                                  </span>
                                  {item?.menuItem ? item.menuItem.name : 'Menu Item'}
                                </div>
                                <div className="text-green-400 font-semibold">${(item?.totalPrice || 0).toFixed(2)}</div>
                              </div>
                              
                              {/* Category */}
                              {item?.menuItem && (
                                <div className="text-sm mb-2">
                                  <span className="text-purple-400 font-medium">Category:</span> 
                                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs ml-2">
                                    {item.menuItem.category.name}
                                  </span>
                                </div>
                              )}
                              
                              {/* Customizations from Database */}
                              {(() => {
                                const customizations = getMenuItemCustomizations(item);
                                return customizations.length > 0 && (
                                  <div className="text-sm mb-2">
                                    <div className="text-yellow-400 font-medium mb-1">Customizations:</div>
                                    <div className="space-y-2 ml-2">
                                      {customizations.map((group, gIdx) => (
                                        <div key={gIdx} className="bg-purple-800/50 rounded p-2">
                                          <div className="text-purple-300 font-medium text-xs mb-1">{group.groupName}:</div>
                                          <div className="space-y-1">
                                            {group.options.map((option, oIdx) => (
                                              <div key={oIdx} className="flex justify-between items-center">
                                                <span className="text-gray-300 text-sm">
                                                  {option.quantity > 1 && <span className="text-blue-400">({option.quantity}x) </span>}
                                                  {option.name}
                                                </span>
                                                {option.price !== 0 && (
                                                  <span className="text-green-400 text-xs">
                                                    {option.price > 0 ? '+' : ''}${option.price.toFixed(2)}
                                                  </span>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}
                              
                              {/* Fallback to parsing notes if no database customizations */}
                              {(() => {
                                const customizations = getMenuItemCustomizations(item);
                                const menuInfo = parseMenuItemInfo(item.notes || '');
                                
                                // Only show parsed customizations if no database customizations exist
                                return customizations.length === 0 && menuInfo && menuInfo.customizations.length > 0 && (
                                  <div className="text-sm mb-2">
                                    <div className="text-yellow-400 font-medium mb-1">Customizations (from notes):</div>
                                    <div className="space-y-1 ml-2">
                                      {menuInfo.customizations.map((customization, cIdx) => (
                                        <div key={cIdx} className="text-gray-300 text-sm">
                                          • {customization}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}
                              
                              {/* Show default message if no customizations */}
                              {(() => {
                                const customizations = getMenuItemCustomizations(item);
                                const menuInfo = parseMenuItemInfo(item.notes || '');
                                
                                return customizations.length === 0 && (!menuInfo || menuInfo.customizations.length === 0) && (
                                  <div className="text-sm mb-2">
                                    <div className="text-gray-400 font-medium">Standard preparation</div>
                                  </div>
                                );
                              })()}
                              
                              {/* Menu Item Notes (if any additional info) */}
                              {item?.notes && !parseMenuItemInfo(item.notes) && (
                                <div className="bg-purple-900/40 border border-purple-600 p-2 rounded mt-2">
                                  <span className="text-purple-400 font-medium text-xs">Item Details:</span>
                                  <div className="text-purple-300 text-sm mt-1 whitespace-pre-line">{item.notes}</div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Special Instructions */}
                {(order.notes || order.deliveryInstructions) && (
                  <div className="bg-yellow-900/30 border border-yellow-600 p-2 rounded mb-4">
                    <div className="text-yellow-400 font-semibold text-sm mb-1">Special Instructions:</div>
                    <div className="text-sm">{order.notes || order.deliveryInstructions}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
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
                  {order.status !== 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextStatus = {
                          'pending': 'confirmed',
                          'confirmed': 'preparing',
                          'preparing': 'ready',
                          'ready': 'completed'
                        } as const;
                        updateOrderStatus(order.id, nextStatus[order.status as keyof typeof nextStatus]);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm transition-colors"
                    >
                      {order.status === 'pending' && 'Confirm Order'}
                      {order.status === 'confirmed' && 'Start Preparing'}
                      {order.status === 'preparing' && 'Mark Ready'}
                      {order.status === 'ready' && 'Complete'}
                    </button>
                  )}
                </div>
              </div>
          ))}
        </div>
        
        {!Array.isArray(orders) || orders.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-xl mb-2">No Active Orders</h3>
            <p>Kitchen is clear! Ready for new orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
