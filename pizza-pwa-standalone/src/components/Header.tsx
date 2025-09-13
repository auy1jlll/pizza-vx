'use client';

import { ShoppingCart, Pizza } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pizza className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Pizza Palace</h1>
              <p className="text-xs opacity-90">Authentic Italian Pizza</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}