'use client';

import React, { useState, useEffect } from 'react';

const TestKitchen = () => {
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
      } else {
        setOrders([]);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Store kitchen API error:', error);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Kitchen Display</h1>
      <p>Found {orders.length} orders</p>
      {orders.map((order, index) => (
        <div key={order.id} className="border p-2 m-2">
          <p>Order #{order.orderNumber || order.id}</p>
          <p>Customer: {order.customerName}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default TestKitchen;
