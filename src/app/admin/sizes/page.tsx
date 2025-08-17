'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
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
      const response = await fetch('/api/admin/sizes');
      if (response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/admin/login';
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
      const url = editingSize ? `/api/admin/sizes/${editingSize.id}` : '/api/admin/sizes';
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
      const response = await fetch(`/api/admin/sizes/${id}`, {
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
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-white">Pizza Sizes</h1>
            <p className="mt-2 text-lg text-gray-300">
              Manage the available pizza sizes for your restaurant.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setEditingSize(null);
                setFormData({ name: '', diameter: '', basePrice: '' });
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">📏</span>
              <span>Add New Size</span>
            </button>
          </div>
        </div>
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingSize ? 'Edit Size' : 'Add New Size'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="e.g., Small, Medium, Large"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Diameter
                  </label>
                  <input
                    type="text"
                    value={formData.diameter}
                    onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="e.g., 10 inches, 12 inches"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
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
                    className="flex-1 bg-gray-600/80 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-gray-500/30"
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
            <div className="text-center py-8 text-white">Loading...</div>
          ) : sizes.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              No pizza sizes found. Add your first size to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(255, 255, 255, 0.05))`,
                  }}
                >
                  {/* Size Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transform transition-transform duration-300"
                        style={{ 
                          transform: `scale(${getSizeScale(size.name)})`,
                        }}
                      >
                        <span className="text-white text-lg">{getSizeIcon(size.name)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        ${size.basePrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Size Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {size.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {getSizeDescription(size.name)}
                    </p>
                  </div>

                  {/* Size Details */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">Diameter</span>
                      <span className="text-sm text-gray-300">{size.diameter}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-400">Category</span>
                      <span className="text-sm text-gray-300">{getSizeCategory(size.name)}</span>
                    </div>
                    
                    {/* Visual Size Indicator */}
                    <div className="flex items-center justify-center mb-2">
                      <div 
                        className="rounded-full border-2 border-blue-400/50 bg-blue-500/20 flex items-center justify-center transition-all duration-300"
                        style={{
                          width: `${40 + (getSizeScale(size.name) - 0.7) * 30}px`,
                          height: `${40 + (getSizeScale(size.name) - 0.7) * 30}px`
                        }}
                      >
                        <span className="text-blue-300 text-xs font-medium">
                          {size.diameter.replace(/[^0-9]/g, '')}″
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(size)}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(size.id)}
                      className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
