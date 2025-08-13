'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface PizzaSize {
  id: string;
  name: string;
  diameter: string;
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
    diameter: ''
  });

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
        setFormData({ name: '', diameter: '' });
      } else {
        // Handle specific error messages
        const errorMessage = data.error || 'Failed to save size';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error saving size:', error);
      alert('Network error. Please check your connection and try again.');
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
      diameter: size.diameter
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Pizza Sizes</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage the available pizza sizes for your restaurant.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setEditingSize(null);
                setFormData({ name: '', diameter: '' });
              }}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Add Size
            </button>
          </div>
        </div>
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingSize ? 'Edit Size' : 'Add New Size'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Small, Medium, Large"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diameter
                  </label>
                  <input
                    type="text"
                    value={formData.diameter}
                    onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., 10 inches, 12 inches"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    {editingSize ? 'Update' : 'Create'}
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

        {/* Sizes List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Existing Pizza Sizes</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : sizes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pizza sizes found. Add your first size to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diameter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sizes.map((size) => (
                    <tr key={size.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{size.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{size.diameter}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(size)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(size.id)}
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
    </AdminLayout>
  );
}
