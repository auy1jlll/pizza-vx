'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ToastProvider';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  DollarSign,
  Percent,
  Users,
  Tag,
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  minimumQuantity?: number;
  applicableCategories: string[];
  applicableItems: string[];
  requiresLogin: boolean;
  userGroupRestrictions: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  stackable: boolean;
  priority: number;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

const PROMOTION_TYPES = [
  { value: 'PERCENTAGE_DISCOUNT', label: 'Percentage Discount', icon: Percent, color: 'bg-blue-100 text-blue-800' },
  { value: 'FIXED_AMOUNT_DISCOUNT', label: 'Fixed Amount Off', icon: DollarSign, color: 'bg-green-100 text-green-800' },
  { value: 'BOGO_HALF_OFF', label: 'Buy One Get 50% Off', icon: TrendingUp, color: 'bg-orange-100 text-orange-800' },
  { value: 'BOGO_FREE', label: 'Buy One Get One Free', icon: Target, color: 'bg-purple-100 text-purple-800' },
  { value: 'BUY_X_GET_Y_PERCENT', label: 'Buy X Get Y% Off', icon: Tag, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CATEGORY_DISCOUNT', label: 'Category Discount', icon: Filter, color: 'bg-indigo-100 text-indigo-800' },
  { value: 'FREE_DELIVERY', label: 'Free Delivery', icon: TrendingUp, color: 'bg-pink-100 text-pink-800' },
  { value: 'HAPPY_HOUR', label: 'Happy Hour', icon: Clock, color: 'bg-cyan-100 text-cyan-800' }
];

const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage (%)', icon: Percent },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount ($)', icon: DollarSign },
  { value: 'FREE_ITEM', label: 'Free Item/Service', icon: Tag }
];

export default function PromotionsPage() {
  const router = useRouter();
  const { show: showToast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const params = new URLSearchParams();
      if (filterActive !== null) params.append('active', String(filterActive));
      if (filterType) params.append('type', filterType);

      const response = await fetch(`/api/admin/promotions?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPromotions(data.promotions);
      } else {
        showToast(data.error || 'Failed to load promotions', { type: 'error' });
      }
    } catch (error) {
      showToast('Failed to load promotions', { type: 'error' });
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const promotion = promotions.find(p => p.id === id);
      if (!promotion) return;

      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promotion,
          isActive: !isActive
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPromotions(promotions.map(p => 
          p.id === id ? { ...p, isActive: !isActive } : p
        ));
        showToast(`Promotion ${!isActive ? 'activated' : 'deactivated'}`, { type: 'success' });
      } else {
        showToast(data.error || 'Failed to update promotion', { type: 'error' });
      }
    } catch (error) {
      showToast('Failed to update promotion', { type: 'error' });
      console.error('Error updating promotion:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the promotion "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setPromotions(promotions.filter(p => p.id !== id));
        showToast('Promotion deleted successfully', { type: 'success' });
      } else {
        showToast(data.error || 'Failed to delete promotion', { type: 'error' });
      }
    } catch (error) {
      showToast('Failed to delete promotion', { type: 'error' });
      console.error('Error deleting promotion:', error);
    }
  };

  const getTypeInfo = (type: string) => {
    return PROMOTION_TYPES.find(t => t.value === type) || 
           { label: type, icon: Tag, color: 'bg-gray-100 text-gray-800' };
  };

  const getStatusColor = (promotion: Promotion) => {
    if (!promotion.isActive) return 'text-gray-500';
    
    const now = new Date();
    const start = promotion.startDate ? new Date(promotion.startDate) : null;
    const end = promotion.endDate ? new Date(promotion.endDate) : null;
    
    if (start && now < start) return 'text-yellow-600'; // Scheduled
    if (end && now > end) return 'text-red-600'; // Expired
    return 'text-green-600'; // Active
  };

  const getStatusText = (promotion: Promotion) => {
    if (!promotion.isActive) return 'Inactive';
    
    const now = new Date();
    const start = promotion.startDate ? new Date(promotion.startDate) : null;
    const end = promotion.endDate ? new Date(promotion.endDate) : null;
    
    if (start && now < start) return 'Scheduled';
    if (end && now > end) return 'Expired';
    return 'Active';
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || promotion.type === filterType;
    const matchesActive = filterActive === null || promotion.isActive === filterActive;
    
    return matchesSearch && matchesType && matchesActive;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Tag className="mr-4 text-orange-400" size={40} />
                Promotions & Special Offers
              </h1>
              <p className="text-white/70">
                Create and manage promotional campaigns, discounts, and special offers
              </p>
              <div className="mt-3 flex items-center text-sm text-white/60">
                <CheckCircle className="mr-2 text-green-400" size={16} />
                {promotions.filter(p => p.isActive).length} active promotions • {promotions.length} total
              </div>
            </div>
            
            <button
              onClick={() => router.push('/admin/promotions/new')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Create Promotion
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="" className="bg-gray-800">All Types</option>
              {PROMOTION_TYPES.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterActive === null ? '' : String(filterActive)}
              onChange={(e) => setFilterActive(e.target.value === '' ? null : e.target.value === 'true')}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="" className="bg-gray-800">All Status</option>
              <option value="true" className="bg-gray-800">Active</option>
              <option value="false" className="bg-gray-800">Inactive</option>
            </select>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion) => {
            const typeInfo = getTypeInfo(promotion.type);
            const TypeIcon = typeInfo.icon;
            const statusColor = getStatusColor(promotion);
            const statusText = getStatusText(promotion);

            return (
              <div key={promotion.id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                      <TypeIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{promotion.name}</h3>
                      <p className={`text-sm font-medium ${statusColor}`}>
                        {statusText}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(promotion.id, promotion.isActive)}
                      className={`p-1 rounded-lg transition-colors ${
                        promotion.isActive 
                          ? 'text-green-400 hover:bg-green-400/10' 
                          : 'text-gray-400 hover:bg-gray-400/10'
                      }`}
                      title={promotion.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {promotion.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                {/* Description */}
                {promotion.description && (
                  <p className="text-gray-300 text-sm mb-4">{promotion.description}</p>
                )}

                {/* Discount Info */}
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Discount</span>
                    <span className="text-white font-semibold">
                      {promotion.discountType === 'PERCENTAGE' 
                        ? `${promotion.discountValue}%` 
                        : `$${promotion.discountValue}`
                      } off
                    </span>
                  </div>
                  {promotion.minimumOrderAmount && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-300 text-sm">Min. Order</span>
                      <span className="text-white text-sm">${promotion.minimumOrderAmount}</span>
                    </div>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-gray-300 text-xs">Usage</p>
                    <p className="text-white font-semibold">
                      {promotion.usageCount}
                      {promotion.usageLimit && `/${promotion.usageLimit}`}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-xs">Priority</p>
                    <p className="text-white font-semibold">{promotion.priority}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-xs">Login Req.</p>
                    <p className="text-white font-semibold">
                      {promotion.requiresLogin ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {/* Date Range */}
                {(promotion.startDate || promotion.endDate) && (
                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar size={16} className="mr-2" />
                      {promotion.startDate && new Date(promotion.startDate).toLocaleDateString()}
                      {promotion.startDate && promotion.endDate && ' - '}
                      {promotion.endDate && new Date(promotion.endDate).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => router.push(`/admin/promotions/edit/${promotion.id}`)}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id, promotion.name)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
            <Tag className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No Promotions Found</h3>
            <p className="text-gray-300 mb-6">
              {searchTerm || filterType || filterActive !== null
                ? "No promotions match your current filters."
                : "Get started by creating your first promotional campaign."
              }
            </p>
            {!searchTerm && !filterType && filterActive === null && (
              <button
                onClick={() => router.push('/admin/promotions/new')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create First Promotion
              </button>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
