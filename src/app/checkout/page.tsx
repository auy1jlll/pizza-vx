'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { useCart } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, CreditCard, Truck, User, MapPin, Phone, Mail } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems: pizzaItems, calculateSubtotal: calculatePizzaSubtotal, clearCart } = useCart();
  const { settings, getTaxAmount } = useSettings();
  const { settings: appSettings } = useAppSettingsContext();
  const { user } = useUser();
  const { show: showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [allCartItems, setAllCartItems] = useState<any[]>([]);
  const [currentPrices, setCurrentPrices] = useState<any>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });
  const [orderType, setOrderType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');

  // Check if guest checkout is allowed and user is not logged in
  const showGuestCheckout = appSettings.enable_guest_checkout && !user;
  
  // Check if delivery is enabled from app settings
  const isDeliveryEnabled = appSettings.deliveryEnabled === true;

  // Set default order type based on delivery availability
  useEffect(() => {
    if (isDeliveryEnabled) {
      setOrderType('DELIVERY');
    } else {
      setOrderType('PICKUP');
    }
  }, [isDeliveryEnabled]);

  // Load both pizza and menu items
  useEffect(() => {
    const loadCartAndRefreshPrices = async () => {
      try {
        // Load menu cart from localStorage
        const savedMenuCart = localStorage.getItem('menuCart');
        const loadedMenuItems = savedMenuCart ? JSON.parse(savedMenuCart) : [];
        setMenuItems(loadedMenuItems);
        
        // Combine both types of items for display
        const combined = [...pizzaItems, ...loadedMenuItems];
        setAllCartItems(combined);

        // Refresh prices using the same API as cart page
        const cartData = {
          pizzaItems: pizzaItems,
          menuItems: loadedMenuItems
        };

        const response = await fetch('/api/cart/refresh-prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartData)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setCurrentPrices(result.data);
          }
        }
      } catch (error) {
        console.error('Error loading cart and refreshing prices:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCartAndRefreshPrices();
  }, [pizzaItems]);

  // Calculate menu subtotal with current prices AND customizations (FIXED)
  const calculateMenuSubtotal = () => {
    return menuItems.reduce((total, item) => {
      // Start with base price (prefer fresh price from API if available)
      const currentPrice = currentPrices?.menuItems?.find((p: any) => p.id === item.id);
      let basePrice = currentPrice ? currentPrice.currentPrice : (item.price || item.totalPrice || 0);
      
      // Add customization prices
      let customizationTotal = 0;
      if (item.customizations && Array.isArray(item.customizations)) {
        item.customizations.forEach((customGroup: any) => {
          if (typeof customGroup === 'object' && customGroup !== null) {
            // Handle grouped customizations with selections
            if (customGroup.selections && Array.isArray(customGroup.selections)) {
              customGroup.selections.forEach((selection: any) => {
                if (selection.price && !isNaN(selection.price)) {
                  const quantity = selection.quantity || 1;
                  customizationTotal += selection.price * quantity;
                }
              });
            }
            // Handle direct customization prices
            else if (customGroup.price && !isNaN(customGroup.price)) {
              const quantity = customGroup.quantity || 1;
              customizationTotal += customGroup.price * quantity;
            }
          }
        });
      }
      
      const totalItemPrice = basePrice + customizationTotal;
      return total + (totalItemPrice * item.quantity);
    }, 0);
  };

  const calculateSubtotal = () => {
    const pizzaSubtotal = calculatePizzaSubtotal();
    const menuSubtotal = calculateMenuSubtotal();
    return pizzaSubtotal + menuSubtotal;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = getTaxAmount(subtotal);
    const deliveryFee = (subtotal > 0 && orderType === 'DELIVERY') ? 3.99 : 0;
    return subtotal + tax + deliveryFee;
  };

  // Helper function to get proper item name (especially for pizzas)
  const getItemDisplayName = (item: any) => {
    // For menu items, use the name or menuItemName
    if (item.name || item.menuItemName) {
      return item.name || item.menuItemName;
    }
    
    // For pizza items, check if it's a specialty pizza first
    if (item.specialtyPizzaName) {
      return `${item.specialtyPizzaName} (${item.size?.name || 'Custom'})`;
    }
    
    // For regular pizza items, construct name from size
    if (item.size) {
      return `${item.size.name || 'Custom'} Pizza`;
    }
    
    // Fallback
    return 'Custom Item';
  };

  // Redirect if cart is empty (but only after initial loading is complete and not during order success)
  useEffect(() => {
    if (!initialLoading && !orderSuccess && allCartItems.length === 0) {
      router.push('/cart');
    }
  }, [allCartItems, router, initialLoading, orderSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || orderSuccess) return;
    setLoading(true);
    
    try {
      // Format items properly for API validation
      const formattedItems = await Promise.all(allCartItems.map(async (item: any) => {
        if (item.type === 'menu' || item.menuItemId) {
          // Fetch customization options to map names to IDs
          let transformedCustomizations: any[] = [];
          
          if (item.customizations && Array.isArray(item.customizations)) {
            try {
              // Get all customization options for mapping
              const optionsResponse = await fetch('/api/menu/customization-options');
              const optionsData = await optionsResponse.json();
              
              if (optionsData.success && optionsData.data) {
                // Create a mapping from option names to IDs
                const optionNameToId: Record<string, string> = {};
                optionsData.data.forEach((option: any) => {
                  optionNameToId[option.name.toLowerCase()] = option.id;
                });

                // Transform customizations from frontend format to backend format
                transformedCustomizations = item.customizations.flatMap((group: any) => {
                  if (group.selections && Array.isArray(group.selections)) {
                    return group.selections.map((selection: any) => {
                      const optionId = optionNameToId[selection.optionName?.toLowerCase()] || 
                                      `${group.groupName}-${selection.optionName}`.replace(/\s+/g, '-').toLowerCase();
                      
                      return {
                        optionId: optionId,
                        name: selection.optionName,
                        quantity: 1,
                        priceModifier: selection.price || 0
                      };
                    });
                  }
                  return [];
                });
              }
            } catch (error) {
              console.error('Error fetching customization options:', error);
              // Fallback to synthetic IDs if API fails
              transformedCustomizations = item.customizations.flatMap((group: any) => {
                if (group.selections && Array.isArray(group.selections)) {
                  return group.selections.map((selection: any) => ({
                    optionId: `${group.groupName}-${selection.optionName}`.replace(/\s+/g, '-').toLowerCase(),
                    name: selection.optionName,
                    quantity: 1,
                    priceModifier: selection.price || 0
                  }));
                }
                return [];
              });
            }
          }

          // Format menu item for API
          return {
            type: 'menu',
            id: item.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity || 1,
            basePrice: item.basePrice || item.price || item.totalPrice || 0,
            totalPrice: item.totalPrice || item.price || item.basePrice || 0,
            customizations: transformedCustomizations,
            name: item.menuItemName || item.name,
            category: item.categorySlug || item.category
          };
        } else {
          // Format pizza item for API
          return {
            type: 'pizza',
            id: item.id,
            quantity: item.quantity || 1,
            basePrice: item.basePrice || 0,
            totalPrice: item.totalPrice || 0,
            size: item.size,
            crust: item.crust,
            sauce: item.sauce,
            toppings: item.toppings || [],
            notes: item.notes
          };
        }
      }));

      // Prepare order data in the format expected by the API
      const orderData = {
        orderType: orderType,
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: orderType === 'DELIVERY' ? customerInfo.address : '',
          city: orderType === 'DELIVERY' ? customerInfo.city : '',
          zip: orderType === 'DELIVERY' ? customerInfo.zip : ''
        },
        delivery: orderType === 'DELIVERY' ? {
          address: customerInfo.address,
          city: customerInfo.city,
          zip: customerInfo.zip,
          instructions: ''
        } : null,
        items: formattedItems, // Use properly formatted items
        subtotal: calculateSubtotal(),
        deliveryFee: orderType === 'DELIVERY' ? 3.99 : 0,
        tax: getTaxAmount(calculateSubtotal()),
        total: calculateTotal()
      };

      console.log('🛒 Submitting order data:', orderData);
      console.log('📦 Formatted items:', formattedItems);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('Checkout response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Checkout success result:', result);
        
        const orderId = result.data?.orderId || result.orderId;
        if (!orderId) {
          throw new Error('Missing orderId in response');
        }

        // Set success state first
        setOrderSuccess(true);
        setNewOrderId(orderId);
        
        showToast('Order placed successfully! 🎉', { type: 'success' });
        
        // Clear all cart data immediately
        clearCart(); // Clears pizza cart
        setMenuItems([]); // Clear menu items state
        
        // Clear all localStorage cart data
        localStorage.removeItem('menuCart');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cart');
        
        // Try navigation
        console.log('Redirecting to order page:', `/order/${orderId}`);
        router.push(`/order/${orderId}`);
        
      } else {
        const error = await response.json();
        console.error('Checkout error response:', error);
        showToast(`Order failed: ${error.message || 'Please try again'}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Checkout network error:', error);
      showToast('Network error placing order. Please try again.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const tax = getTaxAmount(subtotal);
  const deliveryFee = (orderType === 'DELIVERY') ? 3.99 : 0;
  const total = calculateTotal();

  if (allCartItems.length === 0) {
    return null; // Will redirect
  }

  // Inline confirmation fallback if navigation fails
  if (orderSuccess && newOrderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center space-y-6">
          <div className="text-emerald-600 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-emerald-700">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">
            Your order has been confirmed. Order ID: <span className="font-semibold text-emerald-600">{newOrderId}</span>
          </p>
          <p className="text-sm text-gray-500">
            If you were not redirected automatically, use the button below to view your order.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a
              href={`/order/${newOrderId}`}
              className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-md"
            >
              View Order Details
            </a>
            <a
              href="/"
              className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cart')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cart</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            </div>
            <div className="text-sm text-gray-500">
              Step 2 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Order Type Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Order Type</h2>
                </div>

                <div className={`grid grid-cols-1 ${isDeliveryEnabled ? 'md:grid-cols-2' : ''} gap-4`}>
                  {/* Delivery Option - Only show if delivery is enabled */}
                  {isDeliveryEnabled && (
                    <label className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      orderType === 'DELIVERY' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="orderType"
                        value="DELIVERY"
                        checked={orderType === 'DELIVERY'}
                        onChange={(e) => setOrderType(e.target.value as 'DELIVERY')}
                        className="w-4 h-4 text-green-600"
                      />
                      <div className="flex items-center space-x-2">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Delivery</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-auto">$3.99</span>
                    </label>
                  )}

                  {/* Pickup Option - Always available */}
                  <label className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    orderType === 'PICKUP' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="PICKUP"
                      checked={orderType === 'PICKUP'}
                      onChange={(e) => setOrderType(e.target.value as 'PICKUP')}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Pickup</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-auto">Free</span>
                  </label>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information - Only show for delivery orders */}
              {orderType === 'DELIVERY' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
                  </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        required
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        required
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zip"
                        required
                        value={customerInfo.zip}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Place Order Button */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Payment</h2>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Payment will be collected upon delivery. Cash or card accepted.
                  </p>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Placing Order...</span>
                      </div>
                    ) : (
                      `Place Order • $${total.toFixed(2)}`
                    )}
                  </button>

                  <p className="text-xs text-gray-500 mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {allCartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {/* Use helper function for proper naming */}
                        {getItemDisplayName(item)}
                      </h3>
                      
                      {/* Pizza-specific details */}
                      {item.size && (
                        <p className="text-sm text-gray-500">Size: {item.size.name}</p>
                      )}
                      {item.crust && (
                        <p className="text-sm text-gray-500">Crust: {item.crust.name}</p>
                      )}
                      {item.sauce && (
                        <p className="text-sm text-gray-500">Sauce: {item.sauce.name}</p>
                      )}
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="text-sm text-gray-500">
                          <p>Toppings: {item.toppings.map((t: any) => {
                            let toppingText = t.name;
                            if (t.section && t.section !== 'WHOLE') {
                              toppingText += ` (${t.section === 'LEFT' ? 'Left' : 'Right'})`;
                            }
                            if (t.intensity && t.intensity !== 'REGULAR') {
                              toppingText += ` ${t.intensity === 'LIGHT' ? 'Light' : 'Extra'}`;
                            }
                            return toppingText;
                          }).join(', ')}</p>
                        </div>
                      )}
                      
                      {/* Menu item customizations - detailed display like cart page */}
                      {(item as any).customizations && (item as any).customizations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 mb-1">Customizations:</p>
                          <div className="flex flex-wrap gap-1">
                            {(item as any).customizations.map((customGroup: any, idx: number) => {
                              if (typeof customGroup === 'string') {
                                return (
                                  <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                                    {customGroup}
                                  </span>
                                );
                              } else if (customGroup.groupName && customGroup.selections) {
                                return customGroup.selections.map((selection: any, selIdx: number) => (
                                  <span key={`${idx}-${selIdx}`} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                                    {customGroup.groupName}: {selection.optionName}
                                    {selection.quantity > 1 && ` (${selection.quantity}x)`}
                                    {selection.price > 0 && ` (+$${selection.price.toFixed(2)})`}
                                  </span>
                                ));
                              } else {
                                return (
                                  <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                                    {customGroup.optionName || customGroup.name || 'Unknown'}
                                    {(customGroup.quantity && customGroup.quantity > 1) && ` (${customGroup.quantity}x)`}
                                    {customGroup.price && customGroup.price > 0 && ` (+$${customGroup.price.toFixed(2)})`}
                                  </span>
                                );
                              }
                            })}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        ${(((item as any).finalPrice || item.totalPrice || (item as any).price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>{orderType === 'DELIVERY' ? 'Delivery Fee' : 'Pickup'}</span>
                  <span>{orderType === 'DELIVERY' ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({settings.taxRate}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <Truck className="w-5 h-5" />
                  <span className="font-medium">Estimated Delivery</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  30-45 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
