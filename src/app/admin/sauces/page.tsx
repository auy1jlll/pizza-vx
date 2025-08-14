'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface PizzaSauce {
  id: string;
  name: string;
  description: string;
  color: string;
  spiceLevel: number;
  priceModifier: number;
  createdAt: string;
  updatedAt: string;
}

export default function PizzaSaucesAdmin() {
  const [sauces, setSauces] = useState<PizzaSauce[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSauce, setEditingSauce] = useState<PizzaSauce | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#ff0000',
    spiceLevel: 0,
    priceModifier: 0
  });

  // Fetch sauces
  const fetchSauces = async () => {
    try {
      const response = await fetch('/api/admin/sauces');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await response.json();
      setSauces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sauces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSauces();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSauce ? `/api/admin/sauces/${editingSauce.id}` : '/api/admin/sauces';
      const method = editingSauce ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSauces();
        setShowForm(false);
        setEditingSauce(null);
        setFormData({ name: '', description: '', color: '#ff0000', spiceLevel: 0, priceModifier: 0 });
      }
    } catch (error) {
      console.error('Error saving sauce:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sauce?')) return;
    
    try {
      const response = await fetch(`/api/admin/sauces/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSauces();
      }
    } catch (error) {
      console.error('Error deleting sauce:', error);
    }
  };

  // Handle edit
  const handleEdit = (sauce: PizzaSauce) => {
    setEditingSauce(sauce);
    setFormData({
      name: sauce.name,
      description: sauce.description,
      color: sauce.color,
      spiceLevel: sauce.spiceLevel,
      priceModifier: sauce.priceModifier
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-white">Pizza Sauces</h1>
            <p className="mt-2 text-lg text-gray-300">
              Manage the available pizza sauces for your restaurant.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSauce(null);
                setFormData({ name: '', description: '', color: '#ff0000', spiceLevel: 0, priceModifier: 0 });
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">🍅</span>
              <span>Add New Sauce</span>
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingSauce ? 'Edit Sauce' : 'Add New Sauce'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sauce Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="e.g., Marinara, BBQ, White Sauce"
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm resize-none"
                    rows={3}
                    placeholder="Describe the sauce flavor and style"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-12 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="#ff0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spice Level (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, spiceLevel: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0 = Mild</span>
                    <span>5 = Very Spicy</span>
                  </div>
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    {editingSauce ? 'Update Sauce' : 'Create Sauce'}
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

        {/* Sauces List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-white">Loading...</div>
          ) : sauces.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              No pizza sauces found. Add your first sauce to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sauces.map((sauce) => (
                <div
                  key={sauce.id}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${sauce.color}15, rgba(255, 255, 255, 0.05))`,
                  }}
                >
                  {/* Sauce Color Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
                        style={{ backgroundColor: sauce.color }}
                      ></div>
                      <span className="text-2xl">🍅</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${sauce.priceModifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {sauce.priceModifier >= 0 ? '+' : ''}${sauce.priceModifier.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Sauce Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      {sauce.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {sauce.description}
                    </p>
                  </div>

                  {/* Spice Level */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">Spice Level</span>
                      <span className="text-sm text-gray-300">
                        {sauce.spiceLevel === 0 ? 'Mild' : `Level ${sauce.spiceLevel}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {sauce.spiceLevel === 0 ? (
                        <span className="text-blue-400 text-sm">❄️ Mild</span>
                      ) : (
                        <span className="text-red-400">
                          {'🌶️'.repeat(Math.min(sauce.spiceLevel, 5))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(sauce)}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sauce.id)}
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
