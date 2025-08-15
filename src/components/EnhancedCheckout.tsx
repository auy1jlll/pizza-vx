'use client';

import React, { useState } from 'react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  CreditCard, 
  Lock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Clock,
  Truck,
  Store,
  ArrowLeft,
  Check,
  Pizza,
  X,
  ShoppingBag
} from 'lucide-react';

interface EnhancedCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedCheckout({ isOpen, onClose }: EnhancedCheckoutProps) {
  const { cartItems, calculateSubtotal, clearCart } = useCart();
  const { settings, getTaxAmount } = useSettings();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    apartmentUnit: '',
    deliveryInstructions: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveInfo: false,
    orderType: 'delivery', // delivery or pickup
    tipAmount: settings.defaultTipPercentage?.toString() || '18',
    customTipAmount: '',
    paymentMethod: 'credit-card' // credit-card, pay-at-pickup, pay-later
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = calculateSubtotal();
  const tax = getTaxAmount(subtotal);
  const deliveryFee = formData.orderType === 'delivery' ? 3.99 : 0;
  
  // Calculate tip amount
  let tipAmount = 0;
  if (formData.orderType === 'delivery') {
    if (formData.tipAmount === 'custom') {
      tipAmount = parseFloat(formData.customTipAmount) || 0;
    } else {
      tipAmount = subtotal * (parseFloat(formData.tipAmount) / 100);
    }
  }
  
  const total = subtotal + tax + deliveryFee + tipAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    if (formData.orderType === 'delivery') {
      if (!formData.address) newErrors.address = 'Delivery address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }
    
    // Only validate payment fields if credit card payment is selected
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        orderType: formData.orderType.toUpperCase(),
        paymentMethod: formData.paymentMethod,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zipCode
        },
        delivery: formData.orderType === 'delivery' ? {
          address: formData.address,
          city: formData.city,
          zip: formData.zipCode,
          instructions: formData.deliveryInstructions || ''
        } : null,
        items: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tipAmount: tipAmount,
        tipPercentage: formData.tipAmount === 'custom' ? null : parseFloat(formData.tipAmount),
        customTipAmount: formData.tipAmount === 'custom' ? tipAmount : null,
        tax: tax,
        total: total
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderNumber(result.orderNumber || `PZ-${Math.floor(Math.random() * 1000)}`);
        setOrderComplete(true);
        clearCart();
      } else {
        const error = await response.json();
        console.error('Checkout error:', error);
        alert(`Order failed: ${response.status} - ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Order failed due to a network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryIcon = (item: CartItem) => {
    return <Pizza className="w-4 h-4 text-orange-500" />;
  };

  if (!isOpen) return null;

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">Thank you! Your order #{orderNumber} has been received.</p>
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-semibold text-orange-800">
                {formData.orderType === 'delivery' ? 'Delivery Time: 35-45 mins' : 'Ready for Pickup: 15-20 mins'}
              </span>
            </div>
            <p className="text-sm text-orange-700">
              {formData.orderType === 'delivery' 
                ? 'We\'ll call you when the driver is on the way!' 
                : 'We\'ll text you when your order is ready to pickup.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 to-amber-50 z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={onClose}
              className="flex items-center text-orange-600 hover:text-orange-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </button>
            <div className="flex items-center mb-2">
              <Pizza className="w-8 h-8 text-orange-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
            </div>
            <p className="text-gray-600">Fresh ingredients, made to order!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Order Type Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.orderType === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="orderType"
                        value="delivery"
                        checked={formData.orderType === 'delivery'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Truck className="w-5 h-5 text-orange-600 mr-2" />
                          <span className="font-semibold">Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600">35-45 mins • $3.99 fee</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.orderType === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="orderType"
                        value="pickup"
                        checked={formData.orderType === 'pickup'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Store className="w-5 h-5 text-orange-600 mr-2" />
                          <span className="font-semibold">Pickup</span>
                        </div>
                        <p className="text-sm text-gray-600">15-20 mins • No fee</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery Address (only show if delivery selected) */}
                {formData.orderType === 'delivery' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.address ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="123 Main Street"
                        />
                        {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apartment/Unit (Optional)</label>
                        <input
                          type="text"
                          name="apartmentUnit"
                          value={formData.apartmentUnit}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Apt 4B, Unit 12, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              errors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              errors.zipCode ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions (Optional)</label>
                        <textarea
                          name="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          rows={3}
                          placeholder="Ring doorbell, leave at door, building code, etc."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tip Section (only show for delivery) */}
                {formData.orderType === 'delivery' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-yellow-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Tip Your Driver</h2>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {settings.tipPercentages?.map((tip) => (
                        <label key={tip} className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.tipAmount === tip.toString() ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input
                            type="radio"
                            name="tipAmount"
                            value={tip.toString()}
                            checked={formData.tipAmount === tip.toString()}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="font-semibold">{tip}%</span>
                        </label>
                      ))}
                    </div>

                    {settings.allowCustomTip && (
                      <div className="border-t pt-4">
                        <label className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.tipAmount === 'custom' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="tipAmount"
                              value="custom"
                              checked={formData.tipAmount === 'custom'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-orange-600 mr-3"
                            />
                            <span className="font-semibold">Custom Amount</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">$</span>
                            <input
                              type="number"
                              name="customTipAmount"
                              value={formData.customTipAmount}
                              onChange={handleInputChange}
                              onClick={() => setFormData(prev => ({ ...prev, tipAmount: 'custom' }))}
                              min="0"
                              step="0.50"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-300"
                              placeholder="0.00"
                            />
                          </div>
                        </label>
                        <p className="text-xs text-gray-500 mt-2 text-center">You can enter any amount, including $0</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-3">Selected tip: ${tipAmount.toFixed(2)}</p>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    {/* Credit Card Option */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === 'credit-card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 mr-3"
                      />
                      <div>
                        <span className="font-semibold">Credit/Debit Card</span>
                        <p className="text-sm text-gray-600">Pay securely online now</p>
                      </div>
                    </label>

                    {/* Pay at Pickup Option */}
                    {formData.orderType === 'pickup' && settings.allowPayAtPickup && (
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'pay-at-pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay-at-pickup"
                          checked={formData.paymentMethod === 'pay-at-pickup'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-600 mr-3"
                        />
                        <div>
                          <span className="font-semibold">Pay at Pickup</span>
                          <p className="text-sm text-gray-600">Pay with cash or card when you arrive</p>
                        </div>
                      </label>
                    )}

                    {/* Pay on Delivery Option */}
                    {formData.orderType === 'delivery' && settings.allowPayLater && subtotal >= (settings.payLaterMinimumOrder || 0) && (
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'pay-later' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pay-later"
                          checked={formData.paymentMethod === 'pay-later'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-600 mr-3"
                        />
                        <div>
                          <span className="font-semibold">Pay on Delivery</span>
                          <p className="text-sm text-gray-600">Pay with cash or card when your order arrives</p>
                        </div>
                      </label>
                    )}
                  </div>

                  {formData.orderType === 'delivery' && settings.allowPayLater && subtotal < (settings.payLaterMinimumOrder || 0) && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Pay on delivery requires a minimum order of ${settings.payLaterMinimumOrder?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Information (only show if credit card selected) */}
                {formData.paymentMethod === 'credit-card' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                      <div className="ml-auto flex items-center text-sm text-gray-600">
                        <Lock className="w-4 h-4 mr-1" />
                        Secure
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.cardName ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardName && <p className="text-red-600 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              errors.cvv ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="123"
                          />
                          {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: CartItem) => (
                    <div key={item.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          {getCategoryIcon(item)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {item.size?.name || 'Custom'} Pizza
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.crust?.name || 'Classic'} • {item.sauce?.name || 'Tomato'}
                          </p>
                          {item.toppings && item.toppings.length > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                              +{item.toppings.length} toppings
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ${((item.totalPrice || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {formData.orderType === 'delivery' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tip ({formData.tipAmount}%)</span>
                        <span className="font-medium">${tipAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({settings.taxRate}%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center text-sm text-orange-800">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      Estimated {formData.orderType === 'delivery' ? 'Delivery' : 'Pickup'}: {' '}
                      {formData.orderType === 'delivery' ? '35-45 mins' : '15-20 mins'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-5 h-5 mr-2" />
                      {formData.paymentMethod === 'credit-card' 
                        ? `Place Order • $${total.toFixed(2)}`
                        : formData.paymentMethod === 'pay-at-pickup'
                        ? `Confirm Order • Pay at Pickup ($${total.toFixed(2)})`
                        : `Confirm Order • Pay on Delivery ($${total.toFixed(2)})`
                      }
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
