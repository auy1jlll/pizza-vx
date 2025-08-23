'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Star, Utensils, ShoppingCart } from 'lucide-react';
import { designSystem, components, animations, responsive } from '../../lib/design-system';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          {/* Cart Indicator - Floating */}
          {cartItemCount > 0 && (
            <div className="fixed top-6 right-6 z-50">
              <Link href="/cart" className="relative group">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/25 backdrop-blur-sm border border-white/20">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {cartItemCount}
                  </span>
                </div>
              </Link>
            </div>
          )}
          
          {/* Hero Content */}
          <div className="min-h-screen flex items-center justify-center text-center relative">
            {/* Main Hero */}
            <div className="max-w-6xl mx-auto">
              {/* Floating Badge */}
              <div className={`${components.badge.floating}`}>
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Local Favorite Restaurant
                <Star className="w-4 h-4 ml-2 text-yellow-400" />
              </div>

              {/* Main Title */}
              <h1 className={`${responsive.text.display} font-bold text-white mb-6 tracking-tight leading-none`}>
                Our Full
                <br />
                <span className={`${animations.textGradientShift}`}>
                  Menu
                </span>
              </h1>

              {/* Subtitle */}
              <p className={`${responsive.text.subtitle} text-white/80 mb-12 max-w-3xl mx-auto font-light`}>
                From 650 degree oven pizzas to fresh seafood rolls, crisp salads to hearty dinner plates — 
                discover our complete selection of <span className="text-orange-400 font-semibold">local inspired dishes</span>
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
                <div className={`${components.badge.primary} ${animations.slideInLeft}`}>
                  <Clock className="w-5 h-5 mr-3 text-green-400" />
                  <span className="font-medium">Made Fresh Daily</span>
                </div>
                <div className={`${components.badge.secondary} ${animations.slideInUp}`}>
                  <Star className="w-5 h-5 mr-3 text-yellow-400" />
                  <span className="font-medium">Local Ingredients</span>
                </div>
                <div className={`${components.badge.neutral} ${animations.slideInRight}`}>
                  <Utensils className="w-5 h-5 mr-3 text-orange-400" />
                  <span className="font-medium">Made to Order</span>
                </div>
              </div>

              {/* CTA Scroll Indicator */}
              <div className="animate-bounce">
                <div className="mx-auto w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                </div>
                <p className="text-white/60 text-sm mt-2 font-medium">Scroll to explore menu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pizza Section - Featured with Glass Morphism */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6 shadow-xl">
              🍕 Our Specialty
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Pizza Perfection
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Hand-tossed dough, premium ingredients, 650 degree oven perfection
            </p>
          </div>

          {/* Pizza Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Link 
              href="/build-pizza"
              className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-red-500/25 hover:bg-white/15"
            >
              {/* Floating Pizza Icon */}
              <div className="absolute top-6 right-6 text-6xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 rotate-12 group-hover:rotate-0">
                🍕
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl">🔥</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors">
                  Build Your Pizza
                </h3>
                
                <p className="text-white/70 mb-6 text-lg leading-relaxed group-hover:text-white/90 transition-colors">
                  Create your perfect custom pizza with our interactive builder. 
                  Choose from premium toppings, artisan crusts, and signature sauces.
                </p>
                
                <div className="flex items-center text-orange-400 font-semibold text-lg group-hover:text-orange-300 transition-colors">
                  <span>Start Building</span>
                  <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-orange-600/0 group-hover:from-red-600/10 group-hover:to-orange-600/10 transition-all duration-500 rounded-3xl"></div>
            </Link>

            <Link 
              href="/gourmet-pizzas"
              className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-green-500/25 hover:bg-white/15"
            >
              {/* Floating Specialty Icon */}
              <div className="absolute top-6 right-6 text-6xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 rotate-12 group-hover:rotate-0">
                🍀
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors">
                  Specialty Pizzas
                </h3>
                
                <p className="text-white/70 mb-6 text-lg leading-relaxed group-hover:text-white/90 transition-colors">
                  Discover our signature local pizza creations. 
                  Chef-crafted combinations with local flavors and premium ingredients.
                </p>
                
                <div className="flex items-center text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors">
                  <span>View Specials</span>
                  <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 transition-all duration-500 rounded-3xl"></div>
            </Link>

            {/* Specialty Calzones Card */}
            <Link 
              href="/specialty-calzones"
              className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-amber-500/25 hover:bg-white/15"
            >
              {/* Floating Calzone Icon */}
              <div className="absolute top-6 right-6 text-6xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 rotate-12 group-hover:rotate-0">
                🥟
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl">🥟</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                  Specialty Calzones
                </h3>
                
                <p className="text-white/70 mb-6 text-lg leading-relaxed group-hover:text-white/90 transition-colors">
                  Folded pizza perfection with our signature recipes. 
                  Hand-folded dough filled with premium ingredients and melted cheese.
                </p>
                
                <div className="flex items-center text-amber-400 font-semibold text-lg group-hover:text-amber-300 transition-colors">
                  <span>View Calzones</span>
                  <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 to-orange-600/0 group-hover:from-amber-600/10 group-hover:to-orange-600/10 transition-all duration-500 rounded-3xl"></div>
            </Link>
          </div>
        </div>
      </div>

        {/* Additional Menu Categories - Enhanced Glass Morphism */}
        <div className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6 shadow-xl">
                🍽️ Complete Menu
              </div>
              <h2 className={`${responsive.text.hero} font-bold text-white mb-6`}>
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  More Delicious Options
                </span>
              </h2>
              <p className={`${responsive.text.body} text-white/70 max-w-2xl mx-auto`}>
                From fresh sandwiches to crisp salads, discover our full range of local favorites
              </p>
            </div>

            {/* Category Cards Grid */}
            <div className={`${responsive.grid.tablet} max-w-6xl mx-auto`}>
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/menu/${category.slug}`}
                  className={`${components.card.magnetic} ${animations.fadeIn}`}
                  style={animations.staggered(index)}
                >
                  {/* Floating Category Icon */}
                  <div className={`${components.icon.floating} absolute top-6 right-6`}>
                    {getCategoryIcon(category.slug)}
                  </div>
                  
                  {/* Gradient Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryGradient(category.slug)} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  <div className="relative z-10 p-8">
                    {/* Category Icon Badge */}
                    <div className={`${components.icon.interactive} mb-6`} style={{
                      background: `linear-gradient(to right, ${getCategoryGradient(category.slug).replace('from-', '').replace('to-', '').split(' ').join(', ')})`
                    }}>
                      <span className="text-2xl filter brightness-110">
                        {getCategoryIcon(category.slug)}
                      </span>
                    </div>
                    
                    {/* Category Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`${designSystem.h2} text-white mb-2 group-hover:text-orange-300 transition-colors`}>
                          {category.name}
                        </h3>
                        <div className={`${designSystem.small} text-white/60 font-medium`}>
                          {category.menuItems?.length || 0} delicious items
                        </div>
                      </div>
                    </div>
                    
                    <p className={`${designSystem.body} text-white/70 mb-6 group-hover:text-white/90 transition-colors`}>
                      {category.description}
                    </p>
                    
                    <div className={`${designSystem.body} flex items-center text-green-400 font-semibold group-hover:text-green-300 transition-colors`}>
                      <span>Explore Menu</span>
                      <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action - Enhanced */}
        <div className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-12 shadow-2xl">
                {/* Floating Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8 shadow-xl">
                    🎯 Pro Tip
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Mix & Match Your 
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"> Perfect Order</span>
                  </h3>
                  
                  <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Combine pizzas, sandwiches, salads, and more in a single order. 
                    Everything goes into the same cart for easy checkout and delivery!
                  </p>
                  
                  {/* Combination Examples */}
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <span className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-orange-500/30 text-orange-300 font-medium shadow-lg hover:scale-105 transition-transform">
                      🍕 Pizza + 🥪 Sandwich
                    </span>
                    <span className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-green-500/30 text-green-300 font-medium shadow-lg hover:scale-105 transition-transform">
                      🥗 Salad + 🦞 Seafood
                    </span>
                    <span className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-blue-500/30 text-blue-300 font-medium shadow-lg hover:scale-105 transition-transform">
                      🍽️ Complete Meals
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
