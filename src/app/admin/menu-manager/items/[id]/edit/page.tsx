'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
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
  customizationGroups: Array<{
    customizationGroupId: string;
  }>;
}

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    if (params.id) {
      fetchItem(params.id as string);
      fetchCategories();
      fetchCustomizationGroups();
    }
  }, [params.id]);

  const fetchItem = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu/items/${id}`);
      if (response.ok) {
        const item: MenuItem = await response.json();
        setFormData({
          name: item.name,
          description: item.description || '',
          basePrice: item.basePrice.toString(),
          categoryId: item.categoryId,
          isActive: item.isActive,
          isAvailable: item.isAvailable,
          sortOrder: item.sortOrder,
          preparationTime: item.preparationTime?.toString() || '',
          customizationGroups: item.customizationGroups.map(cg => cg.customizationGroupId)
        });
      } else {
        alert('Item not found');
        router.push('/admin/menu-manager/items');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('Error loading item');
      router.push('/admin/menu-manager/items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/menu/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch categories:', response.status);
        setCategories([]);
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
        setCustomizationGroups(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch customization groups:', response.status);
        setCustomizationGroups([]);
      }
    } catch (error) {
      console.error('Error fetching customization groups:', error);
      setCustomizationGroups([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null
      };

      const response = await fetch(`/api/admin/menu/items/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push(`/admin/menu-manager/items/${params.id}`);
      } else {
        const error = await response.json();
        alert('Error updating item: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Menu Item</h1>
            <p className="text-gray-600">Update item information</p>
          </div>
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
                {Array.isArray(categories) && categories.map((category) => (
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

          {Array.isArray(customizationGroups) && customizationGroups.length > 0 && (
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
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
