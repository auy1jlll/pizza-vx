'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Tag,
  List
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CustomizationGroup {
  id: string;
  name: string;
  description?: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'QUANTITY_SELECT' | 'SPECIAL_LOGIC';
  isRequired: boolean;
  minSelections: number;
  maxSelections?: number;
  sortOrder: number;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    options: number;
    menuItemCustomizations: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CustomizationOption {
  id: string;
  name: string;
  description?: string;
  priceModifier: number;
  priceType: 'FLAT' | 'PERCENTAGE' | 'PER_UNIT';
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  group: {
    id: string;
    name: string;
    type: string;
  };
}

export default function CustomizationsPage() {
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'groups' | 'options'>('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [groupsResponse, optionsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/admin/menu/customization-groups'),
        fetch('/api/admin/menu/customization-options'),
        fetch('/api/admin/menu/categories')
      ]);

      const [groupsResult, optionsResult, categoriesResult] = await Promise.all([
        groupsResponse.json(),
        optionsResponse.json(),
        categoriesResponse.json()
      ]);

      if (groupsResult.success) {
        setGroups(groupsResult.data);
      }
      
      if (optionsResult.success) {
        setOptions(optionsResult.data);
      }

      // Categories response might be a direct array or wrapped in an object
      if (Array.isArray(categoriesResult)) {
        setCategories(categoriesResult);
      } else if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
      } else if (categoriesResult.categories) {
        setCategories(categoriesResult.categories);
      }
      
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error fetching customizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SINGLE_SELECT': return '⚪';
      case 'MULTI_SELECT': return '☑️';
      case 'QUANTITY_SELECT': return '🔢';
      case 'SPECIAL_LOGIC': return '⚙️';
      default: return '❓';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SINGLE_SELECT': return 'from-blue-500 to-indigo-500';
      case 'MULTI_SELECT': return 'from-green-500 to-emerald-500';
      case 'QUANTITY_SELECT': return 'from-purple-500 to-pink-500';
      case 'SPECIAL_LOGIC': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || group.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || 
                           (categoryFilter === 'global' && !group.category) ||
                           (group.category?.slug === categoryFilter);
    return matchesSearch && matchesType && matchesCategory;
  });

  const filteredOptions = options.filter(option => {
    const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         option.group.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/menu-manager"
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">⚙️</span>
                  Customizations
                </h1>
                <p className="text-white/70 mt-2">
                  Manage customization groups and options
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/menu-manager/customizations/new" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl">
                <Plus className="h-5 w-5 inline mr-2" />
                Add Group
              </Link>
              <Link href="/admin/menu-manager/customizations/options/new" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl">
                <Tag className="h-5 w-5 inline mr-2" />
                Add Option
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Instructions Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Understanding Customization System</h2>
                <p className="text-white/70">Learn how customization groups and options work together</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">📋 Customization Groups</h3>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">⚪</span>
                      <span className="font-medium text-white">Single Select</span>
                    </div>
                    <p className="text-white/70 text-sm">Customer picks ONE option (e.g., Size: Small/Medium/Large)</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">☑️</span>
                      <span className="font-medium text-white">Multi Select</span>
                    </div>
                    <p className="text-white/70 text-sm">Customer picks MULTIPLE options (e.g., Toppings: Lettuce + Tomato + Cheese)</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">🔢</span>
                      <span className="font-medium text-white">Quantity Select</span>
                    </div>
                    <p className="text-white/70 text-sm">Customer picks quantity for each option (e.g., Extra Cheese: 1x, 2x, 3x)</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">⚙️</span>
                      <span className="font-medium text-white">Special Logic</span>
                    </div>
                    <p className="text-white/70 text-sm">Custom rules (e.g., Dinner Plates: "Pick 2 of 3 sides")</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">🔧 How It Works</h3>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">1️⃣</span>
                      <span className="font-medium text-white">Create Groups</span>
                    </div>
                    <p className="text-white/70 text-sm">Define categories like "Bread", "Condiments", "Protein"</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">2️⃣</span>
                      <span className="font-medium text-white">Add Options</span>
                    </div>
                    <p className="text-white/70 text-sm">Fill groups with choices: White Bread ($0), Wheat Bread (+$0.50)</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">3️⃣</span>
                      <span className="font-medium text-white">Link to Menu Items</span>
                    </div>
                    <p className="text-white/70 text-sm">Assign groups to menu items (Turkey Club → Bread + Condiments)</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">✨</span>
                      <span className="font-medium text-white">Customer Orders</span>
                    </div>
                    <p className="text-white/70 text-sm">Customers see customization options when ordering menu items</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💰</span>
                <span className="font-medium text-amber-300">Pricing Tips</span>
              </div>
              <p className="text-amber-200/80 text-sm">
                • Set price modifiers for premium options (e.g., Avocado +$2.00)<br/>
                • Mark common options as "Default" for faster ordering<br/>
                • Use negative prices for discounts (e.g., No Cheese -$1.00)
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all duration-300 ${
                activeTab === 'groups'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg'
                  : 'hover:bg-white/10'
              }`}
            >
              <Settings className="h-5 w-5 inline mr-2" />
              Customization Groups ({groups.length})
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all duration-300 ${
                activeTab === 'options'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
                  : 'hover:bg-white/10'
              }`}
            >
              <List className="h-5 w-5 inline mr-2" />
              Customization Options ({options.length})
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={activeTab === 'groups' ? 'Search groups...' : 'Search options...'}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {activeTab === 'groups' && (
                <>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Type Filter
                    </label>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                      >
                        <option value="all" className="bg-slate-800">All Types</option>
                        <option value="SINGLE_SELECT" className="bg-slate-800">Single Select</option>
                        <option value="MULTI_SELECT" className="bg-slate-800">Multi Select</option>
                        <option value="QUANTITY_SELECT" className="bg-slate-800">Quantity Select</option>
                        <option value="SPECIAL_LOGIC" className="bg-slate-800">Special Logic</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Category Filter
                    </label>
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                      >
                        <option value="all" className="bg-slate-800">All Categories</option>
                        <option value="global" className="bg-slate-800">Global</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.slug} className="bg-slate-800 capitalize">
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'groups' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <div className={`bg-gradient-to-r ${getTypeColor(group.type)} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{getTypeIcon(group.type)}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">{group.name}</h3>
                          <p className="text-white/80 text-sm">{group.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      {group.isActive ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <XCircle className="h-6 w-6 text-white/50" />
                      )}
                    </div>
                    {group.description && (
                      <p className="text-white/90 text-sm mt-2">{group.description}</p>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{group._count.options}</p>
                        <p className="text-white/70 text-sm">Options</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{group._count.menuItemCustomizations}</p>
                        <p className="text-white/70 text-sm">Used By</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm text-white/70">
                        <span>Category:</span>
                        <span className="font-medium">{group.category?.name || 'Global'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-white/70">
                        <span>Required:</span>
                        <span className="font-medium">{group.isRequired ? 'Yes' : 'No'}</span>
                      </div>
                      {group.minSelections > 0 && (
                        <div className="flex justify-between items-center text-sm text-white/70">
                          <span>Min Selections:</span>
                          <span className="font-medium">{group.minSelections}</span>
                        </div>
                      )}
                      {group.maxSelections && (
                        <div className="flex justify-between items-center text-sm text-white/70">
                          <span>Max Selections:</span>
                          <span className="font-medium">{group.maxSelections}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-center transition-all duration-300 text-sm font-medium">
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </button>
                      <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium">
                        <Edit className="h-4 w-4 inline mr-1" />
                        Edit
                      </button>
                      <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500/20 p-3 rounded-xl">
                        <Tag className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{option.name}</h3>
                        <p className="text-white/70">Group: {option.group.name}</p>
                        {option.description && (
                          <p className="text-white/60 text-sm mt-1">{option.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {option.priceModifier >= 0 ? '+' : ''}
                        {option.priceType === 'PERCENTAGE' ? `${option.priceModifier}%` : `$${option.priceModifier}`}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        {option.isDefault && (
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Default</span>
                        )}
                        {option.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium">
                      <Edit className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === 'groups' && filteredGroups.length === 0) || 
            (activeTab === 'options' && filteredOptions.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No {activeTab === 'groups' ? 'Groups' : 'Options'} Found
              </h3>
              <p className="text-white/70 mb-6">
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                  ? `No ${activeTab} match your current filters.`
                  : `Get started by creating your first customization ${activeTab.slice(0, -1)}.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
