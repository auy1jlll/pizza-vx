'use client';

import { useEffect, useState } from 'react';

interface CartDebugData {
  menuCart: any[];
  pizzaCart: any[];
}

export default function CartDebugPage() {
  const [cartData, setCartData] = useState<CartDebugData>({ menuCart: [], pizzaCart: [] });

  useEffect(() => {
    // Load cart data from localStorage
    const menuCartStr = localStorage.getItem('menuCart');
    const pizzaCartStr = localStorage.getItem('cartItems');

    const menuCart = menuCartStr ? JSON.parse(menuCartStr) : [];
    const pizzaCart = pizzaCartStr ? JSON.parse(pizzaCartStr) : [];

    setCartData({ menuCart, pizzaCart });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cart Debug Information</h1>
        
        {/* Menu Cart Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Menu Cart ({cartData.menuCart.length} items)</h2>
          {cartData.menuCart.length === 0 ? (
            <p className="text-gray-500">No menu items in cart</p>
          ) : (
            <div className="space-y-4">
              {cartData.menuCart.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <h3 className="font-bold text-lg">Item {index + 1}</h3>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pizza Cart Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Pizza Cart ({cartData.pizzaCart.length} items)</h2>
          {cartData.pizzaCart.length === 0 ? (
            <p className="text-gray-500">No pizza items in cart</p>
          ) : (
            <div className="space-y-4">
              {cartData.pizzaCart.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <h3 className="font-bold text-lg">Pizza {index + 1}</h3>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                localStorage.removeItem('menuCart');
                setCartData(prev => ({ ...prev, menuCart: [] }));
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Menu Cart
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('cartItems');
                setCartData(prev => ({ ...prev, pizzaCart: [] }));
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Pizza Cart
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
