'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface UserPreferences {
  defaultOrderType: 'PICKUP' | 'DELIVERY';
  defaultAddress?: string;
  defaultCity?: string;
  defaultZip?: string;
  favoriteSize?: string;
  favoriteCrust?: string;
  favoriteSauce?: string;
  dietaryRestrictions?: string;
  phone?: string;
}

interface FavoritePizza {
  id: string;
  name: string;
  size: string;
  crust: string;
  sauce: string;
  toppings: string[];
  createdAt: string;
}

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultOrderType: 'PICKUP'
  });
  const [favoritePizzas, setFavoritePizzas] = useState<FavoritePizza[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchUserPreferences();
      fetchFavoritePizzas();
    }
  }, [user, loading, router]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/customer/preferences', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences || { defaultOrderType: 'PICKUP' });
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  const fetchFavoritePizzas = async () => {
    try {
      const response = await fetch('/api/customer/favorites', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFavoritePizzas(data.favorites || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorite pizzas:', error);
    }
  };

  const savePreferences = async () => {
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/customer/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
        credentials: 'include'
      });

      if (response.ok) {
        setSuccess('Preferences saved successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save preferences');
      }
    } catch (error) {
      setError('Failed to save preferences');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Preferences Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Order Preferences</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Edit Preferences
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserPreferences(); // Reset changes
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePreferences}
                    disabled={saveLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Order Type
                </label>
                {isEditing ? (
                  <select
                    value={preferences.defaultOrderType}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      defaultOrderType: e.target.value as 'PICKUP' | 'DELIVERY'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="PICKUP">Pickup</option>
                    <option value="DELIVERY">Delivery</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{preferences.defaultOrderType}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={preferences.phone || ''}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      phone: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="text-gray-900">{preferences.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Default Address (if delivery preference) */}
              {(preferences.defaultOrderType === 'DELIVERY' || isEditing) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={preferences.defaultAddress || ''}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          defaultAddress: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="123 Main Street"
                      />
                    ) : (
                      <p className="text-gray-900">{preferences.defaultAddress || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={preferences.defaultCity || ''}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          defaultCity: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Boston"
                      />
                    ) : (
                      <p className="text-gray-900">{preferences.defaultCity || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={preferences.defaultZip || ''}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          defaultZip: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="02101"
                      />
                    ) : (
                      <p className="text-gray-900">{preferences.defaultZip || 'Not provided'}</p>
                    )}
                  </div>
                </>
              )}

              {/* Dietary Restrictions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions / Allergies
                </label>
                {isEditing ? (
                  <textarea
                    value={preferences.dietaryRestrictions || ''}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      dietaryRestrictions: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Any allergies or dietary restrictions..."
                  />
                ) : (
                  <p className="text-gray-900">{preferences.dietaryRestrictions || 'None specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Favorite Pizzas Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Favorite Pizzas</h2>
            {favoritePizzas.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No favorite pizzas yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start building pizzas and save your favorites for quick reordering!
                </p>
                <div className="mt-6">
                  <a
                    href="/pizza-builder"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Build Your First Pizza
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritePizzas.map((pizza) => (
                  <div key={pizza.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{pizza.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {pizza.size} • {pizza.crust} • {pizza.sauce}
                    </p>
                    {pizza.toppings.length > 0 && (
                      <p className="text-sm text-gray-600 mb-3">
                        Toppings: {pizza.toppings.join(', ')}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Saved {new Date(pizza.createdAt).toLocaleDateString()}
                      </span>
                      <button className="text-sm text-orange-600 hover:text-orange-700">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="/order-history"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div>
                  <h3 className="font-medium text-blue-900">Order History</h3>
                  <p className="text-sm text-blue-700">View past orders</p>
                </div>
              </a>

              <a
                href="/pizza-builder"
                className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <h3 className="font-medium text-orange-900">Build Pizza</h3>
                  <p className="text-sm text-orange-700">Create custom pizza</p>
                </div>
              </a>

              <a
                href="/specialty-pizzas"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-green-900">Specialty Pizzas</h3>
                  <p className="text-sm text-green-700">Browse favorites</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
