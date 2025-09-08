'use client';

import { useState, useEffect } from 'react';

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  ingredients: string;
  sortOrder: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: SpecialtyPizza[];
}

export default function PizzaTestClient() {
  const [pizzas, setPizzas] = useState<SpecialtyPizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        console.log('🔄 Fetching pizzas from test API...');
        const response = await fetch('/api/pizza-test');
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          setPizzas(result.data);
          console.log(`✅ Loaded ${result.count} pizzas`);
        } else {
          setError('Failed to load pizzas');
        }
      } catch (err) {
        console.error('❌ Error fetching pizzas:', err);
        setError('Error fetching pizzas');
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading specialty pizzas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl">❌ {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍕 Specialty Pizza Test Page
          </h1>
          <p className="text-xl text-gray-600">
            Displaying {pizzas.length} Gourmet Specialty Pizzas from Database
          </p>
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Pizza Name & Category */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pizza.name}
                  </h3>
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                    {pizza.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {pizza.description}
                </p>

                {/* Ingredients */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h4>
                  <div className="text-sm text-gray-600">
                    {pizza.ingredients ? (
                      (() => {
                        try {
                          const ingredients = JSON.parse(pizza.ingredients);
                          return Array.isArray(ingredients) 
                            ? ingredients.join(', ')
                            : pizza.ingredients;
                        } catch {
                          return pizza.ingredients;
                        }
                      })()
                    ) : 'No ingredients listed'}
                  </div>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ${pizza.basePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Order #{pizza.sortOrder}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="bg-gray-50 px-6 py-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Test Page Information</h3>
            <p className="text-gray-600">
              This is a standalone test page that queries the specialty_pizzas table directly.
              API Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/pizza-test</code>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Total pizzas loaded: {pizzas.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
