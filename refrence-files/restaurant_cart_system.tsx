import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Clock, MapPin, CreditCard, User, Check, X } from 'lucide-react';

const RestaurantCartSystem = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Truffle Pasta",
      description: "Fresh handmade pasta with black truffle and parmesan",
      price: 28.50,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=150&h=150&fit=crop&crop=center",
      category: "Main Course",
      customizations: ["Extra truffle", "Gluten-free pasta"]
    },
    {
      id: 2,
      name: "Wagyu Steak",
      description: "Premium A5 Wagyu with seasonal vegetables",
      price: 85.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&h=150&fit=crop&crop=center",
      category: "Main Course",
      customizations: ["Medium rare"]
    },
    {
      id: 3,
      name: "Craft Cocktail",
      description: "House special with premium spirits",
      price: 15.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150&h=150&fit=crop&crop=center",
      category: "Beverages",
      customizations: []
    }
  ]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08875; // NY tax rate
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const total = subtotal + tax + deliveryFee - discount;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.1 });
      setPromoCode('');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call
    setTimeout(() => {
      setIsCheckingOut(false);
      alert('Order placed successfully! 🎉');
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
            <ShoppingCart size={48} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Discover our amazing dishes and start building your perfect meal!</p>
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <ShoppingCart size={20} className="text-white" />
                </div>
                Your Cart
              </h1>
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                {cartItems.length} item{cartItems.length > 1 ? 's' : ''}
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
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <span className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {item.customizations.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Customizations:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.customizations.map((custom, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                                {custom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-gray-100 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
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
                <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                  <Check size={16} />
                  <span>Promo code "{appliedPromo.code}" applied!</span>
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
                <span>Tax</span>
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
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isCheckingOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isCheckingOut ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Proceed to Checkout
                </>
              )}
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
    </div>
  );
};

export default RestaurantCartSystem;