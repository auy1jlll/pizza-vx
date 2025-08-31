'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import AdminPageLayout from '@/components/AdminPageLayout';
import { useSexyToast } from '@/components/SexyToastProvider';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
  preparationTime?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  customizationGroups: any[];
  _count?: {
    customizationGroups: number;
    cartItems?: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ItemsPage() {
  const toast = useSexyToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [selectedCategory, searchTerm, showInactive]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/management-portal/menu/categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        includeInactive: showInactive.toString()
      });
      
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/management-portal/menu/items?${params}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    toast.showConfirm({
      title: 'Delete Menu Item',
      message: 'Are you sure you want to delete this menu item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/management-portal/menu/items/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            toast.showSuccess('Menu item deleted successfully!');
            setItems(items.filter(item => item.id !== id));
          } else {
            const error = await response.json();
            toast.showError(error.error || 'Failed to delete item');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          toast.showError('Failed to delete item');
        }
      }
    });
  };

  const toggleItemStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/management-portal/menu/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchItems(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  return (
    <AdminPageLayout 
      title="Menu Items"
      description="Manage your restaurant's menu items"
      actionButton={
        <button 
          onClick={() => window.location.href = '/management-portal/menu-manager/items/new'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FiPlus className="w-4 h-4" />
          Add New Item
        </button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="" className="bg-gray-800 text-white">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                  {category.name}
                </option>
              ))}
            </select>
            
            <label className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-all">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-400"
              />
              <span className="text-sm text-white">Show Inactive</span>
            </label>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white/20 ${
                  !item.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleItemStatus(item.id, item.isActive)}
                        className={`px-2 py-1 text-xs rounded-full transition-all ${
                          item.isActive
                            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-2">{item.category.name}</p>
                  
                  {item.description && (
                    <p className="text-sm text-white/80 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-300">
                      ${item.basePrice.toFixed(2)}
                    </span>
                    <div className="text-xs text-white/60">
                      {item._count?.customizationGroups || 0} customizations
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.location.href = `/management-portal/menu-manager/items/${item.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all text-white"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                    <button 
                      onClick={() => window.location.href = `/management-portal/menu-manager/items/${item.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all text-blue-300"
                    >
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-2 text-sm text-red-300 bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
