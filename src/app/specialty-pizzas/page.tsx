'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { showToast } from '@/components/ToastContainer';

interface SpecialtyPizzaSize {
  id: string;
  price: number;
  isAvailable: boolean;
  pizzaSize: {
    id: string;
    name: string;
    diameter: string;
    basePrice: number;
    description?: string;
  };
}

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl?: string;
  ingredients: string;
  isActive: boolean;
  sizes?: SpecialtyPizzaSize[];
}

export default function SpecialtyPizzasPage() {
  const [pizzas, setPizzas] = useState<SpecialtyPizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const { addItem, getTotalItems } = useCart();

  // Fetch specialty pizzas
  const fetchPizzas = async () => {
    try {
      const response = await fetch('/api/specialty-pizzas');
      if (response.ok) {
        const data = await response.json();
        setPizzas(Array.isArray(data) ? data : []);
        
        // Set default sizes to the first available size for each pizza
        const defaultSizes: Record<string, string> = {};
        data.forEach((pizza: SpecialtyPizza) => {
          if (pizza.sizes && pizza.sizes.length > 0) {
            defaultSizes[pizza.id] = pizza.sizes[0].pizzaSize.id;
          }
        });
        setSelectedSizes(defaultSizes);
      } else {
        console.error('Failed to fetch specialty pizzas');
        setPizzas([]);
      }
    } catch (error) {
      console.error('Error fetching specialty pizzas:', error);
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // Get selected size for a pizza
  const getSelectedSize = (pizza: SpecialtyPizza): SpecialtyPizzaSize | undefined => {
    const selectedSizeId = selectedSizes[pizza.id];
    return pizza.sizes?.find(size => size.pizzaSize.id === selectedSizeId);
  };

  // Get price for selected size or fallback to base price
  const getPizzaPrice = (pizza: SpecialtyPizza): number => {
    const selectedSize = getSelectedSize(pizza);
    return selectedSize ? selectedSize.price : pizza.basePrice;
  };

  // Add to cart function
  const addToCart = (pizza: SpecialtyPizza) => {
    const selectedSize = getSelectedSize(pizza);
    const price = getPizzaPrice(pizza);
    
    addItem({
      type: 'specialty',
      name: `${pizza.name}`,
      price: price,
      size: selectedSize?.pizzaSize.name || 'Default',
      specialtyPizzaId: pizza.id
    });
    showToast(`${pizza.name} (${selectedSize?.pizzaSize.name || 'Default'}) added to cart! 🍕`, 'success');
  };

  // Parse ingredients from JSON string
  const parseIngredients = (ingredientsStr: string): string[] => {
    try {
      return JSON.parse(ingredientsStr);
    } catch {
      return [];
    }
  };

  // Group pizzas by category
  const groupedPizzas = pizzas.reduce((acc, pizza) => {
    if (!acc[pizza.category]) {
      acc[pizza.category] = [];
    }
    acc[pizza.category].push(pizza);
    return acc;
  }, {} as Record<string, SpecialtyPizza[]>);

  // Category color mapping for Boston theme
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'CLASSIC': 'from-green-600 to-green-700',
      'PREMIUM': 'from-orange-600 to-red-600',
      'VEGETARIAN': 'from-emerald-500 to-green-600',
      'VEGAN': 'from-green-500 to-emerald-600',
      'MEAT_LOVERS': 'from-red-600 to-orange-700',
      'SPECIALTY': 'from-orange-500 to-yellow-600'
    };
    return colors[category] || 'from-gray-600 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
      {/* Hero Section */}
      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-orange-400">Signature</span> Pizzas
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Handcrafted specialty pizzas with authentic Boston flavor. Each recipe perfected with 
            locally-sourced ingredients and traditional techniques from the North End.
          </p>
        </div>
      </div>

      {/* Specialty Pizzas */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="text-white text-xl">Loading our delicious specialty pizzas...</div>
          </div>
        ) : pizzas.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 text-xl">No specialty pizzas available at the moment.</div>
            <Link 
              href="/pizza-builder"
              className="inline-block mt-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
            >
              Create Custom Pizza Instead
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedPizzas).map(([category, categoryPizzas]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="text-center mb-8">
                  <h2 className={`inline-block text-2xl md:text-3xl font-bold text-white bg-gradient-to-r ${getCategoryColor(category)} px-6 py-3 rounded-lg shadow-lg`}>
                    {category.replace('_', ' ')} ({categoryPizzas.length})
                  </h2>
                </div>

                {/* Pizza Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryPizzas.map((pizza) => (
                    <div 
                      key={pizza.id} 
                      className="bg-slate-800/90 rounded-lg overflow-hidden shadow-xl border border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      {/* Pizza Image */}
                      {pizza.imageUrl ? (
                        <div className="w-full h-48 relative overflow-hidden">
                          <img 
                            src={pizza.imageUrl} 
                            alt={pizza.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              // Fallback to pizza emoji if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-green-500/30 flex items-center justify-center" style={{display: 'none'}}>
                            <span className="text-6xl">🍕</span>
                          </div>
                          {/* Image overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-orange-500/30 to-green-500/30 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-6xl mb-2 block">🍕</span>
                            <p className="text-white/60 text-sm">No image available</p>
                          </div>
                        </div>
                      )}

                      {/* Pizza Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-white">{pizza.name}</h3>
                          <span className="text-2xl font-bold text-green-400">
                            ${getPizzaPrice(pizza).toFixed(2)}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                          {pizza.description}
                        </p>

                        {/* Size Selection */}
                        {pizza.sizes && pizza.sizes.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Size:</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {pizza.sizes.map((sizeOption) => (
                                <button
                                  key={sizeOption.pizzaSize.id}
                                  onClick={() => setSelectedSizes(prev => ({
                                    ...prev,
                                    [pizza.id]: sizeOption.pizzaSize.id
                                  }))}
                                  className={`p-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    selectedSizes[pizza.id] === sizeOption.pizzaSize.id
                                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-2 border-green-400'
                                      : 'bg-slate-700 text-gray-300 border-2 border-slate-600 hover:bg-slate-600'
                                  }`}
                                >
                                  <div className="text-center">
                                    <div className="font-bold">{sizeOption.pizzaSize.name}</div>
                                    <div className="text-xs opacity-75">{sizeOption.pizzaSize.diameter}</div>
                                    <div className="text-xs text-green-400 font-bold">${sizeOption.price.toFixed(2)}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Ingredients */}
                        {pizza.ingredients && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Ingredients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {parseIngredients(pizza.ingredients).map((ingredient, index) => (
                                <span 
                                  key={index}
                                  className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full border border-slate-600"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Link
                            href={`/pizza-builder?specialty=${pizza.id}&size=${selectedSizes[pizza.id] || ''}`}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                          >
                            🛠️ Customize
                          </Link>
                          <button
                            onClick={() => addToCart(pizza)}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                          >
                            🛒 Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-black/40 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-300 mb-6">
            Create your own custom pizza with our interactive pizza builder!
          </p>
          <Link
            href="/pizza-builder"
            className="inline-block bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105"
          >
            🍕 Build Custom Pizza
          </Link>
        </div>
      </div>
    </div>
  );
}
