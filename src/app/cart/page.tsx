'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

interface MenuCartCustomization {
  groupName?: string;
  optionName?: string;
  name?: string;
  quantity?: number;
  price?: number;
  selections?: Array<{
    optionName: string;
    quantity: number;
    price: number;
  }>;
}

interface MenuCartItem {
  id: string;
  name: string;
  menuItemName?: string;
  price: number;
  totalPrice?: number;
  quantity: number;
  customizations?: MenuCartCustomization[];
  category?: string;
  image?: string;
  currentPrice?: number;
}

interface PizzaCartItem {
  id: string;
  size?: { name: string; price: number };
  crust?: { name: string; price: number };
  sauce?: { name: string; price: number };
  toppings?: Array<{ name: string; price: number }>;
  quantity: number;
  totalPrice: number;
  currentPrice?: { totalPrice: number };
  notes?: string;
}

interface CurrentPrices {
  pizzaItems?: Array<{ id: string; currentPrice: { totalPrice: number } }>;
  menuItems?: Array<{ id: string; currentPrice: number }>;
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems: pizzaItems, removePizza, updatePizzaQuantity } = useCart();
  const { settings, getTaxAmount } = useSettings();
  const [menuItems, setMenuItems] = useState<MenuCartItem[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState<CurrentPrices | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load menu cart items from localStorage
  useEffect(() => {
    const savedMenuCart = localStorage.getItem('menuCart');
    if (savedMenuCart) {
      try {
        const parsedItems = JSON.parse(savedMenuCart);
        setMenuItems(parsedItems);
        console.log('Loaded menu items from localStorage:', parsedItems);
      } catch (e) {
        console.error('Failed to parse menu cart', e);
        setError('Failed to load your cart items');
      }
    }
  }, []);

  // Refresh prices when cart items change
  useEffect(() => {
    const refreshPrices = async () => {
      if (pizzaItems.length === 0 && menuItems.length === 0) {
        setPricesLoading(false);
        return;
      }

      try {
        setPricesLoading(true);
        setError(null);
        console.log('Starting price refresh...');

        const response = await fetch('/api/cart/refresh-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pizzaItems, menuItems })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Unknown error');

        console.log('Price refresh successful:', result.data);
        setCurrentPrices(result.data);
      } catch (err) {
        console.error('Price refresh error:', err);
        setError('Could not refresh prices. Using stored prices instead.');
      } finally {
        setPricesLoading(false);
      }
    };

    const timer = setTimeout(refreshPrices, 100);
    return () => clearTimeout(timer);
  }, [pizzaItems, menuItems]);

  const saveMenuCart = useCallback((items: MenuCartItem[]) => {
    try {
      localStorage.setItem('menuCart', JSON.stringify(items));
      setMenuItems(items);
      window.dispatchEvent(new Event('menuCartUpdated'));
      console.log('Saved menu items:', items);
    } catch (error) {
      console.error('Error saving menu cart:', error);
      setError('Failed to update your cart');
    }
  }, []);

  const updateMenuItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeMenuItem(id);
      return;
    }
    
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    saveMenuCart(updatedItems);
  }, [menuItems, saveMenuCart]);

  const removeMenuItem = useCallback((id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveMenuCart(updatedItems);
  }, [menuItems, saveMenuCart]);

  // Calculate price for a single pizza item (actual CartItem type)
  const getPizzaItemPrice = useCallback((item: CartItem) => {
    const currentPrice = currentPrices?.pizzaItems?.find(p => p.id === item.id);
    const price = currentPrice ? currentPrice.currentPrice.totalPrice : item.totalPrice;
    return price * item.quantity;
  }, [currentPrices]);

  // Calculate price for a single menu item INCLUDING customizations
  const getMenuItemPrice = useCallback((item: MenuCartItem) => {
    // Start with base price (prefer fresh price from API if available)
    const currentPrice = currentPrices?.menuItems?.find(p => p.id === item.id);
    let basePrice = currentPrice ? currentPrice.currentPrice : (item.price || item.totalPrice || 0);
    
    // Add customization prices
    let customizationTotal = 0;
    if (item.customizations && Array.isArray(item.customizations)) {
      item.customizations.forEach(customGroup => {
        if (typeof customGroup === 'object' && customGroup !== null) {
          // Handle grouped customizations with selections
          if (customGroup.selections && Array.isArray(customGroup.selections)) {
            customGroup.selections.forEach(selection => {
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
    return totalItemPrice * item.quantity;
  }, [currentPrices]);

  // Memoized calculations with verification
  const { pizzaSubtotal, menuSubtotal, combinedSubtotal, tax, grandTotal, verification } = useMemo(() => {
    // Calculation method - updated to accept CartItem for pizzas
    const calculateSubtotal = (
      items: Array<CartItem | MenuCartItem>,
      getPrice: (item: any) => number
    ) => {
      return items.reduce((total, item) => {
        return total + getPrice(item);
      }, 0);
    };

    // Calculate values
    const pizzaSub = calculateSubtotal(pizzaItems, getPizzaItemPrice);
    const menuSub = calculateSubtotal(menuItems, getMenuItemPrice);
    const combinedSub = pizzaSub + menuSub;
    const taxAmount = getTaxAmount(combinedSub);
    const total = combinedSub + taxAmount;

    // Debug logging
    console.log('Cart calculation debug:', {
      menuItems: menuItems.map(item => ({
        id: item.id,
        name: item.name,
        basePrice: item.price,
        totalPrice: item.totalPrice,
        calculatedPrice: getMenuItemPrice(item),
        customizations: item.customizations
      })),
      menuSub,
      combinedSub
    });

    // Verification - calculate individual item prices and compare
    const individualPizzaPrices = pizzaItems.map(getPizzaItemPrice);
    const individualMenuPrices = menuItems.map(getMenuItemPrice);
    const calculatedPizzaSub = individualPizzaPrices.reduce((sum, price) => sum + price, 0);
    const calculatedMenuSub = individualMenuPrices.reduce((sum, price) => sum + price, 0);

    const verification = {
      pizzaItems: {
        count: pizzaItems.length,
        calculatedSubtotal: calculatedPizzaSub,
        expectedSubtotal: pizzaSub,
        matches: Math.abs(calculatedPizzaSub - pizzaSub) < 0.01,
        individualPrices: individualPizzaPrices
      },
      menuItems: {
        count: menuItems.length,
        calculatedSubtotal: calculatedMenuSub,
        expectedSubtotal: menuSub,
        matches: Math.abs(calculatedMenuSub - menuSub) < 0.01,
        individualPrices: individualMenuPrices
      }
    };

    console.log('Price verification:', verification);

    return {
      pizzaSubtotal: isNaN(pizzaSub) ? 0 : pizzaSub,
      menuSubtotal: isNaN(menuSub) ? 0 : menuSub,
      combinedSubtotal: isNaN(combinedSub) ? 0 : combinedSub,
      tax: isNaN(taxAmount) ? 0 : taxAmount,
      grandTotal: isNaN(total) ? 0 : total,
      verification
    };
  }, [pizzaItems, menuItems, currentPrices, getTaxAmount, getPizzaItemPrice, getMenuItemPrice]);

  const totalItemCount = pizzaItems.length + menuItems.length;

  if (totalItemCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={48} className="text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.push('/pizza-builder')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg"
              >
                Build Pizza
              </button>
              <button 
                onClick={() => router.push('/menu')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
              >
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {pricesLoading && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            Updating prices...
          </div>
        )}
        {!verification.pizzaItems.matches || !verification.menuItems.matches ? (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
            Warning: Price verification failed. Please refresh the page.
          </div>
        ) : null}
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-0">
            
            {/* Cart Items Section */}
            <div className="lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft size={24} className="text-gray-600" />
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                      <ShoppingCart size={20} className="text-white" />
                    </div>
                    Your Cart
                  </h1>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  {totalItemCount} item{totalItemCount > 1 ? 's' : ''}
                </div>
              </div>

              {/* Pizza Items */}
              {pizzaItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🍕 Pizzas ({pizzaItems.length})
                  </h2>
                  <div className="space-y-4">
                    {pizzaItems.map((item) => {
                      const currentPrice = currentPrices?.pizzaItems?.find(p => p.id === item.id);
                      const priceSource = currentPrice ? 'fresh' : 'stored';
                      const itemPrice = getPizzaItemPrice(item) / item.quantity;
                      
                      return (
                        <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                              <span className="text-2xl">🍕</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    {item.size?.name || 'Custom'} Pizza
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {item.crust?.name || 'Classic'} Crust • {item.sauce?.name || 'Tomato'} Sauce
                                  </p>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Price: ${itemPrice.toFixed(2)} ({priceSource})
                                  </div>
                                </div>
                                <button
                                  onClick={() => removePizza(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                  aria-label={`Remove ${item.size?.name || 'Custom'} Pizza`}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              
                              {item.toppings && item.toppings.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-sm text-gray-500 mb-1">Toppings:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.toppings.map((topping, idx) => (
                                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                                        {topping.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center bg-gray-100 rounded-full">
                                    <button
                                      onClick={() => updatePizzaQuantity(item.id, item.quantity - 1)}
                                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updatePizzaQuantity(item.id, item.quantity + 1)}
                                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-800">
                                    ${getPizzaItemPrice(item).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Menu Items */}
              {menuItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🍽️ Menu Items ({menuItems.length})
                  </h2>
                  <div className="space-y-4">
                    {menuItems.map((item) => {
                      const currentPrice = currentPrices?.menuItems?.find(p => p.id === item.id);
                      const priceSource = currentPrice ? 'fresh' : 'stored';
                      const itemPrice = getMenuItemPrice(item) / item.quantity;
                      
                      return (
                        <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <span className="text-2xl">🍽️</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    {item.name || item.menuItemName || 'Unnamed Item'}
                                  </h3>
                                  {item.category && (
                                    <p className="text-gray-600 text-sm">{item.category}</p>
                                  )}
                                  <div className="text-xs text-gray-400 mt-1">
                                    Price: ${itemPrice.toFixed(2)} ({priceSource})
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeMenuItem(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                  aria-label={`Remove ${item.name || 'menu item'}`}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>

                              {item.customizations && item.customizations.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-sm text-gray-500 mb-1">Customizations:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.customizations.map((customGroup, idx) => {
                                      if (typeof customGroup === 'string') {
                                        return (
                                          <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                                            {customGroup}
                                          </span>
                                        );
                                      } else if (customGroup.groupName && customGroup.selections) {
                                        return customGroup.selections.map((selection, selIdx) => (
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
                                          </span>
                                        );
                                      }
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center bg-gray-100 rounded-full">
                                    <button
                                      onClick={() => updateMenuItemQuantity(item.id, item.quantity - 1)}
                                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateMenuItemQuantity(item.id, item.quantity + 1)}
                                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-800">
                                    ${getMenuItemPrice(item).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8">
              <div className="sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {pizzaSubtotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Pizzas Subtotal</span>
                      <span>${pizzaSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {menuSubtotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Menu Items Subtotal</span>
                      <span>${menuSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${combinedSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({settings.taxRate}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={pricesLoading || !verification.pizzaItems.matches || !verification.menuItems.matches}
                  aria-label="Proceed to checkout"
                >
                  {pricesLoading ? 'Calculating...' : 'Proceed to Checkout'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}