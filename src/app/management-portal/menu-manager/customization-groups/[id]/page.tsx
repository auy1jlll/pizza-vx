'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiSettings } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { useSexyToast } from '@/components/SexyToastProvider';

interface CustomizationOption {
  id: string;
  name: string;
  description?: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
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
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  options: CustomizationOption[];
  _count: {
    menuItems: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ViewCustomizationGroupPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useSexyToast();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<CustomizationGroup | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchGroup(params.id as string);
    }
  }, [params.id]);

  const fetchGroup = async (id: string) => {
    try {
      const response = await fetch(`/api/management-portal/menu/customization-groups/${id}`);
      
      if (response.status === 401) {
        toast.showError('Please log in as administrator');
        router.push('/management-portal/login');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
      } else {
        toast.showError('Customization group not found');
        router.push('/management-portal/menu-manager/customization-groups');
      }
    } catch (error) {
      console.error('Error fetching customization group:', error);
      toast.showError('Error loading customization group');
      router.push('/management-portal/menu-manager/customization-groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;

    toast.showConfirm({
      title: 'Delete Customization Group',
      message: 'Are you sure you want to delete this customization group? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/management-portal/menu/customization-groups/${group.id}`, {
            method: 'DELETE'
          });

          if (response.status === 401) {
            toast.showError('Please log in as administrator');
            router.push('/management-portal/login');
            return;
          }

          if (response.ok) {
            toast.showSuccess('Customization group deleted successfully!');
            router.push('/management-portal/menu-manager/customization-groups');
          } else {
            const error = await response.json();
            toast.showError(error.error || 'Failed to delete customization group');
          }
        } catch (error) {
          console.error('Error deleting customization group:', error);
          toast.showError('Failed to delete customization group');
        }
      }
    });
  };

  const handleDeleteOption = async (optionId: string) => {
    toast.showConfirm({
      title: 'Delete Option',
      message: 'Are you sure you want to delete this option? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/management-portal/menu/customization-options/${optionId}`, {
            method: 'DELETE'
          });

          if (response.status === 401) {
            toast.showError('Please log in as administrator');
            router.push('/management-portal/login');
            return;
          }

          if (response.ok) {
            toast.showSuccess('Option deleted successfully!');
            setGroup(prev => prev ? {
              ...prev,
              options: prev.options.filter(opt => opt.id !== optionId)
            } : null);
          } else {
            const error = await response.json();
            toast.showError(error.error || 'Failed to delete option');
          }
        } catch (error) {
          console.error('Error deleting option:', error);
          toast.showError('Failed to delete option');
        }
      }
    });
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

  if (!group) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-300">Customization group not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{group.name}</h1>
              <p className="text-gray-300">Customization Group Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/menu-manager/customization-groups/${group.id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeleteGroup}
              className="inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Group Info Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{group.name}</p>
                </div>
                {group.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{group.description}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{group.type.replace('_', ' ')}</p>
                </div>
                {group.category && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{group.category.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    group.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Required</label>
                  <p className="text-gray-900">{group.isRequired ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Min Selections</label>
                  <p className="text-gray-900">{group.minSelections}</p>
                </div>
                {group.maxSelections && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Max Selections</label>
                    <p className="text-gray-900">{group.maxSelections}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Sort Order</label>
                  <p className="text-gray-900">{group.sortOrder}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Used by Menu Items</label>
                  <p className="text-gray-900">{group._count.menuItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Options</h3>
                <p className="text-gray-600">{group.options.length} option(s) available</p>
              </div>
              <button
                onClick={() => router.push(`/admin/menu-manager/customization-options/new?groupId=${group.id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Option
              </button>
            </div>
          </div>

          <div className="p-6">
            {group.options.length === 0 ? (
              <div className="text-center py-8">
                <FiSettings className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-lg font-medium text-gray-900">No options yet</h4>
                <p className="mt-1 text-gray-500">Add some options to this customization group</p>
                <button
                  onClick={() => router.push(`/admin/menu-manager/customization-options/new?groupId=${group.id}`)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add First Option
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.options
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((option) => (
                    <div key={option.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          option.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {option.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      
                      {option.description && (
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Price: {option.priceModifier >= 0 ? '+' : ''}${option.priceModifier.toFixed(2)}
                        </span>
                        <span className="text-gray-600">Order: {option.sortOrder}</span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => router.push(`/admin/menu-manager/customization-options/${option.id}/edit`)}
                          className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOption(option.id)}
                          className="text-xs px-2 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Meta Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Created:</strong> {new Date(group.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(group.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
