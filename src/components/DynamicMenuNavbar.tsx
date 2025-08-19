'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface DynamicMenuNavbarProps {
  className?: string;
  hideEmptyCategories?: boolean;
}

export default function DynamicMenuNavbar({ 
  className = "navbar-menu",
  hideEmptyCategories = true 
}: DynamicMenuNavbarProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
            if (hideEmptyCategories && category._count?.menuItems === 0) {
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
      } else {
        setError('Failed to load menu categories');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching categories for navbar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate SEO-friendly URL from category slug
  const getCategoryUrl = (slug: string): string => {
    return `/menu/${slug}`;
  };

  // Show loading state
  if (loading) {
    return (
      <nav className={className}>
        <ul className="flex space-x-4">
          {[...Array(4)].map((_, index) => (
            <li key={index}>
              <div className="animate-pulse bg-gray-300 h-6 w-20 rounded"></div>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // Show error state
  if (error) {
    console.error('Dynamic navbar error:', error);
    return null; // Fail silently in production
  }

  // Show empty state if no categories
  if (categories.length === 0) {
    return (
      <nav className={className}>
        <ul>
          <li>
            <span className="text-gray-500">No menu categories available</span>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className={className}>
      <ul className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              href={getCategoryUrl(category.slug)}
              className="text-white hover:text-orange-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
              title={category.description || `View ${category.name} menu`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
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
