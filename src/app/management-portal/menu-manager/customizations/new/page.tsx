'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
}

export default function NewCustomizationGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'SINGLE_SELECT' as const,
    categoryId: '',
    isRequired: false,
    minSelections: 0,
    maxSelections: null as number | null,
    sortOrder: 1,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/management-portal/menu/categories');
      console.log('Categories response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Categories data received:', data);
        console.log('Is array?', Array.isArray(data));
        console.log('Categories count:', data.length);
        
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch categories, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        categoryId: formData.categoryId || null,
        maxSelections: formData.maxSelections || null
      };

      console.log('Submitting data:', submitData);

      const response = await fetch('/api/management-portal/menu/customization-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        alert('Customization group created successfully!');
        router.push('/management-portal/menu-manager/customizations');
      } else {
        alert('Error creating customization group: ' + (result.error || result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating customization group:', error);
      alert('Error creating customization group: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? (value === '' ? null : parseInt(value))
              : value
    }));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/management-portal/menu-manager/customizations"
              className="bg-white/20 hover:bg-white/30 text-orange-600 p-2 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <span className="text-4xl mr-3">➕</span>
                New Customization Group
              </h1>
              <p className="text-white/70 mt-2">
                Create a new customization group for menu items
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Size, Bread Type, Toppings"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Optional description for this customization group"
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Global (All Categories)</option>
                    {categories.map(category => {
                      console.log('Rendering category:', category.name);
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a category to limit this group to specific menu items, or leave blank for global use
                  </p>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Selection Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="SINGLE_SELECT">Single Select (Choose one option)</option>
                    <option value="MULTI_SELECT">Multi Select (Choose multiple options)</option>
                    <option value="QUANTITY_SELECT">Quantity Select (Choose quantities)</option>
                    <option value="SPECIAL_LOGIC">Special Logic (Custom behavior)</option>
                  </select>
                </div>

                {/* Selection Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minSelections" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Selections
                    </label>
                    <input
                      type="number"
                      id="minSelections"
                      name="minSelections"
                      value={formData.minSelections}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxSelections" className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Selections
                    </label>
                    <input
                      type="number"
                      id="maxSelections"
                      name="maxSelections"
                      value={formData.maxSelections || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Flags */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRequired"
                      name="isRequired"
                      checked={formData.isRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-700">
                      Required Selection
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end space-x-4">
                <Link
                  href="/management-portal/menu-manager/customizations"
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 inline mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 inline mr-2" />
                      Create Group
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
