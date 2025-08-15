import React, { useState } from 'react';
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
  Sandwich,
  ShoppingBag
} from 'lucide-react';

export default function PizzaCheckoutPage() {
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
    tipAmount: '18'
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Sample pizza shop cart items
  const cartItems = [
    { 
      id: 1, 
      name: 'Large Pepperoni Pizza', 
      price: 18.99, 
      quantity: 1, 
      customizations: ['Extra Cheese', 'Thick Crust'],
      category: 'pizza'
    },
    { 
      id: 2, 
      name: 'Italian Sub (12")', 
      price: 12.99, 
      quantity: 2, 
      customizations: ['Extra Mayo', 'No Onions'],
      category: 'sub'
    },
    { 
      id: 3, 
      name: 'Buffalo Wings (10pc)', 
      price: 13.99, 
      quantity: 1, 
      customizations: ['Extra Hot Sauce'],
      category: 'wings'
    },
    { 
      id: 4, 
      name: '2L Coca Cola', 
      price: 3.99, 
      quantity: 1, 
      customizations: [],
      category: 'drink'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = formData.orderType === 'delivery' ? 2.99 : 0;
  const tipAmount = formData.orderType === 'delivery' ? (subtotal * (parseFloat(formData.tipAmount) / 100)) : 0;
  const total = subtotal + tax + deliveryFee + tipAmount;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    if (formData.orderType === 'delivery') {
      if (!formData.address) newErrors.address = 'Delivery address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 3000);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'pizza': return <Pizza className="w-4 h-4 text-red-500" />;
      case 'sub': return <Sandwich className="w-4 h-4 text-orange-500" />;
      default: return <ShoppingBag className="w-4 h-4 text-gray-500" />;
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">Thank you! Your order #PZ-{Math.floor(Math.random() * 1000)} has been received.</p>
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
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Order Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </button>
          <div className="flex items-center mb-2">
            <Pizza className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Tony's Pizza & Subs</h1>
          </div>
          <p className="text-gray-600">Complete your order - Fresh ingredients, made to order!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Order Type Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.orderType === 'delivery' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={formData.orderType === 'delivery'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 text-red-600 mr-2" />
                        <span className="font-semibold">Delivery</span>
                      </div>
                      <p className="text-sm text-gray-600">35-45 mins • $2.99 fee</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.orderType === 'pickup' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={formData.orderType === 'pickup'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <Store className="w-5 h-5 text-red-600 mr-2" />
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows="3"
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
                  
                  <div className="grid grid-cols-4 gap-3">
                    {['15', '18', '20', '25'].map((tip) => (
                      <label key={tip} className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.tipAmount === tip ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="tipAmount"
                          value={tip}
                          checked={formData.tipAmount === tip}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-semibold">{tip}%</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Selected tip: ${tipAmount.toFixed(2)}</p>
                </div>
              )}

              {/* Payment Information */}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.cvv ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        {item.customizations.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.customizations.join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
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
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
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
                    : 'bg-red-600 hover:bg-red-700'
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
                    Place Order • ${total.toFixed(2)}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}