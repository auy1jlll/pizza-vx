'use client';

import { useState } from 'react';

interface CartItem {
  sizeId: string;
  sizeName: string;
  crustId: string;
  crustName: string;
  sauceId: string;
  sauceName: string;
  sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  toppings: Array<{
    toppingId: string;
    toppingName: string;
    section: 'WHOLE' | 'LEFT' | 'RIGHT';
    intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    price: number;
  }>;
  notes?: string;
  totalPrice: number;
}

interface CartProps {
  cartItem: CartItem | null;
  onClearCart: () => void;
  onCloseCart?: () => void; // Add optional close cart function
}

export default function Cart({ cartItem, onClearCart, onCloseCart }: CartProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'PICKUP' as 'PICKUP' | 'DELIVERY',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryZip: ''
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderId?: string; message: string } | null>(null);

  const handlePlaceOrder = async () => {
    if (!cartItem) return;
    
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in your name and email');
      return;
    }

    console.log('Placing order...', { customerInfo, cartItem });
    setIsPlacingOrder(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          orderType: customerInfo.orderType,
          deliveryAddress: customerInfo.deliveryAddress,
          deliveryCity: customerInfo.deliveryCity,
          deliveryZip: customerInfo.deliveryZip,
          sizeId: cartItem.sizeId,
          crustId: cartItem.crustId,
          sauceId: cartItem.sauceId,
          sauceIntensity: cartItem.sauceIntensity,
          crustCookingLevel: cartItem.crustCookingLevel,
          toppings: cartItem.toppings.map(t => ({
            toppingId: t.toppingId,
            section: t.section,
            intensity: t.intensity
          })),
          notes: cartItem.notes
        }),
      });

      const result = await response.json();
      console.log('Order result:', result);

      if (response.ok) {
        console.log('Order placed successfully!');
        setOrderResult({
          success: true,
          orderId: result.orderId,
          message: 'Order placed successfully!'
        });
        // Store order details for potential redirection
        if (result.order && result.order.orderNumber) {
          // Add a small delay to show success message, then redirect
          setTimeout(() => {
            window.location.href = `/order/${result.order.orderNumber}`;
          }, 2000);
        }
        // Don't clear cart immediately - let user choose what to do next
      } else {
        console.log('Order failed:', result);
        setOrderResult({
          success: false,
          message: result.error || 'Failed to place order'
        });
      }
    } catch (error) {
      setOrderResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderResult) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className={`text-center p-8 rounded-lg ${orderResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`text-6xl mb-4 ${orderResult.success ? 'text-green-600' : 'text-red-600'}`}>
            {orderResult.success ? '🎉' : '😞'}
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${orderResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {orderResult.success ? 'Order Placed!' : 'Order Failed'}
          </h2>
          <p className={`text-lg mb-6 ${orderResult.success ? 'text-green-700' : 'text-red-700'}`}>
            {orderResult.success ? 'Your order has been placed successfully! Redirecting to order details...' : orderResult.message}
          </p>
          {orderResult.orderId && (
            <p className="text-sm text-gray-600 mb-6">
              Order ID: <span className="font-mono font-bold">{orderResult.orderId}</span>
            </p>
          )}
          
          {orderResult.success ? (
            <div className="space-y-3">
              <p className="text-gray-700 mb-4">What would you like to do next?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setOrderResult(null);
                    onClearCart(); // Clear the cart to reset the pizza builder
                    if (onCloseCart) {
                      onCloseCart();
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🍕 Order Another Pizza
                </button>
                <button
                  onClick={() => {
                    setOrderResult(null);
                    onClearCart(); // Clear the cart before leaving
                    if (onCloseCart) {
                      onCloseCart();
                    }
                    // Navigate to home page
                    window.location.href = '/';
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🏠 Go to Home
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOrderResult(null)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!cartItem) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Build a pizza to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">🛒</span>
        Your Order
      </h2>

      {/* Pizza Summary */}
      <div className="border-b pb-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Custom Pizza</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Size:</span>
            <span className="font-medium">{cartItem.sizeName}</span>
          </div>
          <div className="flex justify-between">
            <span>Crust:</span>
            <span className="font-medium">{cartItem.crustName} ({cartItem.crustCookingLevel.toLowerCase()})</span>
          </div>
          <div className="flex justify-between">
            <span>Sauce:</span>
            <span className="font-medium">{cartItem.sauceName} ({cartItem.sauceIntensity.toLowerCase()})</span>
          </div>
        </div>

        {cartItem.toppings.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Toppings:</h4>
            <div className="space-y-1 text-sm">
              {cartItem.toppings.map((topping, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {topping.toppingName} ({topping.section.toLowerCase()}, {topping.intensity.toLowerCase()})
                  </span>
                  <span className="font-medium">${topping.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cartItem.notes && (
          <div className="mt-4">
            <h4 className="font-medium mb-1">Special Instructions:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{cartItem.notes}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-red-600">${cartItem.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Your Information</h3>
        
        <div className="space-y-4">
          {/* Order Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orderType"
                  value="PICKUP"
                  checked={customerInfo.orderType === 'PICKUP'}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, orderType: 'PICKUP' })}
                  className="mr-2"
                />
                🏪 Pickup
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orderType"
                  value="DELIVERY"
                  checked={customerInfo.orderType === 'DELIVERY'}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, orderType: 'DELIVERY' })}
                  className="mr-2"
                />
                🚚 Delivery (+$3.99)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Delivery Address Fields */}
          {customerInfo.orderType === 'DELIVERY' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={customerInfo.deliveryAddress}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.deliveryCity}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryCity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Your City"
                  />
                </div>
                
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.deliveryZip}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryZip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="12345"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onClearCart}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
          disabled={isPlacingOrder}
        >
          Clear Cart
        </button>
        
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !customerInfo.name || !customerInfo.email}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
