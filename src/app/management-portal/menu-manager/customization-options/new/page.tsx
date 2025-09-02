'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';

interface CustomizationGroup {
  id: string;
  name: string;
  type: string;
}

export default function NewCustomizationOptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceModifier: '',
    priceType: 'FLAT',
    sortOrder: 0,
    isActive: true,
    isDefault: false,
    groupId: searchParams.get('groupId') || '' // Changed from customizationGroupId
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/management-portal/menu/customization-groups');
      
      if (response.status === 401) {
        console.error('Authentication error - please log in as admin');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        const groupsData = Array.isArray(data) ? data : data.groups || [];
        setGroups(groupsData);
      } else {
        console.error('Failed to fetch groups:', response.status);
      }
    } catch (error) {
      console.error('Error fetching customization groups:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        priceModifier: parseFloat(formData.priceModifier) || 0
      };
      
      // Debug logging
      console.log('🐛 Starting request...');
      console.log('🐛 Payload being sent:', payload);
      console.log('🐛 Form data before transformation:', formData);

      const response = await fetch('/api/management-portal/menu/customization-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('🐛 Response status:', response.status);
      console.log('🐛 Response ok:', response.ok);

      if (response.ok) {
        console.log('✅ Success!');
        const groupId = formData.groupId; // Changed from customizationGroupId
        if (groupId) {
          router.push(`/management-portal/menu-manager/customization-groups/${groupId}`);
        } else {
          router.push('/management-portal/menu-manager/customization-groups');
        }
      } else {
        const error = await response.json();
        console.log('🚨 Error response:', error);
        console.log('🚨 Error details:', JSON.stringify(error, null, 2));
        alert('Error creating customization option: ' + (error.error || 'Unknown error') + 
              (error.details ? '\\nDetails: ' + error.details.join(', ') : ''));
      }
    } catch (error) {
      console.error('Error creating customization option:', error);
      alert('Error creating customization option');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Add New Customization Option</h1>
            <p className="text-gray-300">Create a new option for a customization group</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customization Group *
            </label>
            <select
              required
              value={formData.groupId} // Changed from customizationGroupId
              onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))} // Changed from customizationGroupId
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Group</option>
              {Array.isArray(groups) && groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.type.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Option Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Large, Extra Cheese, Pepperoni"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Modifier
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.priceModifier}
                onChange={(e) => setFormData(prev => ({ ...prev, priceModifier: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Use negative values for discounts</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Type *
            </label>
            <select
              required
              value={formData.priceType || 'FLAT'}
              onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="FLAT">FLAT - Fixed amount ($3.00)</option>
              <option value="PERCENTAGE">PERCENTAGE - Percentage of base price (10%)</option>
              <option value="PER_UNIT">PER_UNIT - Price per quantity ($1.50 each)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">How the price modifier should be applied</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Optional description for this option..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Set as Default</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">This option will be pre-selected for customers</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Creating...' : 'Create Option'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
