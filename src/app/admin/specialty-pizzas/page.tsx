'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
}

interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
}

interface PizzaSauce {
  id: string;
  name: string;
  description: string;
  color: string;
  spiceLevel: number;
  priceModifier: number;
}

interface PizzaTopping {
  id: string;
  name: string;
  category: string;
  price: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

interface ComponentData {
  sizes: PizzaSize[];
  crusts: PizzaCrust[];
  sauces: PizzaSauce[];
  toppings: PizzaTopping[];
}

export default function SpecialtyPizzasAdmin() {
  const [data, setData] = useState<ComponentData>({
    sizes: [],
    crusts: [],
    sauces: [],
    toppings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ultra-optimized single API call for all components
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Single API call to fetch all components at once
      const response = await fetch('/api/admin/components');

      // Check authentication
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const componentData = await response.json();

      // Handle the combined response
      setData({
        sizes: Array.isArray(componentData.sizes) ? componentData.sizes : [],
        crusts: Array.isArray(componentData.crusts) ? componentData.crusts : [],
        sauces: Array.isArray(componentData.sauces) ? componentData.sauces : [],
        toppings: Array.isArray(componentData.toppings) ? componentData.toppings : []
      });

      // Log performance info if available
      if (componentData.meta) {
        console.log(`Loaded ${componentData.meta.totalComponents} components at ${componentData.meta.loadedAt}`);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load pizza components. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Specialty Pizzas</h1>
              <p className="mt-2 text-sm text-gray-700">Loading pizza components...</p>
            </div>
          </div>
          <div className="mt-8">
            <LoadingSkeleton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchAllData}
                    className="bg-red-100 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { sizes, crusts, sauces, toppings } = data;

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Specialty Pizzas</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage pre-configured specialty pizza combinations.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Create Specialty Pizza
            </button>
          </div>
        </div>

        <div className="mt-8">
          {/* Component Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📏</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pizza Sizes</dt>
                      <dd className="text-lg font-medium text-gray-900">{sizes.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  {sizes.length > 0 ? (
                    <span className="text-green-600">✓ Available</span>
                  ) : (
                    <span className="text-red-600">⚠ No sizes configured</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🍞</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Crusts</dt>
                      <dd className="text-lg font-medium text-gray-900">{crusts.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  {crusts.length > 0 ? (
                    <span className="text-green-600">✓ Available</span>
                  ) : (
                    <span className="text-red-600">⚠ No crusts configured</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🍅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Sauces</dt>
                      <dd className="text-lg font-medium text-gray-900">{sauces.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  {sauces.length > 0 ? (
                    <span className="text-green-600">✓ Available</span>
                  ) : (
                    <span className="text-red-600">⚠ No sauces configured</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🧀</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Toppings</dt>
                      <dd className="text-lg font-medium text-gray-900">{toppings.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  {toppings.length > 0 ? (
                    <span className="text-green-600">✓ Available</span>
                  ) : (
                    <span className="text-red-600">⚠ No toppings configured</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preview of Available Components */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Sizes</h3>
                <div className="mt-3">
                  {sizes.length > 0 ? (
                    <div className="space-y-2">
                      {sizes.slice(0, 3).map((size) => (
                        <div key={size.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="font-medium">{size.name}</span>
                          <span className="text-sm text-gray-500">{size.diameter}</span>
                        </div>
                      ))}
                      {sizes.length > 3 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          +{sizes.length - 3} more sizes available
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No sizes configured. Add some in the Sizes section.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Crusts</h3>
                <div className="mt-3">
                  {crusts.length > 0 ? (
                    <div className="space-y-2">
                      {crusts.slice(0, 3).map((crust) => (
                        <div key={crust.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div>
                            <span className="font-medium">{crust.name}</span>
                            {crust.description && <p className="text-sm text-gray-500">{crust.description}</p>}
                          </div>
                          <span className="text-sm text-gray-500">+${crust.priceModifier}</span>
                        </div>
                      ))}
                      {crusts.length > 3 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          +{crusts.length - 3} more crusts available
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No crusts configured. Add some in the Crusts section.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">System Ready</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    All components loaded successfully using optimized parallel fetching.
                    You can now create specialty pizza combinations.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{sizes.length} pizza sizes available</li>
                    <li>{crusts.length} crust options available</li>
                    <li>{sauces.length} sauce varieties available</li>
                    <li>{toppings.length} toppings to choose from</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
