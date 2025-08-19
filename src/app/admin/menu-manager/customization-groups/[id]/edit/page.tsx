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
  description?: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'QUANTITY_SELECT' | 'SPECIAL_LOGIC';
  isRequired: boolean;
  minSelections: number;
  maxSelections?: number;
  sortOrder: number;
  isActive: boolean;
  categoryId?: string;
}

export default function EditCustomizationGroupPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'SINGLE_SELECT' as 'SINGLE_SELECT' | 'MULTI_SELECT' | 'QUANTITY_SELECT' | 'SPECIAL_LOGIC',
    isRequired: false,
    minSelections: 0,
    maxSelections: '',
    sortOrder: 0,
    isActive: true,
    categoryId: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchGroup(params.id as string);
      fetchCategories();
    }
  }, [params.id]);

  const fetchGroup = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu/customization-groups/${id}`);
      
      if (response.status === 401) {
        alert('Please log in as administrator');
        router.push('/admin/login');
        return;
      }
      
      if (response.ok) {
        const group: CustomizationGroup = await response.json();
        setFormData({
          name: group.name,
          description: group.description || '',
          type: group.type,
          isRequired: group.isRequired,
          minSelections: group.minSelections,
          maxSelections: group.maxSelections?.toString() || '',
          sortOrder: group.sortOrder,
          isActive: group.isActive,
          categoryId: group.categoryId || ''
        });
      } else {
        alert('Customization group not found');
        router.push('/admin/menu-manager/customization-groups');
      }
    } catch (error) {
      console.error('Error fetching customization group:', error);
      alert('Error loading customization group');
      router.push('/admin/menu-manager/customization-groups');
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
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        maxSelections: formData.maxSelections ? parseInt(formData.maxSelections) : null,
        categoryId: formData.categoryId || null
      };

      const response = await fetch(`/api/admin/menu/customization-groups/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push(`/admin/menu-manager/customization-groups/${params.id}`);
      } else {
        const error = await response.json();
        alert('Error updating customization group: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating customization group:', error);
      alert('Error updating customization group');
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Customization Group</h1>
            <p className="text-gray-600">Update customization group information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Size, Toppings, Sauce"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SINGLE_SELECT">Single Select</option>
                <option value="MULTI_SELECT">Multi Select</option>
                <option value="QUANTITY_SELECT">Quantity Select</option>
                <option value="SPECIAL_LOGIC">Special Logic</option>
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
              placeholder="Describe what this customization group is for..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category (Optional)
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Selections
              </label>
              <input
                type="number"
                min="0"
                value={formData.minSelections}
                onChange={(e) => setFormData(prev => ({ ...prev, minSelections: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Selections
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxSelections}
                onChange={(e) => setFormData(prev => ({ ...prev, maxSelections: e.target.value }))}
                placeholder="Leave empty for unlimited"
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
                checked={formData.isRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Required selection</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Selection Type Guide:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Single Select:</strong> Customer can choose only one option (e.g., Size)</li>
              <li><strong>Multi Select:</strong> Customer can choose multiple options (e.g., Toppings)</li>
              <li><strong>Quantity Select:</strong> Customer can specify quantities for each option</li>
              <li><strong>Special Logic:</strong> Custom logic for complex customizations</li>
            </ul>
          </div>

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
