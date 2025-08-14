'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { showToast } from '@/components/ToastContainer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'DELIVERY',
    address: '',
    city: '',
    zip: '',
    instructions: ''
  });

  // Auto-populate customer info when user is logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        // Keep existing phone, address, etc. if already filled
        phone: prev.phone || '',
        address: prev.address || '',
        city: prev.city || '',
        zip: prev.zip || ''
      }));
    }
  }, [user]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.0875; // 8.75% Boston tax rate
  const deliveryFee = subtotal < 25 ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include authentication cookies
        body: JSON.stringify({
          items,
          customerInfo
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrderDetails(result.order);
        setOrderComplete(true);
        clearCart();
        showToast(`Order ${result.order.orderNumber} placed successfully! 🎉`, 'success');
      } else {
        showToast(result.error || 'Failed to place order', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (orderComplete) {
      setOrderComplete(false);
      setOrderDetails(null);
      // Reset form but preserve user info if logged in
      setCustomerInfo({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        orderType: 'DELIVERY',
        address: '',
        city: '',
        zip: '',
        instructions: ''
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {orderComplete ? (
          // Order Confirmation
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-4">Order Confirmed!</h2>
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-300 font-medium">
                Order #{orderDetails?.orderNumber}
              </p>
              <p className="text-white text-lg font-bold">
                Total: ${orderDetails?.total?.toFixed(2)}
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Estimated delivery: {orderDetails?.estimatedTime}
              </p>
            </div>
            <p className="text-gray-300 mb-6">
              Thank you for choosing Boston Pizza Co.! We'll send you updates via email and SMS.
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Checkout Form
          <>
            <div className="p-6 border-b border-white/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Checkout</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-300">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/20 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.75%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-green-400 text-lg border-t border-white/20 pt-1">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {user && (
                <div className="mb-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300 text-sm">
                    <span>✅</span>
                    <span>Logged in as <strong>{user.name}</strong> - Information auto-filled</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="(617) 555-0123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="john@example.com"
                />
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="orderType"
                      value="DELIVERY"
                      checked={customerInfo.orderType === 'DELIVERY'}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, orderType: e.target.value }))}
                      className="mr-2"
                    />
                    <span className="text-white">Delivery (+$3.99)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="orderType"
                      value="PICKUP"
                      checked={customerInfo.orderType === 'PICKUP'}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, orderType: e.target.value }))}
                      className="mr-2"
                    />
                    <span className="text-white">Pickup (FREE)</span>
                  </label>
                </div>
              </div>

              {/* Delivery Information */}
              {customerInfo.orderType === 'DELIVERY' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="123 Commonwealth Ave"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Boston"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.zip}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, zip: e.target.value }))}
                        className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="02116"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Delivery Instructions
                    </label>
                    <textarea
                      value={customerInfo.instructions}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, instructions: e.target.value }))}
                      className="w-full bg-slate-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows={3}
                      placeholder="Apartment number, building entrance, etc."
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
