'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  createdAt: string;
  updatedAt: string;
}

export default function PizzaCrustsAdmin() {
  const [crusts, setCrusts] = useState<PizzaCrust[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCrust, setEditingCrust] = useState<PizzaCrust | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceModifier: 0
  });

  // Helper functions for crust categorization
  const getCrustType = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('thin')) return 'Thin Crust';
    if (lowerName.includes('thick') || lowerName.includes('deep')) return 'Thick Crust';
    if (lowerName.includes('stuffed')) return 'Stuffed Crust';
    if (lowerName.includes('gluten')) return 'Gluten-Free';
    if (lowerName.includes('whole') || lowerName.includes('wheat')) return 'Whole Wheat';
    return 'Classic';
  };

  const getCrustIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('thin')) return '🥞';
    if (lowerName.includes('thick') || lowerName.includes('deep')) return '🍞';
    if (lowerName.includes('stuffed')) return '🧀';
    if (lowerName.includes('gluten')) return '🌾';
    if (lowerName.includes('whole') || lowerName.includes('wheat')) return '🌾';
    return '🍕';
  };

  const getCrustStyle = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('thin')) return 'Light & Crispy';
    if (lowerName.includes('thick') || lowerName.includes('deep')) return 'Hearty & Filling';
    if (lowerName.includes('stuffed')) return 'Cheesy Surprise';
    if (lowerName.includes('gluten')) return 'Special Diet';
    if (lowerName.includes('whole') || lowerName.includes('wheat')) return 'Healthy Choice';
    return 'Traditional Style';
  };

  // Fetch crusts
  const fetchCrusts = async () => {
    try {
      const response = await fetch('/api/admin/crusts');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await response.json();
      setCrusts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching crusts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrusts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCrust ? `/api/admin/crusts/${editingCrust.id}` : '/api/admin/crusts';
      const method = editingCrust ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCrusts();
        setShowForm(false);
        setEditingCrust(null);
        setFormData({ name: '', description: '', priceModifier: 0 });
      } else {
        const errorMessage = data.error || 'Failed to save crust';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error saving crust:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crust?')) return;
    
    try {
      const response = await fetch(`/api/admin/crusts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCrusts();
      }
    } catch (error) {
      console.error('Error deleting crust:', error);
    }
  };

  // Handle edit
  const handleEdit = (crust: PizzaCrust) => {
    setEditingCrust(crust);
    setFormData({
      name: crust.name,
      description: crust.description,
      priceModifier: crust.priceModifier
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-white">Pizza Crusts</h1>
            <p className="mt-2 text-lg text-gray-300">
              Manage available pizza crust types and their pricing.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setEditingCrust(null);
                setFormData({ name: '', description: '', priceModifier: 0 });
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">🍕</span>
              <span>Add New Crust</span>
            </button>
          </div>
        </div>
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingCrust ? 'Edit Crust' : 'Add New Crust'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Crust Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="e.g., Thin Crust, Thick Crust, Stuffed Crust"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent backdrop-blur-sm resize-none"
                    rows={3}
                    placeholder="Describe the crust style and texture"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Modifier ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.priceModifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceModifier: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="0.00 (use negative for discounts)"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Add to base price. Use 0 for standard pricing, positive for premium, negative for discounts.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    {editingCrust ? 'Update Crust' : 'Create Crust'}
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

        {/* Crusts List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-white">Loading...</div>
          ) : crusts.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              No pizza crusts found. Add your first crust to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {crusts.map((crust) => (
                <div
                  key={crust.id}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(255, 255, 255, 0.05))`,
                  }}
                >
                  {/* Crust Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-lg">🍕</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${crust.priceModifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crust.priceModifier >= 0 ? '+' : ''}${crust.priceModifier.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Crust Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {crust.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {crust.description}
                    </p>
                  </div>

                  {/* Crust Type Indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">Crust Type</span>
                      <span className="text-sm text-gray-300">
                        {getCrustType(crust.name)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-400">
                        {getCrustIcon(crust.name)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {getCrustStyle(crust.name)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(crust)}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(crust.id)}
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
