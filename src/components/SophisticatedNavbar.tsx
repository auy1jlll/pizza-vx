'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string | null;
  isActive: boolean;
  sortOrder: number;
  subcategories?: MenuCategory[];
  _count?: {
    menuItems: number;
  };
}

interface SophisticatedNavbarProps {
  className?: string;
  hideEmptyCategories?: boolean;
}

export default function SophisticatedNavbar({ 
  className = "sophisticated-navbar",
  hideEmptyCategories = true 
}: SophisticatedNavbarProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu/categories');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Filter to only show parent categories (exclude subcategories)
        const parentCategories = result.data
          .filter((category: MenuCategory) => {
            // Only include parent categories (parentCategoryId is null)
            if (category.parentCategoryId !== null) return false;
            
            // Exclude Pizza and specialty pizza categories
            const isPizzaCategory = category.slug === 'pizza' || 
                                  category.slug === 'specialty-pizza' ||
                                  category.slug.includes('pizza');
            if (isPizzaCategory) return false;
            
            // Exclude inactive categories
            if (!category.isActive) return false;
            
            // For categories with subcategories, include if they have active subcategories
            if (category.subcategories && category.subcategories.length > 0) {
              const hasActiveSubcategories = category.subcategories.some(sub => 
                sub.isActive && (!hideEmptyCategories || (sub._count?.menuItems ?? 0) > 0)
              );
              return hasActiveSubcategories || (!hideEmptyCategories || (category._count?.menuItems ?? 0) > 0);
            }
            
            // For categories without subcategories, include if they have items (unless hiding empty)
            if (hideEmptyCategories && (category._count?.menuItems ?? 0) === 0) return false;
            
            return true;
          })
          .sort((a: MenuCategory, b: MenuCategory) => {
            if (a.sortOrder !== b.sortOrder) {
              return a.sortOrder - b.sortOrder;
            }
            return a.name.localeCompare(b.name);
          });

        setCategories(parentCategories);
      } else {
        setError('Failed to load menu categories');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching categories for sophisticated navbar:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryUrl = (slug: string): string => {
    return `/menu/${slug}`;
  };

  const renderCategoryItem = (category: MenuCategory) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    
    if (hasSubcategories) {
      // Render dropdown for categories with subcategories
      return (
        <li key={category.id} className="relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === category.id ? null : category.id);
            }}
            className="text-white hover:text-orange-300 transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 group-hover:bg-white/5"
            title={category.description || `View ${category.name} menu`}
          >
            {category.name}
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === category.id ? 'rotate-180' : 'group-hover:rotate-12'
              }`}
            />
          </button>
          
          {/* Desktop Dropdown */}
          {openDropdown === category.id && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 min-w-[220px] z-50 overflow-hidden">
              <div className="py-2">
                {/* Parent category link if it has items */}
                {(category._count?.menuItems ?? 0) > 0 && (
                  <>
                    <Link
                      href={getCategoryUrl(category.slug)}
                      className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium border-b border-gray-100"
                      onClick={() => setOpenDropdown(null)}
                    >
                      🍽️ All {category.name}
                    </Link>
                  </>
                )}
                
                {/* Subcategory links */}
                {category.subcategories?.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={getCategoryUrl(subcategory.slug)}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{subcategory.name}</span>
                      {subcategory._count?.menuItems && (
                        <span className="text-orange-500 text-sm font-medium bg-orange-100 px-2 py-1 rounded-full">
                          {subcategory._count.menuItems}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </li>
      );
    } else {
      // Render regular link for categories without subcategories
      return (
        <li key={category.id}>
          <Link 
            href={getCategoryUrl(category.slug)}
            className="text-white hover:text-orange-300 transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/10 block"
            title={category.description || `View ${category.name} menu`}
          >
            {category.name}
          </Link>
        </li>
      );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <nav className={className}>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white/20 h-8 w-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Show error state
  if (error) {
    return (
      <nav className={className}>
        <div className="text-white text-center py-4">
          <span className="text-orange-300">⚠️ Menu temporarily unavailable</span>
        </div>
      </nav>
    );
  }

  // Show empty state if no categories
  if (categories.length === 0) {
    return (
      <nav className={className}>
        <div className="text-white text-center py-4">
          <span className="text-gray-300">No menu categories available</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className={className}>
      {/* Debug info */}
      <div style={{ background: 'yellow', color: 'black', padding: '4px', fontSize: '12px', marginBottom: '4px' }}>
        SOPHISTICATED NAVBAR: {categories.length} categories loaded, Loading: {loading ? 'YES' : 'NO'}
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <ul className="flex flex-wrap gap-2">
          {categories.map(renderCategoryItem)}
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-orange-300 transition-colors p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-green-800 shadow-lg border-t border-green-600 z-40">
            <ul className="py-4 px-4 space-y-2">
              {categories.map((category) => {
                const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                
                return (
                  <li key={category.id}>
                    {hasSubcategories ? (
                      <div>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
                          className="w-full text-left text-white hover:text-orange-300 transition-colors font-medium py-2 flex justify-between items-center"
                        >
                          {category.name}
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${
                              openDropdown === category.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {openDropdown === category.id && (
                          <ul className="ml-4 mt-2 space-y-1">
                            {(category._count?.menuItems ?? 0) > 0 && (
                              <li>
                                <Link
                                  href={getCategoryUrl(category.slug)}
                                  className="block text-orange-200 hover:text-orange-100 py-1"
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    setIsMobileMenuOpen(false);
                                  }}
                                >
                                  All {category.name}
                                </Link>
                              </li>
                            )}
                            {category.subcategories?.map((subcategory) => (
                              <li key={subcategory.id}>
                                <Link
                                  href={getCategoryUrl(subcategory.slug)}
                                  className="block text-gray-200 hover:text-white py-1"
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    setIsMobileMenuOpen(false);
                                  }}
                                >
                                  {subcategory.name} ({subcategory._count?.menuItems || 0})
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link 
                        href={getCategoryUrl(category.slug)}
                        className="block text-white hover:text-orange-300 transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
