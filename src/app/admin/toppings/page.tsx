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
            <h1 className="text-2xl font-semibold text-gray-900">Pizza Toppings</h1>
            <p className="mt-2 text-sm text-gray-700">
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
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add New Topping
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingTopping ? 'Edit Topping' : 'Add New Topping'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topping Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Pepperoni, Mushrooms, Extra Cheese"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="Or enter custom category"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Available</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    {editingTopping ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
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
            <div className="text-center py-8">Loading...</div>
          ) : toppings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pizza toppings found. Add your first topping to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedToppings).map(([category, categoryToppings]) => (
                <div key={category} className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <div className="bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category} ({categoryToppings.length})
                    </h3>
                  </div>
                
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryToppings.map((topping) => (
                        <tr key={topping.id} className={!topping.isActive ? 'opacity-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{topping.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${topping.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleAvailability(topping.id, topping.isActive)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                topping.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {topping.isActive ? 'Available' : 'Unavailable'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(topping)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(topping.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
