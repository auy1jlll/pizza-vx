'use client';

import { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
}

export default function PizzaSizesAdmin() {
  const [sizes, setSizes] = useState<PizzaSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSize, setEditingSize] = useState<PizzaSize | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    diameter: '',
    basePrice: ''
  });
  const { show: showToast } = useToast();

  // Helper functions for size categorization
  const getSizeCategory = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('personal') || lowerName.includes('individual')) return 'Personal';
    if (lowerName.includes('small') || lowerName.includes('mini')) return 'Small';
    if (lowerName.includes('medium') || lowerName.includes('regular')) return 'Medium';
    if (lowerName.includes('large') || lowerName.includes('family')) return 'Large';
    if (lowerName.includes('extra') || lowerName.includes('xl') || lowerName.includes('jumbo')) return 'Extra Large';
    if (lowerName.includes('party') || lowerName.includes('giant') || lowerName.includes('mega')) return 'Party Size';
    return 'Standard';
  };

  const getSizeIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('personal') || lowerName.includes('individual')) return '🍽️';
    if (lowerName.includes('small') || lowerName.includes('mini')) return '🥗';
    if (lowerName.includes('medium') || lowerName.includes('regular')) return '🍕';
    if (lowerName.includes('large') || lowerName.includes('family')) return '🍖';
    if (lowerName.includes('extra') || lowerName.includes('xl') || lowerName.includes('jumbo')) return '🍗';
    if (lowerName.includes('party') || lowerName.includes('giant') || lowerName.includes('mega')) return '🎉';
    return '📏';
  };

  const getSizeDescription = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('personal') || lowerName.includes('individual')) return 'Perfect for one';
    if (lowerName.includes('small') || lowerName.includes('mini')) return 'Light appetite';
    if (lowerName.includes('medium') || lowerName.includes('regular')) return 'Most popular';
    if (lowerName.includes('large') || lowerName.includes('family')) return 'Great for sharing';
    if (lowerName.includes('extra') || lowerName.includes('xl') || lowerName.includes('jumbo')) return 'Hungry crowd';
    if (lowerName.includes('party') || lowerName.includes('giant') || lowerName.includes('mega')) return 'Feed everyone';
    return 'Classic choice';
  };

  const getSizeScale = (name: string): number => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('personal') || lowerName.includes('individual')) return 0.7;
    if (lowerName.includes('small') || lowerName.includes('mini')) return 0.8;
    if (lowerName.includes('medium') || lowerName.includes('regular')) return 1.0;
    if (lowerName.includes('large') || lowerName.includes('family')) return 1.2;
    if (lowerName.includes('extra') || lowerName.includes('xl') || lowerName.includes('jumbo')) return 1.4;
    if (lowerName.includes('party') || lowerName.includes('giant') || lowerName.includes('mega')) return 1.6;
    return 1.0;
  };

  // Fetch sizes
  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/management-portal/sizes');
      if (response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/management-portal/login';
        return;
      }
      const data = await response.json();
      setSizes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSize ? `/api/management-portal/sizes/${editingSize.id}` : '/api/management-portal/sizes';
      const method = editingSize ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchSizes();
        setShowForm(false);
        setEditingSize(null);
        setFormData({ name: '', diameter: '', basePrice: '' });
      } else {
        // Handle specific error messages
        const errorMessage = data.error || 'Failed to save size';
        showToast(errorMessage, { type: 'error' });
      }
    } catch (error) {
      console.error('Error saving size:', error);
      showToast('Network error. Please check your connection and try again.', { type: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this size?')) return;
    
    try {
      const response = await fetch(`/api/management-portal/sizes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSizes();
      }
    } catch (error) {
      console.error('Error deleting size:', error);
    }
  };

  // Handle edit
  const handleEdit = (size: PizzaSize) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      diameter: size.diameter,
      basePrice: size.basePrice.toString()
    });
    setShowForm(true);
  };

  return (
    <AdminPageLayout title="Pizza Sizes" description="Manage the available pizza sizes for your restaurant.">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-white">Pizza Sizes</h1>
          <p className="mt-2 text-lg text-slate-300">
            Manage the available pizza sizes for your restaurant.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingSize(null);
              setFormData({ name: '', diameter: '', basePrice: '' });
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            <span className="text-xl">📏</span>
            <span>Add New Size</span>
          </button>
        </div>
      </div>
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl p-8 w-full max-w-md mx-4 border border-slate-700/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingSize ? 'Edit Size' : 'Add New Size'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Size Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Small, Medium, Large"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Diameter
                  </label>
                  <input
                    type="text"
                    value={formData.diameter}
                    onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10 inches, 12 inches"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 12.99"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    {editingSize ? 'Update Size' : 'Create Size'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sizes List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-slate-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading sizes...
            </div>
          ) : sizes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📏</div>
              <h3 className="text-xl font-semibold text-white mb-2">No sizes yet</h3>
              <p className="text-slate-300 mb-6">
                Get started by adding your first pizza size.
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingSize(null);
                  setFormData({ name: '', diameter: '', basePrice: '' });
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Add Your First Size
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-500/50"
                  style={{
                    borderLeftColor: '#3b82f6',
                    borderLeftWidth: '4px',
                  }}
                >
                  {/* Size Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                      >
                        <span className="text-white text-lg">{getSizeIcon(size.name)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${size.basePrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Size Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {size.name}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {getSizeDescription(size.name)}
                    </p>
                  </div>

                  {/* Size Details */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">Diameter</span>
                      <span className="text-sm text-slate-400">{size.diameter}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-300">Category</span>
                      <span className="text-sm text-slate-400">{getSizeCategory(size.name)}</span>
                    </div>

                    {/* Visual Size Indicator */}
                    <div className="flex items-center justify-center mb-2">
                      <div
                        className="rounded-full border-2 border-blue-400/50 bg-blue-500/20 flex items-center justify-center"
                        style={{
                          width: `${40 + (getSizeScale(size.name) - 0.7) * 30}px`,
                          height: `${40 + (getSizeScale(size.name) - 0.7) * 30}px`
                        }}
                      >
                        <span className="text-blue-400 text-xs font-medium">
                          {size.diameter.replace(/[^0-9]/g, '')}″
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(size)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(size.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminPageLayout>
    );
  }
