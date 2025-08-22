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

  // Fetch specialty calzones
  const fetchSpecialtyPizzas = async (calzoneData?: any) => {
    try {
      const response = await fetch('/api/specialty-pizzas');
      if (response.ok) {
        const data = await response.json();
        // Filter to only show calzones
        const calzonesOnly = Array.isArray(data) ? data.filter((item: SpecialtyPizza) => 
          item.category === 'CALZONE'
        ) : [];
        setPizzas(calzonesOnly);
        
        // Set default sizes to the first available calzone size for each pizza
        const defaultSizes: Record<string, string> = {};
        calzonesOnly.forEach((pizza: SpecialtyPizza) => {
          // Use the pizza's own sizes
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
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // First fetch calzone data
      const calzoneData = await (async () => {
        try {
          const response = await fetch('/api/pizza-data?productType=calzone');
          if (response.ok) {
            const data = await response.json();
            setPizzaData(data);
            return data;
          } else {
            console.error('Failed to fetch calzone data');
            return null;
          }
        } catch (error) {
          console.error('Error fetching calzone data:', error);
          return null;
        }
      })();
      
      // Then fetch specialty pizzas using the calzone data
      await fetchSpecialtyPizzas(calzoneData);
      
      setLoading(false);
    };
    loadData();
  }, []); // Only run once on mount

  // Get selected calzone size for a pizza
  const getSelectedCalzoneSize = (pizza: SpecialtyPizza) => {
    const selectedSizeId = selectedSizes[pizza.id];
    const sizeOption = pizza.sizes?.find((s: any) => s.pizzaSize.id === selectedSizeId);
    return sizeOption?.pizzaSize;
  };

  // Get price for selected calzone size
  const getCalzonePrice = (pizza: SpecialtyPizza): number => {
    const selectedSizeId = selectedSizes[pizza.id];
    const sizeOption = pizza.sizes?.find((s: any) => s.pizzaSize.id === selectedSizeId);
    return sizeOption?.price || pizza.basePrice;
  };

  // Handle size selection
  const handleSizeSelect = (pizzaId: string, sizeId: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [pizzaId]: sizeId
    }));
  };

  // Handle quick add to cart
  const handleQuickAdd = (pizza: SpecialtyPizza) => {
    const selectedSize = getSelectedCalzoneSize(pizza);
    if (!selectedSize || !pizzaData) {
      showToast('Please select a size first');
      return;
    }

    // Find default components
    const defaultCrust = pizzaData.crusts?.[0];
    const defaultSauce = pizzaData.sauces?.[0];

    addDetailedPizza({
      size: selectedSize,
      crust: defaultCrust,
      sauce: defaultSauce,
      sauceIntensity: 'REGULAR',
      crustCookingLevel: 'REGULAR',
      toppings: [],
      notes: `Specialty Calzone: ${pizza.name}`,
      totalPrice: getCalzonePrice(pizza),
      specialtyPizzaName: `${pizza.name} Calzone`
    });

    showToast(`${pizza.name} Calzone added to cart! 🥟`);
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
                  {pizza.sizes && pizza.sizes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Choose Size:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {pizza.sizes.map((sizeOption: any) => (
                          <button
                            key={sizeOption.pizzaSize.id}
                            onClick={() => handleSizeSelect(pizza.id, sizeOption.pizzaSize.id)}
                            className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                              selectedSizes[pizza.id] === sizeOption.pizzaSize.id
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div>{sizeOption.pizzaSize.name}</div>
                            <div className="text-xs text-gray-500">${sizeOption.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">
                        ${getCalzonePrice(pizza).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">starting</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickAdd(pizza)}
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
