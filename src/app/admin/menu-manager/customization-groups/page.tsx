'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiSettings, FiRefreshCw, FiCopy } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { useSexyToast } from '@/components/SexyToastProvider';

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
  _count: {
    options: number;
    menuItems: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CustomizationGroupsPage() {
  const router = useRouter();
  const toast = useSexyToast();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [showInactive]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchGroups();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        includeInactive: showInactive.toString()
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/menu/customization-groups?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        // API returns array directly
        const groupsData = Array.isArray(data) ? data : [];
        setGroups(groupsData);
      } else {
        console.error('Failed to fetch customization groups:', response.status);
        if (response.status === 401) {
          toast.showError('Please log in as an administrator');
        } else {
          toast.showError('Failed to fetch customization groups');
        }
        setGroups([]);
      }
    } catch (error) {
      console.error('Error fetching customization groups:', error);
      toast.showError('Failed to fetch customization groups');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    toast.showConfirm({
      title: 'Delete Customization Group',
      message: 'Are you sure you want to delete this customization group? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/menu/customization-groups/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setGroups(groups.filter(group => group.id !== id));
            toast.showSuccess('Customization group deleted successfully!');
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

  const handleCloneGroup = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/admin/menu/customization-groups/${id}/clone`, {
        method: 'POST'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh the groups list to show the new cloned group
        await fetchGroups();
        toast.showSuccess(result.message || `Successfully cloned "${name}"`);
      } else {
        toast.showError(result.error || 'Failed to clone customization group');
      }
    } catch (error) {
      console.error('Error cloning customization group:', error);
      toast.showError('Failed to clone customization group');
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchTerm === '' || 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = showInactive || group.isActive;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customization Groups</h1>
            <p className="text-gray-600">Manage customization options for menu items</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchGroups()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => router.push('/admin/menu-manager/customization-groups/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add New Group
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiSettings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiSettings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Groups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {groups.filter(g => g.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiSettings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Single Select</p>
                <p className="text-2xl font-bold text-gray-900">
                  {groups.filter(g => g.type === 'SINGLE_SELECT').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiSettings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Multi Select</p>
                <p className="text-2xl font-bold text-gray-900">
                  {groups.filter(g => g.type === 'MULTI_SELECT').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Inactive</span>
            </label>
          </div>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No customization groups found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{group.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Required:</span>
                    <span className="font-medium">{group.isRequired ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Options:</span>
                    <span className="font-medium">{group._count.options}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used by:</span>
                    <span className="font-medium">{group._count.menuItems} items</span>
                  </div>
                  {group.category && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{group.category.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => router.push(`/admin/menu-manager/customization-groups/${group.id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                    <button 
                      onClick={() => router.push(`/admin/menu-manager/customization-groups/${group.id}/edit`)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCloneGroup(group.id, group.name)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FiCopy className="w-4 h-4" />
                      Clone
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
