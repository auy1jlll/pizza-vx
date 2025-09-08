'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId?: string | null;
  subcategories?: MenuCategory[];
  _count?: { menuItems: number };
}

interface DynamicMenuNavbarProps {
  className?: string;
  hideEmptyCategories?: boolean;
}

// Helper function to filter categories with items and prepare for display
const filterCategoriesWithItems = (categories: MenuCategory[]): MenuCategory[] => {
  console.log('🔍 ENHANCED FILTERING - Total received:', categories.length);
  
  // Filter parent categories that have items or subcategories with items
  const filteredParents = categories.filter(category => {
    // Skip subcategories (those with parentCategoryId)
    if (category.parentCategoryId) {
      console.log(`⏭️ Skipping subcategory: ${category.name}`);
      return false;
    }

    const hasDirectItems = (category._count?.menuItems || 0) > 0;
    const subcategoriesWithItems = categories.filter(sub => 
      sub.parentCategoryId === category.id && (sub._count?.menuItems || 0) > 0
    );
    const hasSubcategoriesWithItems = subcategoriesWithItems.length > 0;
    
    const shouldShow = hasDirectItems || hasSubcategoriesWithItems;
    
    console.log(`📋 ENHANCED Category "${category.name}":`, {
      hasDirectItems,
      subcategoriesCount: subcategoriesWithItems.length,
      shouldShow,
      directItemCount: category._count?.menuItems || 0
    });

    if (shouldShow) {
      // Attach subcategories to parent
      category.subcategories = subcategoriesWithItems;
      console.log(`✅ ENHANCED "${category.name}" will be shown with ${subcategoriesWithItems.length} subcategories`);
    }

    return shouldShow;
  });

  console.log('🎯 ENHANCED FINAL FILTERED CATEGORIES:', filteredParents.map(c => c.name));
  return filteredParents.sort((a, b) => a.sortOrder - b.sortOrder);
};

export default function DynamicMenuNavbar({ className = '', hideEmptyCategories = true }: DynamicMenuNavbarProps) {
  const [rawCategories, setRawCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Memoize the filtered categories to prevent expensive recalculation on every render
  const categories = useMemo(() => {
    if (!hideEmptyCategories) {
      return rawCategories;
    }
    
    if (rawCategories.length === 0) {
      return [];
    }
    
    console.log('🔄 MEMOIZED FILTERING: Processing categories...');
    return filterCategoriesWithItems(rawCategories);
  }, [rawCategories, hideEmptyCategories]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('🚀 ENHANCED NAVBAR: Loading categories...');
        setLoading(true);
        
        // Try API endpoint first (same as HybridNavigation used)
        console.log('📡 Trying API endpoint...');
        const response = await fetch('/api/menu/categories');
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 API Result:', result);
        
        if (result.success && Array.isArray(result.data)) {
          const allCategories = result.data;
          console.log('📦 ENHANCED NAVBAR: Raw categories loaded:', allCategories.length);
          
          // Store raw categories and let useMemo handle filtering
          setRawCategories(allCategories);
        } else {
          throw new Error('Invalid API response format');
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ ENHANCED NAVBAR: Error loading categories:', err);
        setError(`Failed to load menu categories: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []); // Remove hideEmptyCategories dependency since useMemo handles it

  // Handle dropdown toggle
  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = Object.values(dropdownRefs.current).every(ref => 
        !ref?.contains(target)
      );
      
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center py-4`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        <span className="ml-2 text-white text-sm">Loading enhanced menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} text-red-200 py-4 px-4`}>
        <span className="text-sm">⚠️ {error}</span>
      </div>
    );
  }

  console.log('🎨 ENHANCED NAVBAR: Rendering with categories:', categories.map(c => ({ name: c.name, subcategories: c.subcategories?.length || 0 })));

  return (
    <nav className={`${className} relative z-20`} style={{ pointerEvents: 'auto' }}>
      {/* Enhanced debug info - FORCE VISIBLE - NO MARGIN */}
      <div style={{ background: 'cyan', color: 'black', padding: '8px 16px', fontSize: '16px', marginBottom: '0px', border: '4px solid red', textAlign: 'center', fontWeight: 'bold' }}>
        🔥 ENHANCED NAVBAR DEFINITELY LOADED: {categories.length} categories | First: {categories[0]?.name || 'None'}
      </div>
      
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide"
           style={{ pointerEvents: 'auto' }}>
        {categories.map((category) => {
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isDropdownOpen = openDropdown === category.id;

          return (
            <div
              key={category.id}
              className="relative flex-shrink-0"
              ref={(el) => { dropdownRefs.current[category.id] = el; }}
            >
              {hasSubcategories ? (
                // Category with dropdown (Enhanced styling)
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(category.id)}
                    className="flex items-center px-4 py-2 text-white hover:bg-green-600 rounded-lg transition-all duration-300 whitespace-nowrap text-sm font-medium border border-green-500 hover:border-green-400 shadow-md cursor-pointer relative z-10"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <span className="font-semibold">{category.name}</span>
                    <span className="ml-1 text-xs bg-green-500 px-1 rounded">
                      {category.subcategories?.length}
                    </span>
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] min-w-[220px] overflow-hidden">
                      <div className="py-2">
                        {/* Parent category link with enhanced styling */}
                        <Link
                          href={`/menu/${category.slug}`}
                          className="block px-4 py-3 text-gray-800 hover:bg-green-50 text-sm font-semibold border-b border-gray-100 bg-gray-50"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex justify-between items-center">
                            <span>All {category.name}</span>
                            {category._count?.menuItems && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                {category._count.menuItems}
                              </span>
                            )}
                          </div>
                        </Link>
                        
                        {/* Enhanced subcategory links */}
                        {category.subcategories?.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/menu/${subcategory.slug}`}
                            className="block px-6 py-2 text-gray-700 hover:bg-green-50 text-sm transition-colors duration-200"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="flex justify-between items-center">
                              <span>{subcategory.name}</span>
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
                // Simple category link (Enhanced styling)
                <Link
                  href={`/menu/${category.slug}`}
                  className="flex items-center px-4 py-2 text-white hover:bg-green-600 rounded-lg transition-all duration-300 whitespace-nowrap text-sm font-medium border border-green-500 hover:border-green-400 shadow-md"
                >
                  <span>{category.name}</span>
                  {category._count?.menuItems && (
                    <span className="ml-2 text-xs bg-green-500 px-1 rounded">
                      {category._count.menuItems}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// Export a version with default styling for easy integration
export function DynamicMenuNavbarStyled() {
  return (
    <div className="bg-gradient-to-r from-green-700 to-emerald-600 shadow-md border-b border-green-600">
      <div className="container mx-auto px-4 py-3">
        <DynamicMenuNavbar 
          className="navbar-menu"
          hideEmptyCategories={true}
        />
      </div>
    </div>
  );
}
