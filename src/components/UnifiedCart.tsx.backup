'use client';

import { useState } from 'react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';
import CheckoutModal from './CheckoutModal';
import EnhancedCheckout from './EnhancedCheckout';
import { ShoppingCart, Plus, Minus, Trash2, Clock, MapPin, CreditCard, User, Check, X } from 'lucide-react';

export default function UnifiedCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  
  const { cartItems, calculateSubtotal, calculateTotal, removePizza, updatePizzaQuantity } = useCart();
  const { settings, getTaxAmount } = useSettings();

  const cartCount = cartItems.length;
  const subtotal = calculateSubtotal();
  const tax = getTaxAmount(subtotal);
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const total = subtotal + tax + deliveryFee - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.1 });
      setPromoCode('');
    } else if (promoCode.toLowerCase() === 'pizza20') {
      setAppliedPromo({ code: 'PIZZA20', discount: 0.2 });
      setPromoCode('');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <>
      {/* Enhanced Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 ${
          cartCount === 0 
            ? 'bg-gray-400 hover:bg-gray-500' 
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
        } text-white rounded-full p-4 shadow-xl z-50 flex items-center gap-2 transition-all duration-300 hover:shadow-2xl transform hover:scale-105`}
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-pulse">
            {cartCount}
          </span>
        )}
      </button>

      {/* Enhanced Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl max-w-md w-full shadow-2xl relative">
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                >
                  <X size={24} />
                </button>
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={48} className="text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Discover our amazing pizzas and start building your perfect meal!</p>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/pizza-builder';
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg"
                >
                  Build Your Pizza
                </button>
              </div>
            </div>
          ) : (
            /* Full Cart with Items */
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-3 gap-0 h-full">
                
                {/* Cart Items Section */}
                <div className="lg:col-span-2 bg-white rounded-l-3xl p-8 overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <ShoppingCart size={20} className="text-white" />
                      </div>
                      Your Cart
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                        {cartCount} item{cartCount > 1 ? 's' : ''}
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Order Type Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Type</h3>
                    <div className="flex gap-4">
                      {[
                        { value: 'delivery', label: 'Delivery', icon: MapPin },
                        { value: 'pickup', label: 'Pickup', icon: Clock }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setOrderType(value)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                            orderType === value
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Icon size={18} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    {cartItems.map((item: CartItem) => (
                      <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-md">
                            <span className="text-2xl">🍕</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                  {item.size?.name || 'Custom'} Pizza
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  {item.crust?.name || 'Classic'} Crust • {item.sauce?.name || 'Tomato'} Sauce
                                </p>
                                <span className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                                  Pizza
                                </span>
                              </div>
                              <button
                                onClick={() => removePizza(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            
                            {/* Toppings */}
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Toppings:</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.toppings.map((topping: any, idx: number) => (
                                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                                      {topping.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {item.notes && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Special instructions:</p>
                                <p className="text-sm text-gray-700 italic bg-yellow-50 p-2 rounded-lg">
                                  {item.notes}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
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
                                    onClick={() => updatePizzaQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">
                                  ${((item.totalPrice || 0) * (item.quantity || 1)).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${(item.totalPrice || 0).toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="lg:col-span-1 bg-white rounded-r-3xl p-8 border-l border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (try SAVE10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <Check size={16} />
                          <span>Promo "{appliedPromo.code}" applied!</span>
                        </div>
                        <button
                          onClick={removePromo}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedPromo.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Tax ({settings.taxRate}%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock size={18} />
                      <span className="font-semibold">
                        Estimated {orderType === 'delivery' ? 'delivery' : 'pickup'}: 25-35 min
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowCheckout(true);
                    }}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl"
                  >
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                      <User size={16} />
                      <span>Secure checkout with encryption</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      By proceeding, you agree to our Terms & Conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Checkout Modal */}
      <EnhancedCheckout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
}
