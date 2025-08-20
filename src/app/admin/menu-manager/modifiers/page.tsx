'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiTag, FiDollarSign } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';

interface Modifier {
  id: string;
  name: string;
  type: 'TOPPING' | 'SIDE' | 'DRESSING' | 'CONDIMENT' | 'SIZE';
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
}

const MODIFIER_TYPES = [
  { value: 'TOPPING', label: 'Topping', color: 'bg-red-100 text-red-800' },
  { value: 'SIDE', label: 'Side', color: 'bg-blue-100 text-blue-800' },
  { value: 'DRESSING', label: 'Dressing', color: 'bg-green-100 text-green-800' },
  { value: 'CONDIMENT', label: 'Condiment', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SIZE', label: 'Size', color: 'bg-purple-100 text-purple-800' },
];

export default function ModifiersPage() {
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingModifier, setEditingModifier] = useState<Modifier | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [showInactive, setShowInactive] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    type: 'TOPPING' | 'SIDE' | 'DRESSING' | 'CONDIMENT' | 'SIZE';
    price: number;
    isActive: boolean;
  }>({
    name: '',
    type: 'TOPPING',
    price: 0,
    isActive: true
  });

  useEffect(() => {
    fetchModifiers();
  }, [filterType, showInactive]);

  const fetchModifiers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        includeInactive: showInactive.toString()
      });
      
      if (filterType) params.append('type', filterType);

      const response = await fetch(`/api/admin/menu/modifiers?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setModifiers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching modifiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingModifier 
        ? `/api/admin/menu/modifiers/${editingModifier.id}`
        : '/api/admin/menu/modifiers';
      
      const method = editingModifier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        fetchModifiers(); // Refresh the list
        resetForm();
      } else {
        alert(data.error || 'Failed to save modifier');
      }
    } catch (error) {
      console.error('Error saving modifier:', error);
      alert('Failed to save modifier');
    }
  };

  const handleEdit = (modifier: Modifier) => {
    setEditingModifier(modifier);
    setFormData({
      name: modifier.name,
      type: modifier.type,
      price: modifier.price,
      isActive: modifier.isActive
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this modifier?')) return;

    try {
      const response = await fetch(`/api/admin/menu/modifiers/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setModifiers(modifiers.filter(m => m.id !== id));
      } else {
        alert(data.error || 'Failed to delete modifier');
      }
    } catch (error) {
      console.error('Error deleting modifier:', error);
      alert('Failed to delete modifier');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'TOPPING',
      price: 0,
      isActive: true
    });
    setEditingModifier(null);
    setShowCreateForm(false);
  };

  const getTypeColor = (type: string) => {
    return MODIFIER_TYPES.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    return MODIFIER_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Modifiers</h1>
            <p className="text-gray-300">Manage toppings, sides, dressings, and other modifiers</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Modifier
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {MODIFIER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
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

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold mb-4">
                {editingModifier ? 'Edit Modifier' : 'Create New Modifier'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MODIFIER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingModifier ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modifiers List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : modifiers.length === 0 ? (
          <div className="text-center py-12">
            <FiTag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No modifiers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new modifier.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {modifiers.map((modifier) => (
                <div
                  key={modifier.id}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                    !modifier.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{modifier.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(modifier.type)}`}>
                      {getTypeLabel(modifier.type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <FiDollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {modifier.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      modifier.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {modifier.isActive ? 'Active' : 'Inactive'}
                    </span>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(modifier)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(modifier.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
