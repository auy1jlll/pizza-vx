'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, MapPin, Clock, Phone, Star, Menu, X } from 'lucide-react';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: MenuCategory[];
  _count?: {
    menuItems: number;
  };
}

export default function ProfessionalNavbar() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppSettingsContext();
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      const response = await fetch(`/api/menu/categories`, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for better error handling
        signal: AbortSignal.timeout(15000) // 15 second timeout for better reliability
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // The API returns data.data, not just data
        const filteredCategories = filterCategoriesWithItems(data.data);
        setCategories(filteredCategories);
        
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Professional Navbar - Categories loaded:', {
            total: filteredCategories.length,
            categories: filteredCategories.map(c => ({
              name: c.name,
              itemCount: c._count?.menuItems || 0,
              subcategoryCount: c.subcategories?.length || 0
            }))
          });
        }
      } else {
        throw new Error(data.error || 'Failed to load categories');
      }
    } catch (err) {
      console.error('❌ Error loading categories:', err);
      
      // Retry logic - retry up to 2 times with delay
      if (retryCount < 2) {
        console.log(`🔄 Retrying... attempt ${retryCount + 1}/2`);
        setTimeout(() => {
          fetchCategories(retryCount + 1);
        }, 2000); // 2 second delay before retry
        return;
      }
      
      if (err instanceof Error) {
        if (err.name === 'TimeoutError') {
          setError('Connection timeout - please refresh the page');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Network error - please check your connection');
        } else {
          setError(`Error loading menu: ${err.message}`);
        }
      } else {
        setError('Unknown error occurred loading menu');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterCategoriesWithItems = (categories: MenuCategory[]): MenuCategory[] => {
    return categories.filter(category => {
      const categoryItemCount = category._count?.menuItems || 0;
      const subcategoryItemCount = category.subcategories?.reduce((sum, sub) => 
        sum + (sub._count?.menuItems || 0), 0) || 0;
      
      const totalItems = categoryItemCount + subcategoryItemCount;
      return totalItems > 0;
    });
  };

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  // Add refresh function for testing
  const refreshCategories = () => {
    console.log('🔄 Manual refresh triggered');
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-3xl border border-orange-100 overflow-hidden">
        <div className="px-6 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-xl rounded-3xl border border-red-100 overflow-hidden">
        <div className="px-6 py-4 text-center">
          <div className="text-red-600 mb-2">{error}</div>
          <button 
            onClick={() => fetchCategories()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-800 shadow-xl border-0 border-t-0 overflow-visible relative z-50 mt-0">
      <nav className="px-6 py-2 relative z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {settings.appLogoUrl ? (
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src={settings.appLogoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-4xl">🍕</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {(settings?.app_name || 'Restaurant Name').replace(/[^\w\s-]/g, ' ')}
              </h1>
              <p className="text-xs text-orange-200 font-semibold">
                {(settings?.app_tagline || 'Delicious Food').replace(/[^\w\s-]/g, ' ')}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Full Menu Link */}
            <Link
              href="/menu"
              className="relative font-semibold text-white hover:text-orange-300 transition-all duration-300 hover:scale-105"
            >
              Full Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-300 to-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Dynamic Categories */}
            {categories.map((category) => {
              const hasSubcategories = category.subcategories && category.subcategories.length > 0;
              const isDropdownOpen = openDropdown === category.id;

              return (
                <div key={category.id} className="relative group"
                     onMouseEnter={() => hasSubcategories && setOpenDropdown(category.id)}
                     onMouseLeave={(e) => {
                       if (hasSubcategories) {
                         // Only close if mouse is not moving to the dropdown
                         const rect = e.currentTarget.getBoundingClientRect();
                         const mouseX = e.clientX;
                         const mouseY = e.clientY;
                         
                         // Add a small delay to allow mouse to reach dropdown
                         setTimeout(() => {
                           if (openDropdown === category.id) {
                             const dropdown = document.querySelector(`[data-dropdown="${category.id}"]`);
                             if (dropdown && !dropdown.matches(':hover')) {
                               setOpenDropdown(null);
                             }
                           }
                         }, 150);
                       }
                     }}>
                  {hasSubcategories ? (
                    <div>
                      {/* Category with dropdown */}
                      <button
                        onMouseEnter={() => setOpenDropdown(category.id)}
                        className="flex items-center space-x-1 font-semibold text-white hover:text-orange-300 transition-all duration-300 hover:scale-105 cursor-pointer relative z-50"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <span>{category.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Professional Dropdown */}
                      {isDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[99999] min-w-[280px] overflow-visible pointer-events-auto" 
                          style={{ zIndex: 99999 }}
                          data-dropdown={category.id}
                          onMouseEnter={() => setOpenDropdown(category.id)}
                          onMouseLeave={() => {
                            setTimeout(() => setOpenDropdown(null), 100);
                          }}
                        >
                          <div className="py-2 pointer-events-auto">
                            {/* Parent category link */}
                            <Link
                              href={`/menu/${category.slug}`}
                              className="block px-6 py-4 text-gray-800 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 font-semibold border-b border-gray-50 transition-all duration-200"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">🍽️</span>
                                  <span>All {category.name}</span>
                                </div>
                              </div>
                            </Link>
                            
                            {/* Subcategory links */}
                            {category.subcategories?.map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/menu/${subcategory.slug}`}
                                className="block px-8 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-gray-800 text-sm transition-all duration-200"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm">•</span>
                                    <span>{subcategory.name}</span>
                                  </div>
                                  {subcategory._count?.menuItems && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                      {subcategory._count.menuItems}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Simple category link
                    <Link
                      href={`/menu/${category.slug}`}
                      className="relative font-semibold text-white hover:text-orange-300 transition-all duration-300 hover:scale-105"
                    >
                      {category.name}
                      {category._count?.menuItems && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {category._count.menuItems}
                        </span>
                      )}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Temporary Debug Refresh Button */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={refreshCategories}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                title="Refresh Categories"
              >
                🔄
              </button>
            )}

            {/* Cart - Hidden, using FloatingCartButton instead */}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-orange-300 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-6 pt-6 border-t border-orange-100">
            <div className="space-y-4">
              {/* Full Menu */}
              <Link
                href="/menu"
                className="block text-lg font-semibold transition-colors duration-200 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Full Menu
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">HOT</span>
              </Link>

              {/* Categories */}
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <Link
                    href={`/menu/${category.slug}`}
                    className="block text-lg font-semibold text-white hover:bg-green-500 hover:text-white transition-colors duration-200 py-3 px-4 rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                    {category._count?.menuItems && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {category._count.menuItems}
                      </span>
                    )}
                  </Link>
                  
                  {/* Mobile Subcategories */}
                  {category.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/menu/${subcategory.slug}`}
                      className="block text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 py-2 px-8 rounded-lg ml-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      • {subcategory.name}
                      {subcategory._count?.menuItems && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {subcategory._count.menuItems}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
              
              {/* Mobile Store Info */}
              <div className="pt-4 border-t border-orange-100 space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Find Location</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
