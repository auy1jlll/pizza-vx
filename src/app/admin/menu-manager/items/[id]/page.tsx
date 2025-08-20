'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';

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
}

export default function ViewItemPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchItem(params.id as string);
    }
  }, [params.id]);

  const fetchItem = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu/items/${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
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

  const handleDelete = async () => {
    if (!item || !confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/menu/items/${item.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/admin/menu-manager/items');
      } else {
        alert('Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
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

  if (!item) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-300">Item not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{item.name}</h1>
              <p className="text-gray-300">{item.category.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/menu-manager/items/${item.id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{item.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900">{item.category.name}</p>
                </div>
                
                {item.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{item.description}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Base Price</label>
                  <p className="text-lg font-bold text-green-600">${item.basePrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <p className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.isAvailable
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Sort Order</label>
                  <p className="text-gray-900">{item.sortOrder}</p>
                </div>

                {item.preparationTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preparation Time</label>
                    <p className="text-gray-900">{item.preparationTime} minutes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customization Groups */}
        {item.customizationGroups.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customization Groups ({item.customizationGroups.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.customizationGroups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{group.customizationGroup.name}</h4>
                  <p className="text-sm text-gray-500">{group.customizationGroup.type}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {group.customizationGroup.options?.length || 0} options
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
