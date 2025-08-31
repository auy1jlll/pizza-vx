'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
    sortOrder: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'sortOrder' ? parseInt(value) || 0 : value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
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
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/management-portal/menu/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/management-portal/menu-manager/categories');
      } else {
        setError(result.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error creating category:', err);
    } finally {
      setLoading(false);
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
                <span className="text-4xl mr-3">➕</span>
                Create New Category
              </h1>
              <p className="text-white/70 mt-2">
                Add a new menu category to organize your items
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
                      placeholder="auto-generated from name"
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">
                      This will be used in the URL: /menu/{formData.slug || 'category-slug'}
                    </p>
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
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading || !formData.name || !formData.slug}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Save className="h-5 w-5 inline mr-2" />
                          Create Category
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

              {/* Preview */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Preview</h3>
                
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
                        <p className="text-2xl font-bold text-white">0</p>
                        <p className="text-white/70 text-sm">Menu Items</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">0</p>
                        <p className="text-white/70 text-sm">Customizations</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-white/50 text-center">
                      Sort Order: {formData.sortOrder}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/20 rounded-xl">
                  <h4 className="text-blue-300 font-medium mb-2">💡 Tips</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Use clear, descriptive names for better customer experience</li>
                    <li>• The slug will be used in URLs, so keep it simple</li>
                    <li>• Sort order determines menu display sequence</li>
                    <li>• You can add items and customizations after creating the category</li>
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
