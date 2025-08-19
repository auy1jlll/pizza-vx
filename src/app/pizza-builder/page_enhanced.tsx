'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
}

interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
}

interface PizzaSauce {
  id: string;
  name: string;
  description: string;
  color: string;
  spiceLevel: number;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
}

interface PizzaTopping {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  sortOrder: number;
}

interface PizzaBuilderData {
  sizes: PizzaSize[];
  crusts: PizzaCrust[];
  sauces: PizzaSauce[];
  toppings: PizzaTopping[];
}

interface Selection {
  size: PizzaSize | null;
  crust: PizzaCrust | null;
  sauce: PizzaSauce | null;
  toppings: PizzaTopping[];
}

export default function PizzaBuilderEnhanced() {
  const [data, setData] = useState<PizzaBuilderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<Selection>({
    size: null,
    crust: null,
    sauce: null,
    toppings: []
  });
  const { show: showToast } = useToast();
  const { settings } = useAppSettingsContext();

  useEffect(() => {
    fetchPizzaData();
  }, []);

  const fetchPizzaData = async () => {
    try {
      const response = await fetch('/api/pizza-builder');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        // Set default selections
        setSelection({
          size: result.data.sizes[1] || null,
          crust: result.data.crusts[1] || null,
          sauce: result.data.sauces[0] || null,
          toppings: []
        });
      }
    } catch (error) {
      console.error('Error fetching pizza data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopping = (topping: PizzaTopping) => {
    setSelection(prev => ({
      ...prev,
      toppings: prev.toppings.find(t => t.id === topping.id)
        ? prev.toppings.filter(t => t.id !== topping.id)
        : [...prev.toppings, topping]
    }));
  };

  const calculateTotal = () => {
    if (!selection.size) return 0;
    
    let total = selection.size.basePrice;
    if (selection.crust) total += selection.crust.priceModifier;
    if (selection.sauce) total += selection.sauce.priceModifier;
    total += selection.toppings.reduce((sum, topping) => sum + topping.price, 0);
    
    return total;
  };

  const handlePlaceOrder = async () => {
    if (!selection.size || !selection.crust || !selection.sauce) {
      showToast('Please complete your pizza selection', { type: 'info' });
      return;
    }

    const orderData = {
      size: selection.size,
      crust: selection.crust,
      sauce: selection.sauce,
      toppings: selection.toppings,
      total: calculateTotal()
    };

    try {
      const response = await fetch('/api/pizza-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      if (result.success) {
        showToast(`Order created successfully! Order #: ${result.orderId || 'N/A'}`, { type: 'success' });
        // Reset selections
        setSelection({
          size: data?.sizes[1] || null,
          crust: data?.crusts[1] || null,
          sauce: data?.sauces[0] || null,
          toppings: []
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Please try again.', { type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Pizza Builder...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load pizza data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const groupedToppings = data.toppings.reduce((acc, topping) => {
    if (!acc[topping.category]) acc[topping.category] = [];
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, PizzaTopping[]>);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Enhanced Header */}
      <div className="bg-white shadow-xl border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <span className="inline-block w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full text-2xl flex items-center justify-center mr-3 shadow-md border border-orange-400">🍕</span>
                {settings.app_name || 'Pizza Builder Pro'}
              </h1>
              <p className="text-gray-600 mt-2">Create your perfect pizza masterpiece</p>
            </div>
            <div className="text-right">
              <div className="price-display">${calculateTotal().toFixed(2)}</div>
              <div className="text-sm text-gray-500">Current Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pizza Builder Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Size */}
            <div className="pizza-card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Choose Size</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelection(prev => ({ ...prev, size }))}
                    className={`pizza-option ${
                      selection.size?.id === size.id
                        ? 'pizza-option-selected'
                        : 'pizza-option-default'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">{size.name}</div>
                      <div className="text-sm text-gray-500">{size.diameter}</div>
                      <div className="text-lg font-bold text-green-600">${size.basePrice.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Crust */}
            <div className="pizza-card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Choose Crust</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.crusts.map((crust) => (
                  <button
                    key={crust.id}
                    onClick={() => setSelection(prev => ({ ...prev, crust }))}
                    className={`pizza-option text-left ${
                      selection.crust?.id === crust.id
                        ? 'pizza-option-selected'
                        : 'pizza-option-default'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">{crust.name}</div>
                        <div className="text-sm text-gray-600">{crust.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {crust.priceModifier > 0 ? `+$${crust.priceModifier.toFixed(2)}` : 'Free'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Sauce */}
            <div className="pizza-card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Choose Sauce</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.sauces.map((sauce) => (
                  <button
                    key={sauce.id}
                    onClick={() => setSelection(prev => ({ ...prev, sauce }))}
                    className={`pizza-option text-left ${
                      selection.sauce?.id === sauce.id
                        ? 'pizza-option-selected'
                        : 'pizza-option-default'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: sauce.color }}
                          ></div>
                          <div className="font-semibold text-lg">{sauce.name}</div>
                        </div>
                        <div className="text-sm text-gray-600">{sauce.description}</div>
                        <div className="text-sm text-orange-600">
                          {'🌶️'.repeat(sauce.spiceLevel)} {sauce.spiceLevel === 0 ? 'Mild' : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {sauce.priceModifier > 0 ? `+$${sauce.priceModifier.toFixed(2)}` : 'Free'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Toppings */}
            <div className="pizza-card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Choose Toppings</h2>
              {Object.entries(groupedToppings).map(([category, toppings]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                    {category.toLowerCase()}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {toppings.map((topping) => {
                      const isSelected = selection.toppings.some(t => t.id === topping.id);
                      return (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping)}
                          className={`pizza-option ${
                            isSelected
                              ? 'pizza-option-selected'
                              : 'pizza-option-default'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{topping.name}</div>
                              <div className="text-sm text-gray-500">
                                {topping.isVegan && '🌱 '}
                                {topping.isVegetarian && !topping.isVegan && '🥬 '}
                              </div>
                            </div>
                            <div className="text-green-600 font-bold text-sm">
                              +${topping.price.toFixed(2)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <div className="pizza-card sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                {selection.size && (
                  <div className="flex justify-between">
                    <span>{selection.size.name} ({selection.size.diameter})</span>
                    <span>${selection.size.basePrice.toFixed(2)}</span>
                  </div>
                )}
                
                {selection.crust && (
                  <div className="flex justify-between">
                    <span>{selection.crust.name}</span>
                    <span>{selection.crust.priceModifier > 0 ? `$${selection.crust.priceModifier.toFixed(2)}` : 'Free'}</span>
                  </div>
                )}
                
                {selection.sauce && (
                  <div className="flex justify-between">
                    <span>{selection.sauce.name}</span>
                    <span>{selection.sauce.priceModifier > 0 ? `$${selection.sauce.priceModifier.toFixed(2)}` : 'Free'}</span>
                  </div>
                )}
                
                {selection.toppings.map((topping) => (
                  <div key={topping.id} className="flex justify-between">
                    <span>{topping.name}</span>
                    <span>${topping.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={!selection.size || !selection.crust || !selection.sauce}
                className="btn btn-primary w-full mt-6 py-3 px-4 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {!selection.size || !selection.crust || !selection.sauce 
                  ? 'Complete Your Selection' 
                  : 'Place Order'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
