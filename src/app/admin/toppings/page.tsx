'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface PizzaTopping {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PizzaToppingsAdmin() {
  const [toppings, setToppings] = useState<PizzaTopping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopping, setEditingTopping] = useState<PizzaTopping | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    available: true
  });

  // Common topping categories matching schema enum
  const categories = [
    'MEAT',
    'VEGETABLE', 
    'CHEESE',
    'SAUCE',
    'SPECIALTY'
  ];

  // Category icons and colors
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      MEAT: '🥓',
      VEGETABLE: '🍅',
      CHEESE: '🧀',
      SAUCE: '🍅',
      SPECIALTY: '⭐'
    };
    return icons[category] || '🍕';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MEAT: 'from-red-500/20 to-orange-500/20',
      VEGETABLE: 'from-green-500/20 to-emerald-500/20',
      CHEESE: 'from-yellow-500/20 to-amber-500/20',
      SAUCE: 'from-red-500/20 to-pink-500/20',
      SPECIALTY: 'from-purple-500/20 to-indigo-500/20'
    };
    return colors[category] || 'from-gray-500/20 to-slate-500/20';
  };

  // Fetch toppings
  const fetchToppings = async () => {
    try {
      const response = await fetch('/api/admin/toppings');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await response.json();
      setToppings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching toppings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToppings();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTopping ? `/api/admin/toppings/${editingTopping.id}` : '/api/admin/toppings';
      const method = editingTopping ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchToppings();
        setShowForm(false);
        setEditingTopping(null);
        setFormData({ name: '', category: '', price: 0, available: true });
      }
    } catch (error) {
      console.error('Error saving topping:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topping?')) return;
    
    try {
      const response = await fetch(`/api/admin/toppings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchToppings();
      }
    } catch (error) {
      console.error('Error deleting topping:', error);
    }
  };

  // Handle edit
  const handleEdit = (topping: PizzaTopping) => {
    setEditingTopping(topping);
    setFormData({
      name: topping.name,
      category: topping.category,
      price: topping.price,
      available: topping.isActive
    });
    setShowForm(true);
  };

  // Toggle availability
  const toggleAvailability = async (id: string, isActive: boolean) => {
    try {
      const topping = toppings.find(t => t.id === id);
      if (!topping) return;

      const response = await fetch(`/api/admin/toppings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...topping,
          available: !isActive
        }),
      });

      if (response.ok) {
        await fetchToppings();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  // Group toppings by category
  const groupedToppings = toppings.reduce((acc, topping) => {
    if (!acc[topping.category]) {
      acc[topping.category] = [];
    }
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, PizzaTopping[]>);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Pizza Toppings</h1>
            <p className="mt-2 text-sm text-gray-300">
              Manage the available pizza toppings for your restaurant.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingTopping(null);
                setFormData({ name: '', category: '', price: 0, available: true });
              }}
              className="block rounded-md bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Add New Topping
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-white/20 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-white">
                {editingTopping ? 'Edit Topping' : 'Add New Topping'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Topping Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Pepperoni, Mushrooms, Extra Cheese"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Or enter custom category"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-600 bg-slate-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                      className="mr-2 bg-slate-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-300">Available</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                  >
                    {editingTopping ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toppings List by Category */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8 text-white">Loading...</div>
          ) : toppings.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              No pizza toppings found. Add your first topping to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedToppings).map(([category, categoryToppings]) => (
                <div key={category} className="overflow-hidden shadow-xl ring-1 ring-white/20 md:rounded-lg backdrop-blur-sm bg-white/10">
                  <div className={`bg-gradient-to-r ${getCategoryColor(category)} backdrop-blur-sm px-6 py-4`}>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      {category} ({categoryToppings.length})
                    </h3>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                      {categoryToppings.map((topping) => (
                        <div key={topping.id} className={`border rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${!topping.isActive ? 'opacity-50 bg-white/5 border-white/10' : 'bg-white/10 border-white/20 hover:bg-white/15'}`}>
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{getCategoryIcon(category)}</span>
                                <h4 className="font-semibold text-white text-lg">{topping.name}</h4>
                              </div>
                              <button
                                onClick={() => toggleAvailability(topping.id, topping.isActive)}
                                className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${topping.isActive ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'}`}
                              >
                                {topping.isActive ? 'Available' : 'Unavailable'}
                              </button>
                            </div>
                            
                            <div className="text-sm text-gray-400">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-700/50 text-gray-300">
                                {category}
                              </span>
                            </div>
                            
                            <div className="text-xl font-bold text-green-400">
                              ${topping.price.toFixed(2)}
                            </div>
                            
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => handleEdit(topping)}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 hover:border-blue-500/50 py-1 px-2 rounded text-sm transition-all duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(topping.id)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-500/50 py-1 px-2 rounded text-sm transition-all duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
