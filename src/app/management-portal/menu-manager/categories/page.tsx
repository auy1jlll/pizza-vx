'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  _count: {
    menuItems: number;
    customizationGroups: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'sortOrder' | 'createdAt'>('sortOrder');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/management-portal/menu/categories');
      
      if (response.ok) {
        const result = await response.json();
        console.log('Categories API response:', result);
        
        // Handle both direct array and wrapped response formats
        if (Array.isArray(result)) {
          setCategories(result);
        } else if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError('Invalid response format');
        }
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/management-portal/menu/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (err) {
      console.error('Error updating category status:', err);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/management-portal/menu/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && category.isActive) ||
                           (statusFilter === 'inactive' && !category.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sortOrder':
          return a.sortOrder - b.sortOrder;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'sandwiches': return '🥪';
      case 'salads': return '🥗';
      case 'seafood': return '🦞';
      case 'dinner-plates': return '🍽️';
      default: return '🍴';
    }
  };

  const getCategoryGradient = (slug: string) => {
    switch (slug) {
      case 'sandwiches': return 'from-yellow-500 to-orange-500';
      case 'salads': return 'from-green-500 to-emerald-500';
      case 'seafood': return 'from-blue-500 to-cyan-500';
      case 'dinner-plates': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/management-portal/menu-manager"
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">📂</span>
                  Menu Categories
                </h1>
                <p className="text-white/70 mt-2">
                  Manage menu categories and their settings
                </p>
              </div>
            </div>
            <Link
              href="/management-portal/menu-manager/categories/new"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Add Category
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Search Categories
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or slug..."
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Status Filter
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    <option value="all" className="bg-slate-800">All Categories</option>
                    <option value="active" className="bg-slate-800">Active Only</option>
                    <option value="inactive" className="bg-slate-800">Inactive Only</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    <option value="sortOrder" className="bg-slate-800">Sort Order</option>
                    <option value="name" className="bg-slate-800">Name</option>
                    <option value="createdAt" className="bg-slate-800">Created Date</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <div className={`bg-gradient-to-r ${getCategoryGradient(category.slug)} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-4xl mr-3">{getCategoryIcon(category.slug)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{category.name}</h3>
                        <p className="text-white/80 text-sm">/{category.slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                      className="transition-all duration-300"
                    >
                      {category.isActive ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <XCircle className="h-6 w-6 text-white/50" />
                      )}
                    </button>
                  </div>
                  {category.description && (
                    <p className="text-white/90 text-sm mt-2">{category.description}</p>
                  )}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{category._count.menuItems}</p>
                      <p className="text-white/70 text-sm">Menu Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{category._count.customizationGroups}</p>
                      <p className="text-white/70 text-sm">Customizations</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/management-portal/menu-manager/categories/${category.id}`}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-center transition-all duration-300 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/management-portal/menu-manager/categories/${category.id}/edit`}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-center transition-all duration-300 text-sm font-medium"
                    >
                      <Edit className="h-4 w-4 inline mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-xs text-white/50">
                      Order: {category.sortOrder} • Created: {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-bold text-white mb-2">No Categories Found</h3>
              <p className="text-white/70 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No categories match your current filters.'
                  : 'Get started by creating your first menu category.'
                }
              </p>
              <Link
                href="/management-portal/menu-manager/categories/new"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Add Category
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
