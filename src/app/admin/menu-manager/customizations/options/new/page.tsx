'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface CustomizationGroup {
  id: string;
  name: string;
  type: string;
  category?: {
    id: string;
    name: string;
  };
}

export default function NewCustomizationOptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [formData, setFormData] = useState({
    groupId: '',
    name: '',
    description: '',
    priceModifier: 0,
    priceType: 'FLAT' as const,
    isDefault: false,
    isActive: true,
    sortOrder: 1,
    nutritionInfo: '',
    allergens: '',
    imageUrl: '',
    maxQuantity: null as number | null
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/admin/menu/customization-groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching customization groups:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        priceModifier: parseFloat(formData.priceModifier.toString()),
        sortOrder: parseInt(formData.sortOrder.toString()),
        maxQuantity: formData.maxQuantity
      };

      const response = await fetch('/api/admin/menu/customization-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.push('/admin/menu-manager/customizations');
      } else {
        alert('Error creating customization option: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating customization option:', error);
      alert('Error creating customization option');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseFloat(value) || 0
              : value
    }));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/menu-manager/customizations"
              className="bg-white/20 hover:bg-white/30 text-orange-600 p-2 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <span className="text-4xl mr-3">🏷️</span>
                New Customization Option
              </h1>
              <p className="text-white/70 mt-2">
                Add a new option to a customization group
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Option Details</h2>
                
                <div>
                  <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-2">
                    Customization Group *
                  </label>
                  <select
                    id="groupId"
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a customization group</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name} {group.category ? `(${group.category.name})` : '(Global)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Option Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Large, Extra Cheese, No Onions"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Optional description for this option"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priceModifier" className="block text-sm font-medium text-gray-700 mb-2">
                      Price Modifier
                    </label>
                    <input
                      type="number"
                      id="priceModifier"
                      name="priceModifier"
                      value={formData.priceModifier}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <p className="text-sm text-gray-500 mt-1">Additional cost for this option</p>
                  </div>

                  <div>
                    <label htmlFor="priceType" className="block text-sm font-medium text-gray-700 mb-2">
                      Price Type
                    </label>
                    <select
                      id="priceType"
                      name="priceType"
                      value={formData.priceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="FLAT">Flat Rate ($2.00)</option>
                      <option value="PERCENTAGE">Percentage (10%)</option>
                      <option value="PER_UNIT">Per Unit ($0.50 each)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="allergens" className="block text-sm font-medium text-gray-700 mb-2">
                    Allergen Information
                  </label>
                  <input
                    type="text"
                    id="allergens"
                    name="allergens"
                    value={formData.allergens}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Contains dairy, nuts"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Flags */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                      Default Selection
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Available
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end space-x-4">
                <Link
                  href="/admin/menu-manager/customizations"
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 inline mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 inline mr-2" />
                      Create Option
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
