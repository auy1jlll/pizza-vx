'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Plus, Eye, Users, Settings, Loader2, X } from 'lucide-react';

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

export default function ViewCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<MenuCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/menu/categories/${categoryId}`);
      const result = await response.json();

      if (result.success) {
        setCategory(result.data);
      } else {
        setError(result.error || 'Failed to load category');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (slug: string) => {
    const icons: { [key: string]: string } = {
      'sandwiches': '🥪',
      'salads': '🥗',
      'seafood': '🦞',
      'dinner-plates': '🍽️',
      'drinks': '🥤',
      'desserts': '🍰',
      'appetizers': '🍤',
      'pizza': '🍕',
      'burgers': '🍔',
      'pasta': '🍝'
    };
    return icons[slug] || '🍴';
  };

  const getGradient = (slug: string) => {
    const gradients: { [key: string]: string } = {
      'sandwiches': 'from-yellow-500 to-orange-500',
      'salads': 'from-green-500 to-emerald-500',
      'seafood': 'from-blue-500 to-cyan-500',
      'dinner-plates': 'from-purple-500 to-pink-500',
      'drinks': 'from-indigo-500 to-purple-500',
      'desserts': 'from-pink-500 to-rose-500',
      'appetizers': 'from-orange-500 to-red-500',
      'pizza': 'from-red-500 to-pink-500',
      'burgers': 'from-amber-500 to-orange-500',
      'pasta': 'from-emerald-500 to-teal-500'
    };
    return gradients[slug] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/70">Loading category...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !category) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <X className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Category Not Found</h2>
            <p className="text-white/70 mb-6">{error || 'The requested category could not be found.'}</p>
            <Link
              href="/admin/menu-manager/categories"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              Back to Categories
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/menu-manager/categories"
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">{getCategoryIcon(category.slug)}</span>
                  {category.name}
                </h1>
                <p className="text-white/70 mt-2">
                  Category details and management options
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href={`/admin/menu-manager/categories/${category.id}/edit`}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
              >
                <Edit className="h-4 w-4 inline mr-2" />
                Edit
              </Link>
              <Link
                href={`/menu/${category.slug}`}
                target="_blank"
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Preview
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Category Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${getGradient(category.slug)} p-8`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-6xl mr-4">{getCategoryIcon(category.slug)}</span>
                        <div>
                          <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                          <p className="text-white/80 text-lg">/{category.slug}</p>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                            category.isActive 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {category.isActive ? '✅ Active' : '❌ Inactive'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-white/90 mt-4 text-lg">{category.description}</p>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-400 mb-2">
                          {category._count.menuItems}
                        </div>
                        <p className="text-white/70">Menu Items</p>
                        <div className="mt-3">
                          <Link
                            href={`/admin/menu-manager/items?category=${category.id}`}
                            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                          >
                            View Items →
                          </Link>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">
                          {category._count.customizationGroups}
                        </div>
                        <p className="text-white/70">Customization Groups</p>
                        <div className="mt-3">
                          <Link
                            href={`/admin/menu-manager/customizations?category=${category.id}`}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            View Customizations →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href={`/admin/menu-manager/items/new?category=${category.id}`}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl p-4 transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <Plus className="h-8 w-8 text-emerald-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-emerald-300">Add Menu Item</h4>
                          <p className="text-emerald-200/70 text-sm">Create a new item in this category</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/admin/menu-manager/customizations/new?category=${category.id}`}
                      className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl p-4 transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <Settings className="h-8 w-8 text-purple-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-purple-300">Add Customization</h4>
                          <p className="text-purple-200/70 text-sm">Create customization options</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/menu/${category.slug}`}
                      target="_blank"
                      className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl p-4 transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <Eye className="h-8 w-8 text-blue-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-blue-300">Preview Category</h4>
                          <p className="text-blue-200/70 text-sm">See how customers view this</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/admin/analytics?category=${category.id}`}
                      className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl p-4 transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-orange-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-orange-300">View Analytics</h4>
                          <p className="text-orange-200/70 text-sm">Sales and popularity data</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Category Details */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Category Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm">Sort Order</label>
                      <p className="text-white font-medium">{category.sortOrder}</p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Created</label>
                      <p className="text-white font-medium">
                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Last Updated</label>
                      <p className="text-white font-medium">
                        {new Date(category.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {category.imageUrl && (
                      <div>
                        <label className="text-white/70 text-sm">Image</label>
                        <div className="mt-2">
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Management</h3>
                  <div className="space-y-3">
                    <Link
                      href={`/admin/menu-manager/categories/${category.id}/edit`}
                      className="block w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-xl text-center transition-all duration-300 font-medium"
                    >
                      <Edit className="h-4 w-4 inline mr-2" />
                      Edit Category
                    </Link>
                    
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
                          // Implement delete functionality
                          console.log('Delete category');
                        }
                      }}
                      className="block w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-xl text-center transition-all duration-300 font-medium"
                    >
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Delete Category
                    </button>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-yellow-500/20 rounded-xl p-4">
                  <h4 className="text-yellow-300 font-medium mb-2">💡 Quick Tips</h4>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Add items to make this category visible to customers</li>
                    <li>• Use customizations to offer variety</li>
                    <li>• Preview regularly to ensure good customer experience</li>
                    <li>• Monitor analytics to track performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
