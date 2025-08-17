'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface MenuCartItem {
  id: string;
  quantity: number;
}

export default function FloatingCartButton() {
  const { cartItems: pizzaItems } = useCart();
  const [menuItems, setMenuItems] = useState<MenuCartItem[]>([]);

  // Load menu cart items count from localStorage
  useEffect(() => {
    const loadMenuCart = () => {
      try {
        const savedMenuCart = localStorage.getItem('menuCart');
        if (savedMenuCart) {
          const parsed = JSON.parse(savedMenuCart);
          setMenuItems(parsed || []);
        }
      } catch (error) {
        console.error('Error loading menu cart:', error);
      }
    };

    loadMenuCart();

    // Listen for storage changes (when items are added from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'menuCart') {
        loadMenuCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when items are added in the same tab
    const handleCustomCartUpdate = () => {
      loadMenuCart();
    };
    
    window.addEventListener('menuCartUpdated', handleCustomCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuCartUpdated', handleCustomCartUpdate);
    };
  }, []);

  // Calculate total item count
  const pizzaCount = pizzaItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const menuCount = menuItems.reduce((total, item) => total + item.quantity, 0);
  const totalCount = pizzaCount + menuCount;

  // Don't show the button if cart is empty
  if (totalCount === 0) {
    return null;
  }

  return (
    <Link href="/cart">
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer">
          <ShoppingCart size={24} />
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-pulse">
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
