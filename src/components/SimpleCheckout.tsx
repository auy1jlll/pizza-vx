'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ToastProvider';

interface SimpleCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleCheckout({ isOpen, onClose }: SimpleCheckoutProps) {
  // Adapt to current CartContext shape (cartItems, calculateSubtotal, calculateTotal)
  const { cartItems, clearCart, calculateSubtotal, calculateTotal } = useCart();
  const { show: showToast } = useToast();
  const getSubtotal = () => calculateSubtotal();
  const getDisplayTotal = () => calculateTotal();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create simple order data with minimal transformation
      const orderData = {
        orderType: 'DELIVERY',
        customer: customerInfo,
        delivery: {
          address: customerInfo.address,
          city: customerInfo.city,
          zip: customerInfo.zip,
          instructions: ''
        },
        items: cartItems.map(item => ({
          id: item.id,
          size: {
            id: item.size?.id || 'size-default',
            name: item.size?.name || 'Medium',
            diameter: item.size?.diameter || '12"',
            basePrice: item.size?.basePrice || item.basePrice || 12.99,
            isActive: true,
            sortOrder: 1
          },
          crust: {
            id: item.crust?.id || 'crust-default',
            name: item.crust?.name || 'Traditional',
            description: item.crust?.description || 'Traditional crust',
            priceModifier: item.crust?.priceModifier || 0,
            isActive: true,
            sortOrder: 1
          },
          sauce: {
            id: item.sauce?.id || 'sauce-default',
            name: item.sauce?.name || 'Tomato',
            description: item.sauce?.description || 'Tomato sauce',
            color: item.sauce?.color || '#FF0000',
            spiceLevel: item.sauce?.spiceLevel || 1,
            priceModifier: item.sauce?.priceModifier || 0,
            isActive: true,
            sortOrder: 1
          },
          toppings: item.toppings.map(t => ({
            id: t.id || 'topping-default',
            name: t.name,
            price: t.price || 0,
            quantity: t.quantity || 1,
            section: t.section || 'WHOLE',
            intensity: 'REGULAR'
          })),
          quantity: item.quantity || 1,
          notes: item.notes || '',
          basePrice: item.basePrice || 12.99,
          totalPrice: item.totalPrice || item.basePrice || 12.99
        })),
        subtotal: getSubtotal(),
        deliveryFee: 3.99,
        tax: getSubtotal() * 0.08,
        total: getSubtotal() + 3.99 + (getSubtotal() * 0.08)
      };

      console.log('🚀 Sending simple order:', orderData);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Order success:', result);
        
        // Extract order number from any possible location
        const orderNum = result.data?.orderNumber || 
                        result.orderNumber || 
                        result.data?.id || 
                        result.id || 
                        `ORDER-${Date.now()}`;
        
        setOrderNumber(orderNum);
        setSuccess(true);
        clearCart();
      } else {
        const errorText = await response.text();
  console.error('❌ Order failed:', errorText);
  showToast(`Order failed: ${response.status}`, { type: 'error' });
      }

    } catch (error) {
  console.error('❌ Network error:', error);
  showToast('Network error. Please try again.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              Your order #{orderNumber} has been placed successfully!
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Cart Items */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Your Order:</h3>
          {cartItems.map(item => {
            const displayName = item.size?.name ? `${item.size.name} Pizza` : 'Custom Pizza';
            return (
            <div key={item.id} className="border-b pb-2 mb-2">
              <div className="font-medium">{displayName}</div>
              <div className="text-sm text-gray-600">
                {item.crust?.name || 'Crust'} • {item.sauce?.name || 'Sauce'}
              </div>
              <div className="text-sm text-gray-600">
                Qty: {item.quantity} • ${(item.totalPrice || item.basePrice || 0).toFixed(2)}
              </div>
            </div>
          );})}
          <div className="font-bold text-lg mt-4">Subtotal: ${getSubtotal().toFixed(2)}</div>
        </div>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              required
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </div>
          
          <input
            type="tel"
            placeholder="Phone *"
            required
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
          
          <input
            type="text"
            placeholder="Address *"
            required
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
            className="w-full border rounded px-3 py-2"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City *"
              required
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="ZIP *"
              required
              value={customerInfo.zip}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, zip: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order - $${(getSubtotal() + 3.99 + (getSubtotal() * 0.08)).toFixed(2)}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
