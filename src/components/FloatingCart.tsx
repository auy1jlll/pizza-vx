'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import CheckoutModal from './CheckoutModal';

export default function FloatingCart() {
  const { items, getTotalPrice, getTotalItems, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  if (getTotalItems() === 0) {
    return null;
  }

  return (
    <>
      {/* Cart Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center space-x-2 group"
        >
          <span className="text-2xl">🛒</span>
          <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold">
            {getTotalItems()}
          </div>
          <span className="hidden group-hover:block text-sm font-medium">
            ${getTotalPrice().toFixed(2)}
          </span>
        </button>
      </div>

      {/* Cart Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-slate-800 border-l border-white/20 shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>🛒</span>
                <span>Your Cart</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} • ${getTotalPrice().toFixed(2)}
            </p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-lg"
                  >
                    ×
                  </button>
                </div>

                {/* Item Details */}
                <div className="text-xs text-gray-300 space-y-1 mb-3">
                  {item.size && <div>Size: {item.size}</div>}
                  {item.crust && <div>Crust: {item.crust}</div>}
                  {item.sauce && <div>Sauce: {item.sauce}</div>}
                  {item.toppings && item.toppings.length > 0 && (
                    <div>Toppings: {item.toppings.join(', ')}</div>
                  )}
                  {item.customizations && <div>Customizations: {item.customizations}</div>}
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 bg-slate-600 hover:bg-slate-500 text-white rounded-full flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 bg-slate-600 hover:bg-slate-500 text-white rounded-full flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-green-400 font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Footer */}
          <div className="p-6 border-t border-white/20 bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-2xl font-bold text-green-400">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowCheckout(true);
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🍕 Checkout
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                      setIsOpen(false);
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
}
