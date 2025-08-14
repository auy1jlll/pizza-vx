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
            <h1 className="text-2xl font-semibold text-gray-900">Pizza Sauces</h1>
            <p className="mt-2 text-sm text-gray-700">
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
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add New Sauce
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingSauce ? 'Edit Sauce' : 'Add New Sauce'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sauce Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Marinara, BBQ, White Sauce"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={3}
                    placeholder="Describe the sauce flavor and style"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                      placeholder="#ff0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spice Level (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, spiceLevel: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    0 = Mild, 5 = Very Spicy
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Modifier ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.priceModifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceModifier: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    {editingSauce ? 'Update' : 'Create'}
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

        {/* Sauces List */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : sauces.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pizza sauces found. Add your first sauce to get started.
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color/Spice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price Modifier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sauces.map((sauce) => (
                    <tr key={sauce.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                            style={{ backgroundColor: sauce.color }}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">{sauce.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{sauce.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {'🌶️'.repeat(sauce.spiceLevel)} {sauce.spiceLevel === 0 ? 'Mild' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${sauce.priceModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sauce.priceModifier >= 0 ? '+' : ''}${sauce.priceModifier.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(sauce)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sauce.id)}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
