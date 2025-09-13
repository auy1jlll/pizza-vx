'use client';

import { useState } from 'react';
import { MenuItem, CartItem } from '@/types';
import { menuItems } from '@/data/menu';
import { useCartStore } from '@/stores/cartStore';
import MenuCategories from '@/components/MenuCategories';
import MenuCard from '@/components/MenuCard';
import PizzaCustomizer from '@/components/PizzaCustomizer';
import CartSidebar from '@/components/CartSidebar';
import QRScanner from '@/components/QRScanner';
import Header from '@/components/Header';
import { QrCode, MapPin } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const tableNumber = useCartStore((state) => state.tableNumber);

  const filteredItems = menuItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleAddToCart = (menuItem: MenuItem) => {
    if (menuItem.category === 'pizza') {
      setSelectedPizza(menuItem);
    } else {
      const cartItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity: 1,
        totalPrice: menuItem.basePrice,
      };
      addItem(cartItem);
    }
  };

  const handlePizzaAddToCart = (cartItem: CartItem) => {
    addItem(cartItem);
    setSelectedPizza(null);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="container mx-auto px-4 py-6">
      {/* QR Code Scanner Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <QrCode className="w-8 h-8 text-red-600" />
            <div>
              <h2 className="text-lg font-semibold">Table Service</h2>
              <p className="text-gray-600 text-sm">
                {tableNumber ? `Table ${tableNumber}` : 'Scan QR code or enter table number'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {tableNumber ? 'Change Table' : 'Scan QR'}
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Pizza Palace
        </h1>
        <p className="text-gray-600">
          Authentic Italian pizza made with the finest ingredients
        </p>
      </div>

      {/* Menu Categories */}
      <MenuCategories
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found in this category.</p>
          </div>
        )}
      </main>

      {/* Pizza Customizer Modal */}
      {selectedPizza && (
        <PizzaCustomizer
          pizza={selectedPizza}
          isOpen={!!selectedPizza}
          onClose={() => setSelectedPizza(null)}
          onAddToCart={handlePizzaAddToCart}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </>
  );
}
