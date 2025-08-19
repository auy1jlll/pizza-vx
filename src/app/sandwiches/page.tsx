'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
  preparationTime?: number;
  category: MenuCategory;
}

interface MenuData {
  category: MenuCategory;
  items: MenuItem[];
}

export default function SandwichesPage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { show: showToast } = useToast();

  useEffect(() => {
    fetchSandwiches();
  }, []);

  const fetchSandwiches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu/deli-subs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sandwiches');
      }

      const result = await response.json();
      
      if (result.success) {
        setMenuData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load sandwiches');
      }
    } catch (err: any) {
      console.error('Error fetching sandwiches:', err);
      setError(err.message);
      showToast('Failed to load sandwiches', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sandwiches...</p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load sandwiches'}</p>
          <button 
            onClick={fetchSandwiches}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">{menuData.category.name}</h1>
            </div>
          </div>
          {menuData.category.description && (
            <p className="mt-2 text-gray-600">{menuData.category.description}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {menuData.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sandwiches available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuData.items.map((sandwich) => (
              <SandwichCard key={sandwich.id} sandwich={sandwich} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SandwichCard({ sandwich }: { sandwich: MenuItem }) {
  const [quantity, setQuantity] = useState(1);
  const { show: showToast } = useToast();

  const handleCustomize = () => {
    // Navigate to sandwich customizer
    window.location.href = `/sandwich-customizer?id=${sandwich.id}`;
  };

  const handleQuickAdd = async () => {
    try {
      // Add to cart with default customizations
      // This would need to be implemented similar to pizza system
      showToast(`Added ${quantity} ${sandwich.name} to cart`, { type: 'success' });
    } catch (error) {
      showToast('Failed to add to cart', { type: 'error' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-200 relative overflow-hidden">
        {sandwich.imageUrl ? (
          <img 
            src={sandwich.imageUrl} 
            alt={sandwich.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🥪</span>
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full font-semibold">
          ${sandwich.basePrice.toFixed(2)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{sandwich.name}</h3>
        
        {sandwich.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{sandwich.description}</p>
        )}

        {sandwich.preparationTime && (
          <p className="text-xs text-gray-500 mb-4">
            ⏱️ Ready in {sandwich.preparationTime} minutes
          </p>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleCustomize}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-md"
          >
            Customize Sandwich
          </button>
          <button
            onClick={handleQuickAdd}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Quick Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
