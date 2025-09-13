'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/stores/cartStore';
import { Customer } from '@/types';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  orderType: z.enum(['dine-in', 'takeout', 'delivery']),
  deliveryAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [tip, setTip] = useState(18);
  const [customTip, setCustomTip] = useState('');

  const { items, getSubtotal, getTax, tableNumber, setCustomer, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      orderType: tableNumber ? 'dine-in' : 'takeout',
    },
  });

  const orderType = watch('orderType');
  const subtotal = getSubtotal();
  const tax = getTax();
  const tipAmount = customTip ? parseFloat(customTip) || 0 : (subtotal * tip) / 100;
  const total = subtotal + tax + tipAmount;

  const onSubmit = (data: CustomerFormData) => {
    const customer: Customer = {
      ...data,
      tableNumber: tableNumber || undefined,
      email: data.email || undefined,
      deliveryAddress: data.deliveryAddress || undefined,
    };
    setCustomer(customer);
    setStep('payment');
  };

  const handlePayment = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('confirmation');
  };

  const handleNewOrder = () => {
    clearCart();
    router.push('/');
  };

  if (items.length === 0 && step === 'info') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => step === 'info' ? router.push('/') : setStep('info')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">
              {step === 'info' && 'Customer Information'}
              {step === 'payment' && 'Payment'}
              {step === 'confirmation' && 'Order Confirmed'}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {step === 'info' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (optional)
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Type</h2>

                <div className="grid grid-cols-3 gap-3">
                  {['dine-in', 'takeout', 'delivery'].map((type) => (
                    <label key={type} className="relative">
                      <input
                        {...register('orderType')}
                        type="radio"
                        value={type}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-colors ${
                        orderType === type
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}>
                        <span className="font-medium capitalize">{type.replace('-', ' ')}</span>
                        {type === 'dine-in' && tableNumber && (
                          <p className="text-xs text-gray-600 mt-1">Table {tableNumber}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {orderType === 'delivery' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      {...register('deliveryAddress')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Your delivery address"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Special Instructions</h2>
                <textarea
                  {...register('specialInstructions')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Any special requests for your order..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Add Tip</h2>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[15, 18, 20, 25].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() => {
                        setTip(percentage);
                        setCustomTip('');
                      }}
                      className={`p-3 border-2 rounded-lg text-center transition-colors ${
                        tip === percentage && !customTip
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <div className="font-medium">{percentage}%</div>
                      <div className="text-sm text-gray-600">
                        ${((subtotal * percentage) / 100).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom tip amount
                  </label>
                  <input
                    type="number"
                    value={customTip}
                    onChange={(e) => {
                      setCustomTip(e.target.value);
                      setTip(0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter custom tip amount"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip:</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ${total.toFixed(2)}</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Demo: Payment simulation only
                </p>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been received and is being prepared.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-semibold">Order #12345</p>
                <p className="text-sm text-gray-600">
                  Estimated time: 20-25 minutes
                </p>
              </div>

              <button
                onClick={handleNewOrder}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Start New Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}