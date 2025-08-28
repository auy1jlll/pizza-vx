'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface MenuClientWrapperProps {
  children: React.ReactNode;
}

export default function MenuClientWrapper({ children }: MenuClientWrapperProps) {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    
    // Listen for cart updates
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('menuCart') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCartItemCount(count);
    } catch {
      setCartItemCount(0);
    }
  };

  return (
    <>
      {/* Cart Indicator - Floating */}
      {cartItemCount > 0 && (
        <div className="fixed top-6 right-6 z-50">
          <Link href="/cart" className="relative group">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/25 backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg animate-bounce">
                {cartItemCount}
              </span>
            </div>
          </Link>
        </div>
      )}
      
      {children}
    </>
  );
}
