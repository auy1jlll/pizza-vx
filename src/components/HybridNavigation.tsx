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

interface MenuStructure {
  [key: string]: {
    name: string;
    path?: string;
    icon: string;
    subcategories?: {
      name: string;
      slug: string;
      items?: number;
    }[];
  };
}

export default function HybridNavigation() {
  const { settings, loading } = useAppSettingsContext();
  const [isHydrated, setIsHydrated] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      fetchCategories();
    }
  }, [isHydrated]);

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

  // Define the new menu structure
  const getMenuStructure = (): MenuStructure => {
    if (!categories.length) return {};

    const structure: MenuStructure = {
      'subs-sandwiches': {
        name: 'Subs & Sandwiches',
        icon: '🥪',
        subcategories: [
          { name: 'Cold Subs', slug: 'cold-subs', items: categories.find(c => c.slug === 'cold-subs')?._count?.menuItems },
          { name: 'Hot Subs', slug: 'hot-subs', items: categories.find(c => c.slug === 'hot-subs')?._count?.menuItems },
          { name: 'Steak & Cheese Subs', slug: 'steak-and-cheese-subs', items: categories.find(c => c.slug === 'steak-and-cheese-subs')?._count?.menuItems },
          { name: 'Sandwiches', slug: 'sandwiches', items: categories.find(c => c.slug === 'sandwiches')?._count?.menuItems }
        ].filter(sub => categories.find(c => c.slug === sub.slug)) // Only include if category exists
      },
      'seafood': {
        name: 'Seafood',
        icon: '🦞',
        subcategories: [
          { name: 'Seafood Boxes', slug: 'seafood-boxes', items: categories.find(c => c.slug === 'seafood-boxes')?._count?.menuItems },
          { name: 'Seafood Rolls', slug: 'seafood-rolls', items: categories.find(c => c.slug === 'seafood-rolls')?._count?.menuItems },
          { name: 'Seafood Plates', slug: 'seafood-plates', items: categories.find(c => c.slug === 'seafood-plates')?._count?.menuItems }
        ].filter(sub => categories.find(c => c.slug === sub.slug))
      },
      'dinner': {
        name: 'Dinner',
        icon: '🍽️',
        subcategories: [
          { name: 'Dinner Plates', slug: 'dinner-plates', items: categories.find(c => c.slug === 'dinner-plates')?._count?.menuItems },
          { name: 'Pasta & Italian', slug: 'ziti-pasta', items: categories.find(c => c.slug === 'ziti-pasta')?._count?.menuItems }
        ].filter(sub => categories.find(c => c.slug === sub.slug))
      },
      'chicken': {
        name: 'Chicken',
        icon: '🍗',
        subcategories: [
          { name: 'Wings', slug: 'chicken-wings', items: categories.find(c => c.slug === 'chicken-wings')?._count?.menuItems },
          { name: 'Fingers', slug: 'chicken-fingers', items: categories.find(c => c.slug === 'chicken-fingers')?._count?.menuItems }
        ].filter(sub => categories.find(c => c.slug === sub.slug))
      },
      'appetizers': {
        name: 'Appetizers',
        icon: '🍤',
        subcategories: [
          { name: 'Fried Appetizers', slug: 'fried-appetizers', items: categories.find(c => c.slug === 'fried-appetizers')?._count?.menuItems },
          { name: 'Soups & Chowders', slug: 'soups-chowders', items: categories.find(c => c.slug === 'soups-chowders')?._count?.menuItems },
          { name: 'Specialty Items', slug: 'specialty-items', items: categories.find(c => c.slug === 'specialty-items')?._count?.menuItems }
        ].filter(sub => categories.find(c => c.slug === sub.slug))
      }
    };

    return structure;
  };

  // Handle dropdown interactions
  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };

  // Determine app name
  const appName = !loading && isHydrated && settings
    ? (settings.app_name || settings.business_name || 'Local Pizza House')
    : 'Local Pizza House';

  const menuStructure = getMenuStructure();

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
              🍕 <span className="text-orange-300">{appName}</span>
            </Link>
            {isHydrated && settings?.app_tagline && (
              <p className="text-sm text-green-200 italic ml-8">
                {settings.app_tagline}
              </p>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Home Link */}
            <Link 
              href="/" 
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Home
            </Link>

            {/* Main Menu Items with Submenus - Only render after hydration */}
            {isHydrated && Object.entries(menuStructure).map(([key, menu]) => (
              <div key={key} className="relative">
                <button
                  className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-1"
                  onClick={() => handleDropdownToggle(key)}
                  onMouseEnter={() => setActiveDropdown(key)}
                >
                  <span className="mr-1">{menu.icon}</span>
                  {menu.name}
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === key && menu.subcategories && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[250px] z-50"
                    onMouseLeave={handleDropdownClose}
                  >
                    {/* Submenu Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                        <span className="mr-2 text-lg">{menu.icon}</span>
                        {menu.name}
                      </h3>
                    </div>

                    {/* Submenu Items */}
                    <div className="py-2">
                      {menu.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.slug}
                          href={`/menu/${subcategory.slug}`}
                          className="group flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={handleDropdownClose}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600">
                              {subcategory.name}
                            </p>
                          </div>
                          {subcategory.items && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {subcategory.items} items
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Standalone Salads Link - Always show */}
            <Link 
              href="/menu/salads" 
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-1"
            >
              <span className="mr-1">🥗</span>
              Salads
            </Link>

            {/* Static Links */}
            <Link 
              href="/cart" 
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Cart
            </Link>

            <Link 
              href="/contact" 
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Contact
            </Link>

            <AuthNav />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-orange-300 transition-colors p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-green-600 bg-green-800/50 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Menu Categories */}
              {isHydrated && Object.entries(menuStructure).map(([key, menu]) => (
                <div key={key} className="space-y-1">
                  <div className="text-white font-medium px-3 py-2 flex items-center">
                    <span className="mr-2">{menu.icon}</span>
                    {menu.name}
                  </div>
                  {menu.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      href={`/menu/${subcategory.slug}`}
                      className="block text-white/80 hover:text-orange-300 transition-colors px-6 py-2 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              ))}

              <Link 
                href="/menu/salads" 
                className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                🥗 Salads
              </Link>

              <Link 
                href="/cart" 
                className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart
              </Link>

              <Link 
                href="/contact" 
                className="block text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="px-3 py-2">
                <AuthNav isMobile={true} onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
