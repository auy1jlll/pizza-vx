'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CustomizationGroup {
  id: string;
  name: string;
  type: string;
}

export default function NewItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customizationGroups, setCustomizationGroups] = useState<CustomizationGroup[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    categoryId: '',
    isActive: true,
    isAvailable: true,
    sortOrder: 0,
    preparationTime: '',
    customizationGroups: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
    fetchCustomizationGroups();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/menu/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchCustomizationGroups = async () => {
    try {
      const response = await fetch('/api/admin/menu/customization-groups');
      if (response.ok) {
        const data = await response.json();
        setCustomizationGroups(data);
      }
    } catch (error) {
      console.error('Error fetching customization groups:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null
      };

      const response = await fetch('/api/admin/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/admin/menu-manager/items');
      } else {
        const error = await response.json();
        alert('Error creating item: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizationGroupChange = (groupId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      customizationGroups: checked
        ? [...prev.customizationGroups, groupId]
        : prev.customizationGroups.filter(id => id !== groupId)
    }));
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Menu Item</h1>
          <p className="text-gray-300">Create a new item for your menu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prep Time (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Active</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Available</span>
            </label>
          </div>

          {customizationGroups.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customization Groups
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {customizationGroups.map((group) => (
                  <label key={group.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.customizationGroups.includes(group.id)}
                      onChange={(e) => handleCustomizationGroupChange(group.id, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">{group.name} ({group.type})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
