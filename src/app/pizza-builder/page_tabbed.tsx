'use client';

import { useState, useEffect } from 'react';

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

export default function PizzaBuilder() {
  const [data, setData] = useState<PizzaBuilderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SIZE');
  const [selection, setSelection] = useState<Selection>({
    size: null,
    crust: null,
    sauce: null,
    toppings: []
  });

  const tabs = [
    { id: 'SIZE', label: 'SIZE' },
    { id: 'SAUCE', label: 'SAUCE' },
    { id: 'CHEESE', label: 'CHEESE' },
    { id: 'TOPPINGS', label: 'TOPPINGS' },
    { id: 'REVIEW', label: 'REVIEW' }
  ];

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
      alert('Please complete your pizza selection');
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
        alert(`Order created successfully! Order #: ${result.orderId || 'N/A'}`);
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
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Pizza Builder...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4 text-white hover:text-gray-200">
              ← Back to Menu
            </button>
            <h1 className="text-xl font-semibold">🍕 Build Your Perfect Pizza</h1>
            <p className="ml-2 text-red-200">Customize every detail exactly how you like it</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${calculateTotal().toFixed(2)}</div>
            <div className="text-red-200 text-sm">Current Total</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Pizza Visualization */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-6">Your Pizza Preview</h2>
            
            {/* Pizza Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-lg opacity-50 scale-110"></div>
                {/* Pizza base */}
                <div className="relative w-64 h-64 bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-full border-4 border-yellow-400 shadow-xl">
                  {/* Pizza slice lines */}
                  <div className="absolute inset-4 border border-orange-400 rounded-full opacity-30"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-0"></div>
                    <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-45 absolute top-0"></div>
                    <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-90 absolute top-0"></div>
                    <div className="w-0.5 h-24 bg-orange-400 opacity-40 rotate-135 absolute top-0"></div>
                  </div>
                  
                  {/* Pizza slice icon in center */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-6xl text-orange-600 opacity-60">🍕</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pizza Details Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Size:</span>
                <span className="text-red-600">{selection.size?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sauce:</span>
                <span className="text-red-600">{selection.sauce?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cheese:</span>
                <span className="text-red-600">Normal</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Toppings:</span>
                <span className="text-red-600">{selection.toppings.length}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selection.size || !selection.crust || !selection.sauce}
              className="w-full mt-6 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              🛒 Add to Cart - ${calculateTotal().toFixed(2)}
            </button>
          </div>

          {/* Right Side - Tabbed Interface */}
          <div className="bg-white rounded-lg shadow-lg">
            {/* Tab Headers */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* SIZE Tab */}
              {activeTab === 'SIZE' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Size</h3>
                  <div className="space-y-3">
                    {data.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelection(prev => ({ ...prev, size }))}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selection.size?.id === size.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-lg">{size.name}</div>
                            <div className="text-sm text-gray-600">({size.diameter})</div>
                            <div className="text-xs text-gray-500">Perfect for 1-2 people</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">${size.basePrice.toFixed(2)}</div>
                            {selection.size?.id === size.id && (
                              <div className="text-xs text-green-600 font-medium">Selected</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      disabled
                      className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('SAUCE')}
                      disabled={!selection.size}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* SAUCE Tab */}
              {activeTab === 'SAUCE' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Sauce</h3>
                  <div className="space-y-3">
                    {data.sauces.map((sauce) => (
                      <button
                        key={sauce.id}
                        onClick={() => setSelection(prev => ({ ...prev, sauce }))}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selection.sauce?.id === sauce.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
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
                            <div className="font-bold text-red-600">
                              {sauce.priceModifier > 0 ? `+$${sauce.priceModifier.toFixed(2)}` : 'Free'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('SIZE')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('CHEESE')}
                      disabled={!selection.sauce}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* CHEESE Tab */}
              {activeTab === 'CHEESE' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Cheese</h3>
                  <div className="space-y-3">
                    {data.crusts.map((crust) => (
                      <button
                        key={crust.id}
                        onClick={() => setSelection(prev => ({ ...prev, crust }))}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selection.crust?.id === crust.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-lg">{crust.name}</div>
                            <div className="text-sm text-gray-600">{crust.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600">
                              {crust.priceModifier > 0 ? `+$${crust.priceModifier.toFixed(2)}` : 'Free'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('SAUCE')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('TOPPINGS')}
                      disabled={!selection.crust}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* TOPPINGS Tab */}
              {activeTab === 'TOPPINGS' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Toppings</h3>
                  {Object.entries(groupedToppings).map(([category, toppings]) => (
                    <div key={category} className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3 capitalize">
                        {category.toLowerCase()}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {toppings.map((topping) => {
                          const isSelected = selection.toppings.some(t => t.id === topping.id);
                          return (
                            <button
                              key={topping.id}
                              onClick={() => toggleTopping(topping)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                                <div className="text-red-600 font-bold text-sm">
                                  +${topping.price.toFixed(2)}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('CHEESE')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('REVIEW')}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* REVIEW Tab */}
              {activeTab === 'REVIEW' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Review Your Order</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        {selection.size && (
                          <div className="flex justify-between">
                            <span>{selection.size.name} ({selection.size.diameter})</span>
                            <span>${selection.size.basePrice.toFixed(2)}</span>
                          </div>
                        )}
                        {selection.sauce && (
                          <div className="flex justify-between">
                            <span>{selection.sauce.name}</span>
                            <span>{selection.sauce.priceModifier > 0 ? `$${selection.sauce.priceModifier.toFixed(2)}` : 'Free'}</span>
                          </div>
                        )}
                        {selection.crust && (
                          <div className="flex justify-between">
                            <span>{selection.crust.name}</span>
                            <span>{selection.crust.priceModifier > 0 ? `$${selection.crust.priceModifier.toFixed(2)}` : 'Free'}</span>
                          </div>
                        )}
                        {selection.toppings.map((topping) => (
                          <div key={topping.id} className="flex justify-between">
                            <span>{topping.name}</span>
                            <span>${topping.price.toFixed(2)}</span>
                          </div>
                        ))}
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-red-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('TOPPINGS')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!selection.size || !selection.crust || !selection.sauce}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
