'use client';

import { useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star, Clock } from 'lucide-react';

interface SpecialtyPizzaSize {
  id: string;
  price: number;
  isAvailable: boolean;
  pizzaSize: {
    id: string;
    name: string;
    diameter: string;
    basePrice: number;
    description?: string | null;
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

interface GourmetPizzasClientProps {
  initialPizzas: SpecialtyPizza[];
  initialPizzaData: any;
}

export default function GourmetPizzasClient({ initialPizzas, initialPizzaData }: GourmetPizzasClientProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    // Initialize with the first available size for each pizza
    const initialSizes: Record<string, string> = {};
    initialPizzas.forEach(pizza => {
      if (pizza.sizes && pizza.sizes.length > 0) {
        initialSizes[pizza.id] = pizza.sizes[0].id;
      }
    });
    return initialSizes;
  });
  const { show: showToast } = useToast();
  const { addDetailedPizza } = useCart();

  const handleSizeChange = (pizzaId: string, sizeId: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [pizzaId]: sizeId
    }));
  };

  const getPrice = (pizza: SpecialtyPizza) => {
    const selectedSizeId = selectedSizes[pizza.id];
    if (selectedSizeId && pizza.sizes) {
      const selectedSize = pizza.sizes.find(s => s.id === selectedSizeId);
      if (selectedSize) {
        return selectedSize.price;
      }
    }
    return pizza.basePrice;
  };

  const getPizzaCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'classic':
        return { color: 'from-red-600 to-red-700', icon: '🍕' };
      case 'traditional':
        return { color: 'from-green-600 to-green-700', icon: '🇮🇹' };
      case 'gourmet':
        return { color: 'from-purple-600 to-purple-700', icon: '⭐' };
      case 'meat':
        return { color: 'from-orange-600 to-orange-700', icon: '🥓' };
      case 'veggie':
        return { color: 'from-emerald-600 to-emerald-700', icon: '🥬' };
      default:
        return { color: 'from-gray-600 to-gray-700', icon: '🍴' };
    }
  };

  const addToCart = (pizza: SpecialtyPizza) => {
    const selectedSizeId = selectedSizes[pizza.id];
    
    if (!selectedSizeId) {
      showToast('Please select a size first');
      return;
    }

    const selectedSizeData = pizza.sizes?.find(s => s.id === selectedSizeId);
    if (!selectedSizeData) {
      showToast('Selected size not found');
      return;
    }

    // Get default crust and sauce objects (not just strings)
    const defaultCrust = initialPizzaData.crusts?.find((c: any) => c.isActive) || initialPizzaData.crusts?.[0];
    const defaultSauce = initialPizzaData.sauces?.find((s: any) => s.isActive) || initialPizzaData.sauces?.[0];
    
    // Create detailed pizza object for cart with proper object structures
    const pizzaForCart = {
      id: `specialty-${pizza.id}`,
      name: pizza.name,
      size: {
        id: selectedSizeData.pizzaSize.id,
        name: selectedSizeData.pizzaSize.name,
        diameter: selectedSizeData.pizzaSize.diameter,
        basePrice: selectedSizeData.pizzaSize.basePrice,
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
        id: 'default-crust',
        name: 'Traditional',
        description: 'Traditional crust',
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
        id: 'default-sauce',
        name: 'Marinara',
        description: 'Traditional marinara sauce',
        color: '#FF0000',
        spiceLevel: 1,
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      toppings: [], // Specialty pizzas come with preset toppings
      quantity: 1,
      notes: `Specialty Pizza: ${pizza.name}`,
      basePrice: pizza.basePrice,
      totalPrice: selectedSizeData.price,
      isSpecialty: true,
      specialtyId: pizza.id,
      ingredients: pizza.ingredients,
      imageUrl: pizza.imageUrl,
      specialtyPizzaName: pizza.name // Ensure specialty pizza name is preserved
    };

    addDetailedPizza(pizzaForCart);
    showToast(`${pizza.name} added to cart!`);
  };

  if (!initialPizzas.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍕</div>
        <h3 className="text-2xl font-bold text-white mb-4">No Specialty Pizzas Available</h3>
        <p className="text-gray-300">Our specialty pizzas are being updated. Please check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {initialPizzas.map((pizza) => {
        const categoryInfo = getPizzaCategory(pizza.category);
        const price = getPrice(pizza);
        
        return (
          <div key={pizza.id} className="group">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-white/40">
              {/* Pizza Image/Icon */}
              <div className={`bg-gradient-to-br ${categoryInfo.color} p-8 relative overflow-hidden`}>
                <div className="absolute top-4 right-4 text-2xl">
                  {categoryInfo.icon}
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    🍕
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium inline-block">
                    {pizza.category}
                  </div>
                </div>
              </div>

              {/* Pizza Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                  {pizza.name}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {pizza.description}
                </p>

                {/* Ingredients */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-orange-400 mb-2 uppercase tracking-wide">
                    Ingredients
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {pizza.ingredients}
                  </p>
                </div>

                {/* Size Selection */}
                {pizza.sizes && pizza.sizes.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-orange-400 mb-2 uppercase tracking-wide">
                      Select Size
                    </div>
                    <div className="space-y-2">
                      {pizza.sizes.map((size) => (
                        <label 
                          key={size.id}
                          className="flex items-center justify-between p-2 bg-black/20 rounded-lg hover:bg-black/40 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`size-${pizza.id}`}
                              value={size.id}
                              checked={selectedSizes[pizza.id] === size.id}
                              onChange={() => handleSizeChange(pizza.id, size.id)}
                              className="text-orange-500 focus:ring-orange-500"
                            />
                            <div>
                              <div className="text-white text-sm font-medium">
                                {size.pizzaSize.name} ({size.pizzaSize.diameter})
                              </div>
                              {size.pizzaSize.description && (
                                <div className="text-gray-400 text-xs">
                                  {size.pizzaSize.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-orange-400 font-bold">
                            ${size.price.toFixed(2)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and Action Buttons */}
                <div className="pt-4 border-t border-white/10">
                  <div className="text-2xl font-bold text-orange-400 mb-4 text-center">
                    ${price.toFixed(2)}
                  </div>
                  
                  <div className="flex space-x-3">
                    <a
                      href={`/build-pizza?specialty=${pizza.id}&size=${selectedSizes[pizza.id] || ''}`}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <span>🛠️</span>
                      <span>Customize</span>
                    </a>
                    <button
                      onClick={() => addToCart(pizza)}
                      disabled={!selectedSizes[pizza.id] && pizza.sizes && pizza.sizes.length > 0}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
