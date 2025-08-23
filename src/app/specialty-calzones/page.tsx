'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

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

export default function SpecialtyCalzonesPage() {
  const [pizzas, setPizzas] = useState<SpecialtyPizza[]>([]);
  const [pizzaData, setPizzaData] = useState<any>(null); // Will store sizes, crusts, sauces, toppings
  const [loading, setLoading] = useState(true);
  const { show: showToast } = useToast();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const { addDetailedPizza } = useCart();

  // Fetch specialty calzones (filter for CALZONE category only)
  const fetchSpecialtyCalzones = async () => {
    try {
      const response = await fetch('/api/specialty-calzones');
      if (response.ok) {
        const data = await response.json();
        // Data is already filtered for calzones
        setPizzas(Array.isArray(data) ? data : []);
        
        // Set default sizes to the first available size for each calzone
        const defaultSizes: Record<string, string> = {};
        data.forEach((calzone: SpecialtyPizza) => {
          if (calzone.sizes && calzone.sizes.length > 0) {
            defaultSizes[calzone.id] = calzone.sizes[0].pizzaSize.id;
          }
        });
        setSelectedSizes(defaultSizes);
      } else {
        console.error('Failed to fetch specialty calzones');
        setPizzas([]);
      }
    } catch (error) {
      console.error('Error fetching specialty calzones:', error);
      setPizzas([]);
    }
  };

  // Fetch pizza data (sizes, crusts, sauces, toppings)
  const fetchPizzaData = async () => {
    try {
      const response = await fetch('/api/pizza-data');
      if (response.ok) {
        const data = await response.json();
        setPizzaData(data);
      } else {
        console.error('Failed to fetch pizza data');
      }
    } catch (error) {
      console.error('Error fetching pizza data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPizzaData(),
        fetchSpecialtyCalzones()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Get selected size for a calzone
  const getSelectedSize = (pizza: SpecialtyPizza): SpecialtyPizzaSize | undefined => {
    const selectedSizeId = selectedSizes[pizza.id];
    return pizza.sizes?.find(size => size.pizzaSize.id === selectedSizeId);
  };

  // Get price for selected size or fallback to base price
  const getPizzaPrice = (pizza: SpecialtyPizza): number => {
    const selectedSize = getSelectedSize(pizza);
    return selectedSize ? selectedSize.price : pizza.basePrice;
  };

  // Handle size selection
  const handleSizeSelect = (pizzaId: string, sizeId: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [pizzaId]: sizeId
    }));
  };

  // Add to cart function
  const addToCart = (pizza: SpecialtyPizza) => {
    if (!pizzaData) {
      showToast('Pizza data still loading. Try again in a moment.', { type: 'info' });
      return;
    }

    const selectedSize = getSelectedSize(pizza);
    const price = getPizzaPrice(pizza);
    
    // Get default crust and sauce from loaded pizza data
    const defaultCrust = pizzaData.crusts?.find((c: any) => c.isActive) || pizzaData.crusts?.[0];
    const defaultSauce = pizzaData.sauces?.find((s: any) => s.isActive) || pizzaData.sauces?.[0];
    
    // Parse ingredients and match with toppings
    const ingredientNames = parseIngredients(pizza.ingredients);
    const matchedToppings: Array<{
      id: string;
      name: string;
      category?: string;
      price: number;
      quantity: number;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
    }> = ingredientNames
      .map(ingredient => {
        // Try to find a matching topping by name (case-insensitive)
        const topping = pizzaData.toppings?.find((t: any) => 
          t.name.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(t.name.toLowerCase())
        );
        return topping ? {
          id: topping.id,
          name: topping.name,
          category: topping.category,
          price: topping.price || 0,
          quantity: 1,
          section: 'WHOLE' as const
        } : null;
      })
      .filter((topping): topping is NonNullable<typeof topping> => topping !== null);
    
    // Use the new CartItem format with real database data
    addDetailedPizza({
      size: selectedSize?.pizzaSize ? {
        id: selectedSize.pizzaSize.id,
        name: selectedSize.pizzaSize.name,
        diameter: selectedSize.pizzaSize.diameter,
        basePrice: selectedSize.pizzaSize.basePrice,
        isActive: true,
        sortOrder: 1
      } : {
        id: 'cmeb4wr360000vk9s8q3wu9o1', // Fallback Small size ID
        name: 'Small',
        diameter: '12"',
        basePrice: 12.99,
        isActive: true,
        sortOrder: 1
      },
      crust: defaultCrust ? {
        id: defaultCrust.id,
        name: defaultCrust.name,
        description: defaultCrust.description,
        priceModifier: defaultCrust.priceModifier,
        isActive: defaultCrust.isActive,
        sortOrder: defaultCrust.sortOrder
      } : {
        id: 'cmeacm01d0001vkvg7sz15lue', // Fallback Thin crust ID
        name: 'Thin',
        description: 'Thin crust',
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      sauce: defaultSauce ? {
        id: defaultSauce.id,
        name: defaultSauce.name,
        description: defaultSauce.description,
        color: defaultSauce.color,
        spiceLevel: defaultSauce.spiceLevel,
        priceModifier: defaultSauce.priceModifier,
        isActive: defaultSauce.isActive,
        sortOrder: defaultSauce.sortOrder
      } : {
        id: 'cmeafxdoj0003vkzcc66kq3nl', // Fallback Original sauce ID
        name: 'Original',
        description: 'Original sauce',
        color: '#FF0000',
        spiceLevel: 1,
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      toppings: matchedToppings, // Matched toppings from ingredients
      quantity: 1,
      notes: `Specialty Calzone: ${pizza.name}`,
      basePrice: pizza.basePrice || 12.99,
      totalPrice: price,
    });
    showToast(`${pizza.name} (${selectedSize?.pizzaSize.name || 'Medium'}) added to cart! 🥟`, { type: 'success' });
  };

  // Parse ingredients from JSON string
  const parseIngredients = (ingredientsStr: string): string[] => {
    try {
      return JSON.parse(ingredientsStr);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Specialty Calzones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amber-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🥟 Specialty Calzones</h1>
              <p className="text-amber-100">Folded pizza perfection with our signature recipes</p>
            </div>
            <Link 
              href="/build-calzone"
              className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Build Custom Calzone
            </Link>
          </div>
        </div>
      </div>

      {/* Pizzas Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {pizzas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🥟</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Specialty Calzones Available</h2>
            <p className="text-gray-600 mb-6">Check back soon for our delicious calzone specialties!</p>
            <Link 
              href="/build-calzone"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Build Your Own Calzone
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzas.map((pizza) => (
              <div key={pizza.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-amber-200 to-orange-200">
                  {pizza.imageUrl ? (
                    <img 
                      src={pizza.imageUrl} 
                      alt={`${pizza.name} Calzone`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-6xl text-amber-600 opacity-70">🥟</div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Calzone
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pizza.name} Calzone</h3>
                  <p className="text-gray-600 text-sm mb-4">{pizza.description}</p>
                  
                  {/* Ingredients */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Ingredients</p>
                    <p className="text-sm text-gray-700">{pizza.ingredients}</p>
                  </div>

                  {/* Size Selection */}
                  {pizzaData?.sizes && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Choose Size:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {pizzaData.sizes.map((size: any) => (
                          <button
                            key={size.id}
                            onClick={() => handleSizeSelect(pizza.id, size.id)}
                            className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                              selectedSizes[pizza.id] === size.id
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div>{size.name.replace(' Calzone', '')}</div>
                            <div className="text-xs text-gray-500">${size.basePrice}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">
                        ${getPizzaPrice(pizza).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">starting</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(pizza)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm"
                      >
                        Quick Add
                      </button>
                      <Link
                        href={`/build-calzone?specialty=${pizza.id}`}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
                      >
                        Customize
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
