'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Save, X, Upload, Loader2 } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentCategoryId?: string;
  isActive: boolean;
  sortOrder: number;
  _count: {
    menuItems: number;
    customizationGroups: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parentCategoryId: '',
    isActive: true,
    sortOrder: 0
  });
  const [originalSlug, setOriginalSlug] = useState('');
  const [category, setCategory] = useState<MenuCategory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory();
    fetchCategories();
  }, [categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/management-portal/menu/categories');
      if (response.ok) {
        const data = await response.json();
        // Filter out current category and its descendants to prevent circular references
        const filteredCategories = Array.isArray(data) ? data.filter((cat: Category) => cat.id !== categoryId) : [];
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/management-portal/menu/categories/${categoryId}`);
      const result = await response.json();

      if (result.success) {
        const cat = result.data;
        setCategory(cat);
        setFormData({
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          imageUrl: cat.imageUrl || '',
          parentCategoryId: cat.parentCategoryId || '',
          isActive: cat.isActive,
          sortOrder: cat.sortOrder
        });
        setOriginalSlug(cat.slug);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'sortOrder' ? parseInt(value) || 0 : value
    }));

    // Auto-generate slug from name only if user is changing the name and slug matches original
    if (name === 'name' && formData.slug === originalSlug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/management-portal/menu/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/management-portal/menu-manager/categories');
      } else {
        setError(result.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error updating category:', err);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryPreview = () => {
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
    return icons[formData.slug] || '🍴';
  };

  const getGradient = () => {
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
    return gradients[formData.slug] || 'from-gray-500 to-gray-600';
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

  if (error && !category) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <X className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Category</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Link
              href="/management-portal/menu-manager/categories"
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
          <div className="flex items-center gap-4">
            <Link 
              href="/management-portal/menu-manager/categories"
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <span className="text-4xl mr-3">✏️</span>
                Edit Category
              </h1>
              <p className="text-white/70 mt-2">
                Update {category?.name || 'category'} settings and information
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                      <div className="flex items-center">
                        <X className="h-5 w-5 text-red-400 mr-2" />
                        <span className="text-red-300">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Sandwiches, Salads, Seafood"
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">
                      This will be used in the URL: /menu/{formData.slug || 'category-slug'}
                    </p>
                    {formData.slug !== originalSlug && (
                      <p className="text-yellow-400 text-xs mt-1">
                        ⚠️ Changing the slug will affect existing URLs and may break bookmarks
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of this category..."
                      rows={3}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  {/* Parent Category */}
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Parent Category
                    </label>
                    <select
                      name="parentCategoryId"
                      value={formData.parentCategoryId}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="" className="bg-gray-800 text-white">
                        None (Top-level category)
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-white/50 text-xs mt-1">
                      Select a parent category to make this a subcategory, or leave empty for a top-level category
                    </p>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl transition-all duration-300"
                      >
                        <Upload className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={formData.sortOrder}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-white/50 text-xs mt-1">
                      Lower numbers appear first. Set to 0 for automatic ordering.
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-emerald-500 bg-white/20 border-white/30 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="ml-3 text-white/70 font-medium">
                        Active (visible to customers)
                      </span>
                    </label>
                    {!formData.isActive && category && category._count.menuItems > 0 && (
                      <p className="text-yellow-400 text-xs mt-2">
                        ⚠️ This category has {category._count.menuItems} menu items. Deactivating will hide them from customers.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving || !formData.name || !formData.slug}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {saving ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="h-5 w-5 inline mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <Link
                      href="/management-portal/menu-manager/categories"
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-center"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>

              {/* Preview & Info */}
              <div className="space-y-6">
                {/* Current Stats */}
                {category && (
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Current Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-400">{category._count.menuItems}</p>
                        <p className="text-white/70 text-sm">Menu Items</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">{category._count.customizationGroups}</p>
                        <p className="text-white/70 text-sm">Customizations</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
                  
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${getGradient()} p-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-4xl mr-3">{getCategoryPreview()}</span>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {formData.name || 'Category Name'}
                            </h3>
                            <p className="text-white/80 text-sm">
                              /{formData.slug || 'category-slug'}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          formData.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      {formData.description && (
                        <p className="text-white/90 text-sm mt-3">{formData.description}</p>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{category?._count.menuItems || 0}</p>
                          <p className="text-white/70 text-sm">Menu Items</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{category?._count.customizationGroups || 0}</p>
                          <p className="text-white/70 text-sm">Customizations</p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-white/50 text-center">
                        Sort Order: {formData.sortOrder}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-500/20 rounded-xl p-4">
                  <h4 className="text-blue-300 font-medium mb-2">💡 Tips</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Changes take effect immediately</li>
                    <li>• Deactivating hides category from customers</li>
                    <li>• Changing slug affects URLs - use caution</li>
                    <li>• Sort order determines display sequence</li>
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
