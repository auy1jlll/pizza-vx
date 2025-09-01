'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ToastProvider';
import { 
  ArrowLeft,
  Save,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Percent,
  Users,
  Tag,
  Clock,
  Target,
  Settings,
  HelpCircle
} from 'lucide-react';

const PROMOTION_TYPES = [
  { 
    value: 'PERCENTAGE_DISCOUNT', 
    label: 'Percentage Discount', 
    description: 'X% off total order or specific items',
    requiresCategories: false,
    supportsMinimum: true
  },
  { 
    value: 'FIXED_AMOUNT_DISCOUNT', 
    label: 'Fixed Amount Off', 
    description: 'Fixed dollar amount off total order',
    requiresCategories: false,
    supportsMinimum: true
  },
  { 
    value: 'BOGO_HALF_OFF', 
    label: 'Buy One Pizza Get 50% Off', 
    description: 'Buy one pizza, get the second pizza at 50% off (calzones excluded)',
    requiresCategories: true,
    supportsMinimum: false
  },
  { 
    value: 'BOGO_FREE', 
    label: 'Buy One Get One Free', 
    description: 'Buy one item, get another item free',
    requiresCategories: true,
    supportsMinimum: false
  },
  { 
    value: 'BUY_X_GET_Y_PERCENT', 
    label: 'Buy X Get Y% Off', 
    description: 'Buy X items and get Y% off total',
    requiresCategories: true,
    supportsMinimum: false
  },
  { 
    value: 'CATEGORY_DISCOUNT', 
    label: 'Category Discount', 
    description: 'Discount on specific product categories',
    requiresCategories: true,
    supportsMinimum: true
  },
  { 
    value: 'FREE_DELIVERY', 
    label: 'Free Delivery', 
    description: 'Waive delivery charges',
    requiresCategories: false,
    supportsMinimum: true
  },
  { 
    value: 'HAPPY_HOUR', 
    label: 'Happy Hour', 
    description: 'Time-based promotional pricing',
    requiresCategories: true,
    supportsMinimum: false
  }
];

const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage (%)', symbol: '%' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount ($)', symbol: '$' },
  { value: 'FREE_ITEM', label: 'Free Item/Service', symbol: 'FREE' }
];

const USER_GROUPS = [
  { value: 'CUSTOMER', label: 'All Customers' },
  { value: 'VIP', label: 'VIP Customers' },
  { value: 'FIRST_TIME', label: 'First-Time Customers' },
  { value: 'REPEAT', label: 'Repeat Customers' },
  { value: 'EMPLOYEE', label: 'Employees' }
];

// Mock categories - replace with actual categories from your database
const CATEGORIES = [
  { id: 'pizza', name: 'Pizzas' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'salads', name: 'Salads' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' }
];

export default function NewPromotionPage() {
  const router = useRouter();
  const { show: showToast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minimumOrderAmount: '',
    maximumDiscountAmount: '',
    minimumQuantity: '',
    applicableCategories: [] as string[],
    applicableItems: [] as string[],
    requiresLogin: false,
    userGroupRestrictions: [] as string[],
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: '',
    perUserLimit: '',
    stackable: false,
    priority: 0,
    terms: ''
  });

  const selectedTypeInfo = PROMOTION_TYPES.find(t => t.value === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        showToast('Promotion name is required', { type: 'error' });
        return;
      }

      if (!formData.type) {
        showToast('Promotion type is required', { type: 'error' });
        return;
      }

      if (formData.discountValue <= 0) {
        showToast('Discount value must be greater than 0', { type: 'error' });
        return;
      }

      if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
        showToast('Percentage discount cannot exceed 100%', { type: 'error' });
        return;
      }

      if (selectedTypeInfo?.requiresCategories && formData.applicableCategories.length === 0) {
        showToast('Please select at least one category for this promotion type', { type: 'error' });
        return;
      }

      // Prepare data
      const submissionData = {
        ...formData,
        minimumOrderAmount: formData.minimumOrderAmount ? parseFloat(formData.minimumOrderAmount) : null,
        maximumDiscountAmount: formData.maximumDiscountAmount ? parseFloat(formData.maximumDiscountAmount) : null,
        minimumQuantity: formData.minimumQuantity ? parseInt(formData.minimumQuantity) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: formData.perUserLimit ? parseInt(formData.perUserLimit) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null
      };

      const response = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Promotion created successfully!', { type: 'success' });
        router.push('/management-portal/promotions');
      } else {
        showToast(data.error || 'Failed to create promotion', { type: 'error' });
      }
    } catch (error) {
      showToast('Failed to create promotion', { type: 'error' });
      console.error('Error creating promotion:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(categoryId)
        ? prev.applicableCategories.filter(id => id !== categoryId)
        : [...prev.applicableCategories, categoryId]
    }));
  };

  const handleUserGroupToggle = (group: string) => {
    setFormData(prev => ({
      ...prev,
      userGroupRestrictions: prev.userGroupRestrictions.includes(group)
        ? prev.userGroupRestrictions.filter(g => g !== group)
        : [...prev.userGroupRestrictions, group]
    }));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Tag className="mr-4 text-orange-400" size={40} />
                  Create New Promotion
                </h1>
                <p className="text-white/70">
                  Set up a new promotional campaign with flexible discount rules
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Info className="mr-3 text-orange-400" size={24} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Promotion Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., Summer Special 25% Off"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Priority Level
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="0"
                  min="0"
                />
                <p className="text-gray-400 text-sm mt-1">Higher numbers have priority</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Describe your promotion..."
                rows={3}
              />
            </div>
          </div>

          {/* Promotion Type & Discount */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Percent className="mr-3 text-orange-400" size={24} />
              Promotion Type & Discount
            </h2>

            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                Promotion Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROMOTION_TYPES.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'border-orange-400 bg-orange-400/10'
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  >
                    <h3 className="text-white font-medium mb-2">{type.label}</h3>
                    <p className="text-gray-300 text-sm">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  {DISCOUNT_TYPES.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {formData.discountType === 'PERCENTAGE' ? '%' : '$'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Maximum Discount ($)
                </label>
                <input
                  type="number"
                  value={formData.maximumDiscountAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maximumDiscountAmount: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="No limit"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="mr-3 text-orange-400" size={24} />
              Conditions & Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {selectedTypeInfo?.supportsMinimum && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    Minimum Order Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumOrderAmount: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="No minimum"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}

              <div>
                <label className="block text-white font-medium mb-2">
                  Minimum Quantity
                </label>
                <input
                  type="number"
                  value={formData.minimumQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimumQuantity: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="No minimum"
                  min="1"
                />
              </div>
            </div>

            {/* Categories */}
            {selectedTypeInfo?.requiresCategories && (
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  Applicable Categories *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CATEGORIES.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400 focus:ring-offset-0"
                      />
                      <span className="text-white">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Login Requirements */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.requiresLogin}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresLogin: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400 focus:ring-offset-0"
                />
                <span className="text-white font-medium">Requires Customer Login</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Check this if customers must be logged in to use this promotion
              </p>
            </div>

            {/* User Group Restrictions */}
            {formData.requiresLogin && (
              <div>
                <label className="block text-white font-medium mb-3">
                  User Group Restrictions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {USER_GROUPS.map((group) => (
                    <label
                      key={group.value}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.userGroupRestrictions.includes(group.value)}
                        onChange={() => handleUserGroupToggle(group.value)}
                        className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400 focus:ring-offset-0"
                      />
                      <span className="text-white">{group.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Leave empty to allow all logged-in users
                </p>
              </div>
            )}
          </div>

          {/* Schedule & Limits */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Clock className="mr-3 text-orange-400" size={24} />
              Schedule & Usage Limits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Unlimited"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Per User Limit
                </label>
                <input
                  type="number"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, perUserLimit: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Unlimited"
                  min="1"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.stackable}
                  onChange={(e) => setFormData(prev => ({ ...prev, stackable: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400 focus:ring-offset-0"
                />
                <span className="text-white font-medium">Stackable with Other Promotions</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Allow this promotion to be combined with other active promotions
              </p>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400 focus:ring-offset-0"
                />
                <span className="text-white font-medium">Active</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Promotion will be available to customers when active
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <HelpCircle className="mr-3 text-orange-400" size={24} />
              Terms & Conditions
            </h2>

            <div>
              <label className="block text-white font-medium mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter any terms, conditions, or restrictions for this promotion..."
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Promotion
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
