'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Star, Utensils, ShoppingCart } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  menuItems?: any[];
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchCategories();
    updateCartCount();
    
    // Listen for cart updates
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('menuCart') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCartItemCount(count);
    } catch {
      setCartItemCount(0);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/menu/categories');
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Failed to load menu categories');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'sandwiches':
        return '🥪';
      case 'salads':
        return '🥗';
      case 'seafood':
        return '🦞';
      case 'dinner-plates':
        return '🍽️';
      default:
        return '🍴';
    }
  };

  const getCategoryGradient = (slug: string) => {
    switch (slug) {
      case 'sandwiches':
        return 'from-yellow-600 to-orange-600';
      case 'salads':
        return 'from-green-600 to-emerald-600';
      case 'seafood':
        return 'from-blue-600 to-cyan-600';
      case 'dinner-plates':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading menu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-300 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={fetchCategories}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          {/* Cart Indicator */}
          {cartItemCount > 0 && (
            <div className="absolute top-4 right-4">
              <Link href="/cart" className="relative">
                <div className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                </div>
              </Link>
            </div>
          )}
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Our <span className="text-orange-400">Full Menu</span>
            </h1>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
              From fresh pizzas to hearty sandwiches, crisp salads to seafood specialties - 
              discover our complete selection of Boston-inspired dishes.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Fresh daily</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <span>Local ingredients</span>
              </div>
              <div className="flex items-center">
                <Utensils className="w-4 h-4 mr-2" />
                <span>Made to order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pizza Section (Existing System) */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🍕 <span className="text-orange-400">Pizza</span> (Our Specialty!)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link 
              href="/pizza-builder"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-orange-600 p-6 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    🍕 Build Your Pizza
                  </h3>
                  <p className="text-red-100 mb-4">
                    Create your perfect custom pizza with our interactive builder
                  </p>
                  <div className="text-white font-semibold">
                    Start Building →
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-white/70 group-hover:text-white transition-colors" />
              </div>
            </Link>

            <Link 
              href="/specialty-pizzas"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/25"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    🍀 Specialty Pizzas
                  </h3>
                  <p className="text-green-100 mb-4">
                    Discover our signature Boston-inspired pizza creations
                  </p>
                  <div className="text-white font-semibold">
                    View Specials →
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-white/70 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* New Menu Categories */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🍽️ <span className="text-green-400">Additional Menu</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/menu/${category.slug}`}
                className="group relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 hover:border-white/40 p-6 hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryGradient(category.slug)} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl mb-2">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {category.menuItems?.length || 0} items
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                      Browse Menu
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Mix & Match Your Order
            </h3>
            <p className="text-gray-300 mb-6">
              Combine pizzas, sandwiches, salads, and more in a single order. 
              Everything goes into the same cart for easy checkout!
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full border border-orange-600/30">
                🍕 Pizza + 🥪 Sandwich
              </span>
              <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full border border-green-600/30">
                🥗 Salad + 🦞 Seafood
              </span>
              <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full border border-blue-600/30">
                🍽️ Complete Meals
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
