'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Cart from '@/components/Cart';

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

interface SelectedTopping {
  toppingId: string;
  section: 'WHOLE' | 'LEFT' | 'RIGHT';
  quantity?: number;
  intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
}

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
  specialtyPizzaName?: string; // Add this to track if it's based on a specialty pizza
}

interface PizzaBuilderData {
  sizes: PizzaSize[];
  crusts: PizzaCrust[];
  sauces: PizzaSauce[];
  toppings: PizzaTopping[];
}

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  defaultSizeId: string;
  defaultCrustId: string;
  defaultSauceId: string;
  sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  toppings: Array<{
    toppingId: string;
    section: 'WHOLE' | 'LEFT' | 'RIGHT';
    intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  }>;
  availableSizes?: Array<{
    id: string;
    name: string;
    diameter: string;
    price: number;
  }>;
}

interface Selection {
  size: PizzaSize | null;
  crust: PizzaCrust | null;
  crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  sauce: PizzaSauce | null;
  sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
  toppings: SelectedTopping[];
}

export default function PizzaBuilder() {
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get('specialty');
  const selectedSizeId = searchParams.get('size'); // Get the selected size from URL
  
  const [data, setData] = useState<PizzaBuilderData | null>(null);
  const [specialtyPizza, setSpecialtyPizza] = useState<SpecialtyPizza | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SIZE');
  const [activeSection, setActiveSection] = useState<'WHOLE' | 'LEFT' | 'RIGHT'>('WHOLE');
  const [activeToppingCategory, setActiveToppingCategory] = useState('CHEESE');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [notes, setNotes] = useState('');
  const [selection, setSelection] = useState<Selection>({
    size: null,
    crust: null,
    crustCookingLevel: 'REGULAR',
    sauce: null,
    sauceIntensity: 'REGULAR',
    toppings: []
  });

  const tabs = [
    { id: 'SIZE', label: 'SIZE' },
    { id: 'SAUCE', label: 'SAUCE' },
    { id: 'CRUST', label: 'CRUST' },
    { id: 'TOPPINGS', label: 'TOPPINGS' },
    { id: 'REVIEW', label: 'REVIEW' }
  ];

  useEffect(() => {
    fetchPizzaData();
    
    // Load specialty pizza if specified
    if (specialtyId) {
      fetchSpecialtyPizza(specialtyId);
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('pizzaCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [specialtyId]);

  const fetchPizzaData = async () => {
    try {
      // Force fresh data - no caching during debugging
      const response = await fetch(`/api/pizza-data?t=${Date.now()}`, {
        // Force no cache
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      if (data.sizes && data.crusts && data.sauces && data.toppings) {
        setData(data);
        
        // Set default active topping category to first available
        const categories = [...new Set(data.toppings.map((t: PizzaTopping) => t.category))];
        if (categories.length > 0) {
          setActiveToppingCategory(categories[0] as string);
        }
        
        // Set default selections based on whether we're customizing a specialty pizza or building fresh
        if (!specialtyId) {
          // Fresh pizza building - use proper defaults
          const defaultSize = data.sizes.find((s: PizzaSize) => s.sortOrder === 2) || data.sizes[1] || data.sizes[0];
          const defaultCrust = data.crusts.find((c: PizzaCrust) => c.sortOrder === 1) || data.crusts[0];
          const defaultSauce = data.sauces.find((s: PizzaSauce) => s.sortOrder === 1) || data.sauces[0];
          const cheeseTopping = data.toppings.find((t: PizzaTopping) => 
            t.category === 'CHEESE' && t.sortOrder === 1
          ) || data.toppings.find((t: PizzaTopping) => t.category === 'CHEESE');

          setSelection({
            size: defaultSize,
            crust: defaultCrust,
            crustCookingLevel: 'REGULAR',
            sauce: defaultSauce,
            sauceIntensity: 'REGULAR',
            toppings: cheeseTopping ? [{
              toppingId: cheeseTopping.id,
              section: 'WHOLE',
              quantity: 1,
              intensity: 'REGULAR'
            }] : []
          });
        } else {
          // Specialty pizza customization - set minimal defaults that will be overridden
          setSelection({
            size: data.sizes[0] || null,
            crust: data.crusts[0] || null,
            crustCookingLevel: 'REGULAR',
            sauce: data.sauces[0] || null,
            sauceIntensity: 'REGULAR',
            toppings: []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching pizza data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialtyPizza = async (specialtyId: string) => {
    try {
      const response = await fetch(`/api/specialty-pizzas/${specialtyId}`);
      if (response.ok) {
        const specialty = await response.json();
        setSpecialtyPizza(specialty);
        
        // Load specialty pizza data into selection after main data is loaded
        if (data) {
          loadSpecialtyPizzaSelection(specialty);
        }
      }
    } catch (error) {
      console.error('Error fetching specialty pizza:', error);
    }
  };

  const loadSpecialtyPizzaSelection = (specialty: SpecialtyPizza) => {
    if (!data) return;
    
    // Find the specialty pizza components in the data
    // Use the selected size from URL if available, otherwise use default
    const specialtySize = selectedSizeId 
      ? data.sizes.find(s => s.id === selectedSizeId) || data.sizes[0]
      : data.sizes.find(s => s.id === specialty.defaultSizeId) || data.sizes[0];
    const specialtyCrust = data.crusts.find(c => c.id === specialty.defaultCrustId) || data.crusts[0];
    const specialtySauce = data.sauces.find(s => s.id === specialty.defaultSauceId) || data.sauces[0];
    
    // Convert specialty toppings to selection format
    const specialtyToppings: SelectedTopping[] = specialty.toppings.map(t => ({
      toppingId: t.toppingId,
      section: t.section,
      quantity: 1,
      intensity: t.intensity
    }));
    
    // Update selection with specialty pizza data
    setSelection({
      size: specialtySize,
      crust: specialtyCrust,
      crustCookingLevel: specialty.crustCookingLevel,
      sauce: specialtySauce,
      sauceIntensity: specialty.sauceIntensity,
      toppings: specialtyToppings
    });
  };

  // Load specialty selection when both data and specialty are available
  useEffect(() => {
    if (data && specialtyPizza) {
      loadSpecialtyPizzaSelection(specialtyPizza);
    }
  }, [data, specialtyPizza]);

  const toggleTopping = (topping: PizzaTopping, section: 'WHOLE' | 'LEFT' | 'RIGHT') => {
    const existingToppingIndex = selection.toppings.findIndex(
      t => t.toppingId === topping.id && t.section === section
    );

    if (existingToppingIndex >= 0) {
      // Remove topping from this section
      setSelection(prev => ({
        ...prev,
        toppings: prev.toppings.filter((_, index) => index !== existingToppingIndex)
      }));
    } else {
      // First remove this topping from any other sections (make it mutually exclusive)
      const filteredToppings = selection.toppings.filter(t => t.toppingId !== topping.id);
      
      // Then add topping to the new section
      setSelection(prev => ({
        ...prev,
        toppings: [...filteredToppings, {
          toppingId: topping.id,
          section: section,
          quantity: 1,
          intensity: 'REGULAR'
        }]
      }));
    }
  };

  const updateSauceIntensity = (intensity: 'LIGHT' | 'REGULAR' | 'EXTRA') => {
    setSelection(prev => ({ ...prev, sauceIntensity: intensity }));
  };

  const updateCrustCookingLevel = (level: 'LIGHT' | 'REGULAR' | 'WELL_DONE') => {
    setSelection(prev => ({ ...prev, crustCookingLevel: level }));
  };

  const updateToppingIntensity = (toppingId: string, section: 'WHOLE' | 'LEFT' | 'RIGHT', intensity: 'LIGHT' | 'REGULAR' | 'EXTRA') => {
    setSelection(prev => ({
      ...prev,
      toppings: prev.toppings.map(t => 
        t.toppingId === toppingId && t.section === section 
          ? { ...t, intensity }
          : t
      )
    }));
  };

  const calculateTotal = () => {
    if (!selection.size || !data) return 0;
    
    // Use specialty pizza base price if available, otherwise use size base price
    let total = specialtyPizza ? specialtyPizza.basePrice : selection.size.basePrice;
    
    // Only add modifiers if not using specialty base price
    if (!specialtyPizza) {
      if (selection.crust) total += selection.crust.priceModifier;
      if (selection.sauce) total += selection.sauce.priceModifier;
    }
    
    // Calculate topping modifications from the original specialty configuration
    if (specialtyPizza) {
      // For specialty pizzas, calculate the difference from the original configuration
      const originalToppings = specialtyPizza.toppings.map(t => t.toppingId);
      const currentToppings = selection.toppings.map(t => t.toppingId);
      
      // Add price for new toppings not in the original
      selection.toppings.forEach(selectedTopping => {
        if (!originalToppings.includes(selectedTopping.toppingId)) {
          const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
          if (topping) {
            total += topping.price * (selectedTopping.quantity || 1);
          }
        }
      });
      
      // Subtract price for removed original toppings (if you want to credit for removals)
      // For now, we'll keep it simple and not credit for removals
    } else {
      // Regular pizza - add all topping prices
      selection.toppings.forEach(selectedTopping => {
        const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
        if (topping) {
          total += topping.price * (selectedTopping.quantity || 1);
        }
      });
    }
    
    return total;
  };

  const calculateCartTotal = () => {
    console.log('Cart items:', cartItems);
    const total = cartItems.reduce((total, item) => {
      console.log('Item:', item, 'totalPrice:', item.totalPrice);
      return total + item.totalPrice;
    }, 0);
    console.log('Cart total:', total);
    return total;
  };

  const handlePlaceOrder = async () => {
    if (!selection.size || !selection.crust || !selection.sauce || !data) {
      alert('Please complete your pizza selection');
      return;
    }

    // Create cart item
    const cartToppings = selection.toppings.map(selectedTopping => {
      const topping = data.toppings.find(t => t.id === selectedTopping.toppingId);
      if (!topping) return null;
      
      const multiplier = selectedTopping.intensity === 'LIGHT' ? 0.75 : 
                        selectedTopping.intensity === 'EXTRA' ? 1.5 : 1;
      
      return {
        toppingId: topping.id,
        toppingName: topping.name,
        section: selectedTopping.section,
        intensity: selectedTopping.intensity,
        price: topping.price * multiplier
      };
    }).filter(Boolean) as any[];

    const newCartItem: CartItem = {
      sizeId: selection.size.id,
      sizeName: selection.size.name,
      crustId: selection.crust.id,
      crustName: selection.crust.name,
      sauceId: selection.sauce.id,
      sauceName: selection.sauce.name,
      sauceIntensity: selection.sauceIntensity,
      crustCookingLevel: selection.crustCookingLevel,
      toppings: cartToppings,
      notes: notes,
      totalPrice: calculateTotal(),
      specialtyPizzaName: specialtyPizza?.name // Include specialty pizza name if customizing one
    };

    // Add to cart instead of replacing
    const updatedCart = [...cartItems, newCartItem];
    setCartItems(updatedCart);
    
    // Save to localStorage
    localStorage.setItem('pizzaCart', JSON.stringify(updatedCart));
    
    // Reset the pizza builder for next item
    setSelection({
      size: null,
      crust: null,
      sauce: null,
      toppings: [],
      sauceIntensity: 'REGULAR',
      crustCookingLevel: 'REGULAR'
    });
    setNotes('');
    setActiveTab('SIZE');
    
    // Show success message
    alert('Pizza added to cart! Build another pizza or view your cart to checkout.');
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('pizzaCart');
    setShowCart(false);
    // Reset pizza builder
    setSelection({
      size: data?.sizes[0] || null,
      crust: data?.crusts[0] || null,
      crustCookingLevel: 'REGULAR',
      sauce: data?.sauces[0] || null,
      sauceIntensity: 'REGULAR',
      toppings: []
    });
    setNotes('');
    setActiveTab('SIZE');
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

  // Category mapping for better display names
  const categoryMapping = {
    'CHEESE': 'CHEESE',
    'VEGETABLE': 'VEGGIE', 
    'MEAT': 'MEATS',
    'OTHER': 'OTHERS'
  };

  const toppingCategories = Object.keys(groupedToppings).map(category => ({
    id: category,
    label: categoryMapping[category as keyof typeof categoryMapping] || category
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4 text-white hover:text-gray-200">
              ← Back to Menu
            </button>
            <h1 className="text-xl font-semibold">
              {specialtyPizza ? `🍕 Customize ${specialtyPizza.name}` : '🍕 Build Your Perfect Pizza'}
            </h1>
            {specialtyPizza ? (
              <p className="ml-2 text-red-200 text-sm">{specialtyPizza.description}</p>
            ) : (
              <p className="ml-2 text-red-200">Customize every detail exactly how you like it</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold">${(calculateTotal() || 0).toFixed(2)}</div>
              <div className="text-red-200 text-sm">Current Pizza</div>
            </div>
            {cartItems.length > 0 && (
              <>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">${calculateCartTotal().toFixed(2)}</div>
                  <div className="text-orange-300 text-sm">Cart Total</div>
                </div>
                <button
                  onClick={() => setShowCart(true)}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                >
                  🛒 View Cart ({cartItems.length})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <Cart 
                cartItems={cartItems}
                onClearCart={handleClearCart} 
                onCloseCart={() => setShowCart(false)} 
              />
            </div>
          </div>
        </div>
      )}

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
                <span className="text-red-600">${(calculateTotal() || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selection.size || !selection.crust || !selection.sauce}
              className="w-full mt-6 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              🛒 Add to Cart - ${(calculateTotal() || 0).toFixed(2)}
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
                    {specialtyPizza?.availableSizes ? (
                      // For specialty pizzas, use available sizes with pricing from the specialty pizza
                      specialtyPizza.availableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            // Convert specialty size to PizzaSize format for selection
                            const matchingSize = data.sizes.find(s => s.id === size.id);
                            if (matchingSize) {
                              setSelection(prev => ({ ...prev, size: matchingSize }));
                            }
                          }}
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
                              <div className="font-bold text-red-600">${size.price.toFixed(2)}</div>
                              {selection.size?.id === size.id && (
                                <div className="text-xs text-green-600 font-medium">Selected</div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      // For custom pizzas, use regular pizza sizes
                      data.sizes.map((size) => (
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
                              <div className="font-bold text-red-600">${(size.basePrice || 0).toFixed(2)}</div>
                              {selection.size?.id === size.id && (
                                <div className="text-xs text-green-600 font-medium">Selected</div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
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
                              {(sauce.priceModifier || 0) > 0 ? `+$${(sauce.priceModifier || 0).toFixed(2)}` : 'Free'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Sauce Intensity Selection */}
                  {selection.sauce && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Sauce Intensity</h4>
                      <div className="flex space-x-3">
                        {(['LIGHT', 'REGULAR', 'EXTRA'] as const).map(intensity => (
                          <button
                            key={intensity}
                            onClick={() => updateSauceIntensity(intensity)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              selection.sauceIntensity === intensity
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {intensity.charAt(0) + intensity.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {selection.sauceIntensity === 'LIGHT' && 'Light sauce coverage'}
                        {selection.sauceIntensity === 'REGULAR' && 'Standard sauce coverage'}
                        {selection.sauceIntensity === 'EXTRA' && 'Extra sauce coverage'}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('SIZE')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveTab('CRUST')}
                      disabled={!selection.sauce}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* CRUST Tab */}
              {activeTab === 'CRUST' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Crust</h3>
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
                              {(crust.priceModifier || 0) > 0 ? `+$${(crust.priceModifier || 0).toFixed(2)}` : 'Free'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Crust Cooking Level Selection */}
                  {selection.crust && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Cooking Level</h4>
                      <div className="flex space-x-3">
                        {(['LIGHT', 'REGULAR', 'WELL_DONE'] as const).map(level => (
                          <button
                            key={level}
                            onClick={() => updateCrustCookingLevel(level)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              selection.crustCookingLevel === level
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {level === 'WELL_DONE' ? 'Well Done' : level.charAt(0) + level.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {selection.crustCookingLevel === 'LIGHT' && 'Lightly baked crust'}
                        {selection.crustCookingLevel === 'REGULAR' && 'Standard baked crust'}
                        {selection.crustCookingLevel === 'WELL_DONE' && 'Well-done crispy crust'}
                      </p>
                    </div>
                  )}
                  
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

                  {/* Topping Category Sub-tabs */}
                  <div className="mb-6">
                    <div className="flex space-x-1 border-b border-gray-200">
                      {toppingCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveToppingCategory(category.id)}
                          className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${
                            activeToppingCategory === category.id
                              ? 'border-red-600 text-red-600 bg-red-50'
                              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display toppings for active category */}
                  {groupedToppings[activeToppingCategory] && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 gap-4">
                        {groupedToppings[activeToppingCategory].map((topping) => (
                          <div key={topping.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
                            {/* Topping Info */}
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <div className="font-medium text-lg">{topping.name}</div>
                                <div className="text-sm text-gray-500">
                                  {topping.isVegan && '🌱 '}
                                  {topping.isVegetarian && !topping.isVegan && '🥬 '}
                                </div>
                              </div>
                              <div className="text-red-600 font-bold">
                                +${(topping.price || 0).toFixed(2)}
                              </div>
                            </div>
                            
                            {/* Section Selector for this topping */}
                            <div className="flex space-x-2">
                              {(['WHOLE', 'LEFT', 'RIGHT'] as const).map((section) => {
                                const isSelected = selection.toppings.some(t => t.toppingId === topping.id && t.section === section);
                                return (
                                  <button
                                    key={section}
                                    onClick={() => toggleTopping(topping, section)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                      isSelected
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                                    }`}
                                  >
                                    {section}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Intensity Selector for selected toppings */}
                            {(['WHOLE', 'LEFT', 'RIGHT'] as const).map((section) => {
                              const selectedTopping = selection.toppings.find(t => t.toppingId === topping.id && t.section === section);
                              if (!selectedTopping) return null;
                              
                              return (
                                <div key={`${topping.id}-${section}-intensity`} className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="text-sm font-medium text-gray-700 mb-2">
                                    {section} - Intensity
                                  </div>
                                  <div className="flex space-x-2">
                                    {(['LIGHT', 'REGULAR', 'EXTRA'] as const).map(intensity => (
                                      <button
                                        key={intensity}
                                        onClick={() => updateToppingIntensity(topping.id, section, intensity)}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                          selectedTopping.intensity === intensity
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                      >
                                        {intensity.charAt(0) + intensity.slice(1).toLowerCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('CRUST')}
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
                            <span>${(selection.size.basePrice || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {selection.sauce && (
                          <div className="flex justify-between">
                            <span>{selection.sauce.name} ({selection.sauceIntensity.toLowerCase()})</span>
                            <span>{(selection.sauce.priceModifier || 0) > 0 ? `$${(selection.sauce.priceModifier || 0).toFixed(2)}` : 'Free'}</span>
                          </div>
                        )}
                        {selection.crust && (
                          <div className="flex justify-between">
                            <span>{selection.crust.name} ({selection.crustCookingLevel === 'WELL_DONE' ? 'well done' : selection.crustCookingLevel.toLowerCase()})</span>
                            <span>{(selection.crust.priceModifier || 0) > 0 ? `$${(selection.crust.priceModifier || 0).toFixed(2)}` : 'Free'}</span>
                          </div>
                        )}
                        {selection.toppings.map((selectedTopping) => {
                          const topping = data?.toppings.find(t => t.id === selectedTopping.toppingId);
                          if (!topping) return null;
                          return (
                            <div key={`${selectedTopping.toppingId}-${selectedTopping.section}`} className="flex justify-between">
                              <span>{topping.name} ({selectedTopping.section}, {selectedTopping.intensity.toLowerCase()})</span>
                              <span>${(topping.price || 0).toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-red-600">${(calculateTotal() || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Special Instructions */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Special Instructions (Optional)</h4>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests or cooking instructions..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                      />
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
