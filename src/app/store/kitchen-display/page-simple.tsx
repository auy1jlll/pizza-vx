'use client';

import React, { useState, useEffect } from 'react';

const KitchenDisplaySimple = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      console.log('🍕 Fetching orders from store kitchen API...');
      const response = await fetch('/api/store/kitchen/orders');
      
      if (!response.ok) {
        setError(`Error ${response.status}: Unable to load orders`);
        setOrders([]);
        return;
      }
      
      const data = await response.json();
      console.log('📦 Store kitchen API response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        setError(null);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setError(null);
      } else {
        setOrders([]);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Store kitchen API error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error - please check your connection');
      } else {
        setError('Failed to load orders');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Simple polling every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="mt-4 text-xl">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl">Error: {error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Kitchen Display - Simple</h1>
        
        <div className="mb-4 text-center">
          <p className="text-lg">Found {orders.length} orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-800 p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">#{order.orderNumber || order.id.slice(-6)}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === 'pending' ? 'bg-blue-600' :
                  order.status === 'confirmed' ? 'bg-yellow-600' :
                  order.status === 'preparing' ? 'bg-orange-600' :
                  order.status === 'ready' ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <p className="text-gray-300">Customer: {order.customerName}</p>
              <p className="text-gray-300">Type: {order.orderType}</p>
              <p className="text-gray-300">Items: {order.items?.length || 0}</p>
              <p className="text-gray-300">Total: ${order.total}</p>
              
              {order.items && order.items.length > 0 && (
                <div className="mt-2 border-t pt-2">
                  <p className="text-sm text-gray-400">Items:</p>
                  {order.items.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="text-sm text-gray-300">
                      • {item.menuItem?.name || 'Pizza'} x{item.quantity}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-400">... and {order.items.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center text-gray-400">
            <p className="text-xl">No orders to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplaySimple;
