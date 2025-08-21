'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    menuItems: number;
  };
}

export default function HybridNavigation() {
  const { settings, loading } = useAppSettingsContext();
  const [isHydrated, setIsHydrated] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/menu/categories');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Filter out Pizza categories and apply other filters
        const filteredCategories = result.data
          .filter((category: MenuCategory) => {
            // Exclude Pizza and specialty pizza categories
            const isPizzaCategory = category.slug === 'pizza' || 
                                  category.slug === 'specialty-pizza' ||
                                  category.slug.includes('pizza');
            
            // Exclude inactive categories
            if (!category.isActive) return false;
            
            // Optionally exclude empty categories
            if (category._count?.menuItems === 0) {
              return false;
            }
            
            return !isPizzaCategory;
          })
          // Sort by sortOrder, then by name
          .sort((a: MenuCategory, b: MenuCategory) => {
            if (a.sortOrder !== b.sortOrder) {
              return a.sortOrder - b.sortOrder;
            }
            return a.name.localeCompare(b.name);
          });

        setCategories(filteredCategories);
      }
    } catch (err) {
      console.error('Error fetching categories for navbar:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Helper function to get category icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('sandwich') || name.includes('burger')) {
      return (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.5 7C2.5 5.9 3.4 5 4.5 5H19.5C20.6 5 21.5 5.9 21.5 7V8C21.5 9.1 20.6 10 19.5 10H4.5C3.4 10 2.5 9.1 2.5 8V7Z"/>
          <path d="M2.5 15C2.5 13.9 3.4 13 4.5 13H19.5C20.6 13 21.5 13.9 21.5 15V16C21.5 17.1 20.6 18 19.5 18H4.5C3.4 18 2.5 17.1 2.5 16V15Z"/>
        </svg>
      );
    }
    
    if (name.includes('sub')) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    }
    
    if (name.includes('salad')) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12l-1.5-5.5c-.5-2-2-3.5-4-3.5h-5c-2 0-3.5 1.5-4 3.5L4 12v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7z" />
        </svg>
      );
    }
    
    if (name.includes('seafood')) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2l6 6-4 4-6-6 4-4zM4 8l4 4-2 8-4-4 2-8z" />
        </svg>
      );
    }
    
    if (name.includes('dinner') || name.includes('plate')) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <circle cx="12" cy="12" r="6" strokeWidth={2} />
        </svg>
      );
    }
    
    if (name.includes('side')) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    }
    
    // Default icon
    return (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  };

  // Helper function to get category descriptions
  const getCategoryDescription = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('sandwich') || name.includes('burger')) {
      return 'Fresh ingredients & bold flavors';
    }
    
    if (name.includes('cold') && name.includes('sub')) {
      return 'Fresh cold subs & hoagies';
    }
    
    if (name.includes('hot') && name.includes('sub')) {
      return 'Warm, toasted submarine sandwiches';
    }
    
    if (name.includes('salad')) {
      return 'Fresh greens & garden varieties';
    }
    
    if (name.includes('seafood') && name.includes('plate')) {
      return 'Fresh seafood dinner plates';
    }
    
    if (name.includes('seafood') && name.includes('box')) {
      return 'Seafood combo boxes & meals';
    }
    
    if (name.includes('dinner') && name.includes('plate')) {
      return 'Hearty dinner plates & entrees';
    }
    
    if (name.includes('side')) {
      return 'Appetizers & side dishes';
    }
    
    return 'Delicious menu options';
  };

  // During SSR and before hydration, show a consistent placeholder
  const appName = isHydrated && !loading
    ? (settings.app_name || settings.business_name || 'Omar Pizza')
    : 'Omar Pizza';

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
              🍕 <span className="text-orange-300">{appName}</span>
            </Link>
            {isHydrated && settings.app_tagline && (
              <p className="text-sm text-green-200 italic ml-8">
                {settings.app_tagline}
              </p>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Static Item 1: Home (Always first) */}
            <Link 
              href="/" 
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Home
            </Link>

            {/* Dynamic Menu Categories Dropdown */}
            <div className="relative">
              <button
                className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-1"
                onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
                onMouseEnter={() => setMenuDropdownOpen(true)}
              >
                Menu
                <ChevronDown className={`h-4 w-4 transition-transform ${menuDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {menuDropdownOpen && (
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[500px] z-50"
                  onMouseLeave={() => setMenuDropdownOpen(false)}
                >
                  {/* Elegant header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Our Menu Categories
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Discover our delicious offerings</p>
                  </div>

                  {categoriesLoading ? (
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : categories.length > 0 ? (
                    <div className="p-4">
                      {/* Two-column grid for categories */}
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/menu/${category.slug}`}
                            className="group relative block p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 border border-transparent hover:border-orange-200 hover:shadow-md"
                            onClick={() => setMenuDropdownOpen(false)}
                          >
                            <div className="flex items-center space-x-3">
                              {/* Category Icon */}
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                                {getCategoryIcon(category.name)}
                              </div>
                              
                              {/* Category Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                                  {category.name}
                                </p>
                                <p className="text-xs text-gray-500 group-hover:text-orange-500 transition-colors line-clamp-2">
                                  {category.description || getCategoryDescription(category.name)}
                                </p>
                              </div>
                              
                              {/* Arrow indicator */}
                              <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {/* Footer with call-to-action */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href="/menu"
                          className="flex items-center justify-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-orange-50"
                          onClick={() => setMenuDropdownOpen(false)}
                        >
                          <span>Browse Full Menu</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-gray-500">No menu categories available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Static Item 2: Pizza Builder (Kept separate) */}
            {(isHydrated ? settings.enable_pizza_builder : true) && (
              <Link 
                href="/build-pizza" 
                className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10 border border-orange-400/50 hover:border-orange-300"
              >
                🍕 Pizza Builder
              </Link>
            )}

            {/* Additional Static Items */}
            <Link 
              href="/cart" 
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Cart
            </Link>

            {/* Static Item 3: Login/Sign Up (Always last) */}
            <AuthNav />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-orange-300 transition-colors p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-green-600 py-4">
            <div className="space-y-2">
              {/* Static Item 1: Home */}
              <Link 
                href="/" 
                className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Dynamic Menu Categories */}
              <div className="space-y-1">
                <div className="text-white font-medium px-3 py-2 text-sm uppercase tracking-wide flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Menu Categories
                </div>
                {categoriesLoading ? (
                  <div className="px-3 py-2">
                    <div className="animate-pulse space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-white/20 rounded mb-1"></div>
                            <div className="h-3 bg-white/20 rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/menu/${category.slug}`}
                      className="group flex items-center space-x-3 text-white hover:text-orange-300 transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10 text-sm mx-2 border border-transparent hover:border-orange-400/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {/* Category Icon */}
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        {getCategoryIcon(category.name)}
                      </div>
                      
                      {/* Category Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{category.name}</div>
                        <div className="text-xs text-white/70 group-hover:text-orange-200 transition-colors">
                          {category.description || getCategoryDescription(category.name)}
                        </div>
                      </div>
                      
                      {/* Arrow indicator */}
                      <svg className="w-4 h-4 text-white/50 group-hover:text-orange-300 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-white/70 text-sm">No menu categories available</p>
                  </div>
                )}
              </div>

              {/* Static Item 2: Pizza Builder */}
              {(isHydrated ? settings.enable_pizza_builder : true) && (
                <Link 
                  href="/build-pizza" 
                  className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10 border border-orange-400/50 hover:border-orange-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🍕 Pizza Builder
                </Link>
              )}

              <Link 
                href="/cart" 
                className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart
              </Link>

              {/* Static Item 3: Auth (Mobile version) */}
              <div className="pt-2 border-t border-green-600 mt-4">
                <AuthNav isMobile={true} onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
