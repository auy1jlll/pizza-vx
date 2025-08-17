'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

interface MenuCartItem {
  id: string;
  name: string;
  price: number;
  totalPrice?: number; // For backward compatibility with existing cart items
  quantity: number;
  customizations?: any[];
  category?: string;
  image?: string;
  currentPrice?: number; // Fresh price from database
}

interface PizzaCartItem {
  id: string;
  size?: any;
  crust?: any;
  sauce?: any;
  toppings?: any[];
  quantity: number;
  totalPrice: number;
  currentPrice?: number; // Fresh price from database
  notes?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems: pizzaItems, removePizza, updatePizzaQuantity, calculateSubtotal, calculateTotal } = useCart();
  const [menuItems, setMenuItems] = useState<MenuCartItem[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState<any>(null);

  // Load menu cart items from localStorage and refresh prices
  useEffect(() => {
    const loadCartAndRefreshPrices = async () => {
      try {
        // Load menu cart from localStorage
        const savedMenuCart = localStorage.getItem('menuCart');
        let loadedMenuItems: MenuCartItem[] = [];
        if (savedMenuCart) {
          loadedMenuItems = JSON.parse(savedMenuCart);
          setMenuItems(loadedMenuItems);
        }

        // Only refresh prices if we have items to refresh
        if (pizzaItems.length > 0 || loadedMenuItems.length > 0) {
          const cartData = {
            pizzaItems: pizzaItems,
            menuItems: loadedMenuItems
          };

          console.log('🔄 Refreshing prices for cart data:', cartData);

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
              console.log('✅ Fresh prices loaded:', result.data);
            } else {
              console.warn('⚠️ Price refresh failed:', result.error);
            }
          } else {
            console.warn('⚠️ Price refresh API error:', response.status);
          }
        } else {
          console.log('📝 No items to refresh prices for');
        }
      } catch (error) {
        console.error('❌ Error loading cart and refreshing prices:', error);
      } finally {
        setPricesLoading(false);
      }
    };

    // Add a small delay to ensure pizzaItems are loaded from localStorage
    const timeoutId = setTimeout(() => {
      loadCartAndRefreshPrices();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pizzaItems]);

  // Save menu cart items to localStorage
  const saveMenuCart = (items: MenuCartItem[]) => {
    try {
      localStorage.setItem('menuCart', JSON.stringify(items));
      setMenuItems(items);
    } catch (error) {
      console.error('Error saving menu cart:', error);
    }
  };

  // Update menu item quantity
  const updateMenuItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeMenuItem(id);
      return;
    }
    
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    saveMenuCart(updatedItems);
  };

  // Remove menu item
  const removeMenuItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveMenuCart(updatedItems);
  };

  // Calculate menu subtotal with current prices
  const calculateMenuSubtotal = () => {
    // If no menu items, return 0
    if (!menuItems || menuItems.length === 0) {
      return 0;
    }

    // If we don't have current prices yet, use the stored price from menu items
    if (!currentPrices?.menuItems) {
      console.log('📊 Using stored prices for menu calculation (current prices not loaded)');
      return menuItems.reduce((total, item) => {
        // Handle both new 'price' field and legacy 'totalPrice' field
        const price = item.price || item.totalPrice || 0;
        const quantity = item.quantity || 1;
        
        // Fix floating-point precision and validate numbers
        const validPrice = isNaN(price) ? 0 : Math.round(price * 100) / 100;
        const validQuantity = isNaN(quantity) ? 1 : quantity;
        const itemTotal = validPrice * validQuantity;
        
        console.log(`  Menu item: ${item.name} - $${validPrice} x ${validQuantity} = $${itemTotal.toFixed(2)}`);
        return total + itemTotal;
      }, 0);
    }

    // Use fresh prices from database
    console.log('📊 Using fresh prices for menu calculation');
    return menuItems.reduce((total, item) => {
      const currentPrice = currentPrices.menuItems.find((p: any) => p.id === item.id);
      const price = currentPrice ? currentPrice.currentPrice : (item.price || item.totalPrice || 0);
      const quantity = item.quantity || 1;
      
      // Fix floating-point precision and validate numbers
      const validPrice = isNaN(price) ? 0 : Math.round(price * 100) / 100;
      const validQuantity = isNaN(quantity) ? 1 : quantity;
      const itemTotal = validPrice * validQuantity;
      
      console.log(`  Menu item: ${item.name} - $${validPrice} x ${validQuantity} = $${itemTotal.toFixed(2)} ${currentPrice ? '(fresh)' : '(stored)'}`);
      return total + itemTotal;
    }, 0);
  };  // Calculate pizza subtotal with current prices
  const calculatePizzaSubtotal = () => {
    // If no pizza items, return 0
    if (!pizzaItems || pizzaItems.length === 0) {
      return 0;
    }

    // If we don't have current prices yet, use the stored totalPrice from cart items
    if (!currentPrices?.pizzaItems) {
      console.log('📊 Using stored prices for pizza calculation (current prices not loaded)');
      return pizzaItems.reduce((total, item) => {
        const price = item.totalPrice || 0;
        const quantity = item.quantity || 1;
        console.log(`  Pizza item: ${item.id} - $${price} x ${quantity} = $${price * quantity}`);
        return total + (price * quantity);
      }, 0);
    }
    
    // Use fresh prices from database
    console.log('📊 Using fresh prices for pizza calculation');
    return pizzaItems.reduce((total, item) => {
      const currentPrice = currentPrices.pizzaItems.find((p: any) => p.id === item.id);
      const price = currentPrice ? currentPrice.currentPrice.totalPrice : (item.totalPrice || 0);
      const quantity = item.quantity || 1;
      console.log(`  Pizza item: ${item.id} - $${price} x ${quantity} = $${price * quantity} ${currentPrice ? '(fresh)' : '(stored)'}`);
      return total + (price * quantity);
    }, 0);
  };

  // Calculate combined totals with NaN safety
  const pizzaSubtotal = isNaN(calculatePizzaSubtotal()) ? 0 : calculatePizzaSubtotal();
  const menuSubtotal = isNaN(calculateMenuSubtotal()) ? 0 : calculateMenuSubtotal();
  const combinedSubtotal = pizzaSubtotal + menuSubtotal;
  const tax = combinedSubtotal * 0.0875; // 8.75% tax
  const deliveryFee = combinedSubtotal > 0 ? 3.99 : 0;
  const grandTotal = combinedSubtotal + tax + deliveryFee;

  // Debug logging for totals
  console.log('💰 CART TOTALS CALCULATION:');
  console.log(`  Pizza subtotal: $${pizzaSubtotal.toFixed(2)}`);
  console.log(`  Menu subtotal: $${menuSubtotal.toFixed(2)}`);
  console.log(`  Combined subtotal: $${combinedSubtotal.toFixed(2)}`);
  console.log(`  Tax (8.75%): $${tax.toFixed(2)}`);
  console.log(`  Delivery fee: $${deliveryFee.toFixed(2)}`);
  console.log(`  Grand total: $${grandTotal.toFixed(2)}`);
  console.log(`  Pizza items count: ${pizzaItems.length}`);
  console.log(`  Menu items count: ${menuItems.length}`);
  console.log(`  Prices loading: ${pricesLoading}`);
  console.log(`  Current prices loaded: ${currentPrices ? 'YES' : 'NO'}`);

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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-0">
            
            {/* Cart Items Section */}
            <div className="lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                    {pizzaItems.map((item) => (
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
                              </div>
                              <button
                                onClick={() => removePizza(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm text-gray-500 mb-1">Toppings:</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.toppings.map((topping: any, idx: number) => (
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
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                    {item.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() => updatePizzaQuantity(item.id, (item.quantity || 1) + 1)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-800">
                                  ${(() => {
                                    const price = Number(item.totalPrice) || 0;
                                    const quantity = Number(item.quantity) || 1;
                                    const total = price * quantity;
                                    return isNaN(total) ? '0.00' : total.toFixed(2);
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    {menuItems.map((item) => (
                      <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                {item.category && (
                                  <p className="text-gray-600 text-sm">{item.category}</p>
                                )}
                              </div>
                              <button
                                onClick={() => removeMenuItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-100 rounded-full">
                                  <button
                                    onClick={() => updateMenuItemQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateMenuItemQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-800">
                                  ${(() => {
                                    const price = Number(item.price) || 0;
                                    const quantity = Number(item.quantity) || 1;
                                    const total = price * quantity;
                                    return isNaN(total) ? '0.00' : total.toFixed(2);
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <span>Tax (8.75%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
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
                >
                  Proceed to Checkout
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
