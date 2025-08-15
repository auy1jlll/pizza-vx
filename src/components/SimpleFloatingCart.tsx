'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import SimpleCheckout from './SimpleCheckout';

export default function SimpleFloatingCart() {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (getTotalItems() === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowCheckout(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center space-x-3"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">
              {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
            </div>
            <div className="text-xs opacity-90">
              ${getTotalPrice().toFixed(2)}
            </div>
          </div>
        </button>
      </div>

      <SimpleCheckout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
}
