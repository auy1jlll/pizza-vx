'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

interface OrderItem {
  id: string;
  pizzaSize?: { name: string; diameter: string };
  toppings?: Array<{ pizzaTopping: { name: string } }>;
  pizza?: { name: string };
  menuItem?: { name: string };
  name?: string;
  quantity?: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
}

interface DashboardStats {
  totalRevenue: number;
  todayOrders: number;
  activeOrders: number;
  averageOrderValue: number;
  todayRevenue: number;
  weekRevenue: number;
  recentOrders: RecentOrder[];
  orderStatusCounts: Record<string, number>;
  componentCounts: {
    sizes: number;
    crusts: number;
    sauces: number;
    toppings: number;
  };
  menuCounts: {
    categories: number;
    items: number;
    customizationGroups: number;
    customizationOptions: number;
  };
}

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const getOrderDescription = (orderItems: any[]) => {
  if (!orderItems || orderItems.length === 0) return 'No items';
  
  const firstItem = orderItems[0];
  let itemName = 'Unknown Item';
  
  // Handle different item types safely
  if (firstItem.pizza?.name) {
    itemName = firstItem.pizza.name;
  } else if (firstItem.pizzaSize?.name) {
    itemName = `${firstItem.pizzaSize.name} Pizza`;
  } else if (firstItem.menuItem?.name) {
    itemName = firstItem.menuItem.name;
  } else if (firstItem.name) {
    itemName = firstItem.name;
  } else {
    itemName = 'Custom Pizza';
  }
  
  if (orderItems.length === 1) {
    return `${firstItem.quantity || 1}x ${itemName}`;
  }
  return `${firstItem.quantity || 1}x ${itemName} + ${orderItems.length - 1} more`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'PREPARING':
      return 'bg-orange-100 text-orange-800';
    case 'READY':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDashboard() {
  const { settings } = useAppSettingsContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError('Failed to fetch dashboard stats');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getOrderDescription = (orderItems: OrderItem[]) => {
    if (!orderItems || orderItems.length === 0) return 'No items';
    
    const firstItem = orderItems[0];
    const additionalCount = orderItems.length - 1;
    
    let description = 'Unknown Item';
    
    // Safely handle different item structures
    if (firstItem.pizzaSize?.name) {
      const toppingsCount = firstItem.toppings?.length || 0;
      description = `${firstItem.pizzaSize.name} Pizza`;
      if (toppingsCount > 0) {
        description += ` (${toppingsCount} topping${toppingsCount > 1 ? 's' : ''})`;
      }
    } else if (firstItem.pizza?.name) {
      description = firstItem.pizza.name;
    } else if (firstItem.menuItem?.name) {
      description = firstItem.menuItem.name;
    } else if (firstItem.name) {
      description = firstItem.name;
    }
    
    if (additionalCount > 0) {
      description += ` +${additionalCount} more`;
    }
    return description;
  };

  const managementCards = [
    {
      title: 'Menu Categories',
      description: 'Manage menu categories, items, and customizations',
      href: '/admin/menu-manager',
      icon: '🍽️',
      gradient: 'from-emerald-500 to-teal-600',
      count: (stats?.menuCounts?.categories || 0),
      unit: 'categories'
    },
    {
      title: 'Pizza Manager',
      description: 'Comprehensive pizza component management hub',
      href: '/admin/pizza-manager',
      icon: '🍕',
      gradient: 'from-orange-500 to-red-600',
      count: (stats?.componentCounts?.sizes || 0) + (stats?.componentCounts?.crusts || 0) + (stats?.componentCounts?.sauces || 0) + (stats?.componentCounts?.toppings || 0),
      unit: 'components'
    },
    {
      title: 'User Management',
      description: 'Manage customers, employees, and user accounts',
      href: '/admin/users',
      icon: '👥',
      gradient: 'from-indigo-500 to-purple-600',
      count: 6, // This could be dynamic based on total users
      unit: 'total users'
    },
    {
      title: 'Content Management',
      description: 'Edit static pages (About, Terms, Privacy, FAQ)',
      href: '/admin/content',
      icon: '📝',
      gradient: 'from-violet-500 to-purple-600',
      count: 5, // Number of content files
      unit: 'pages'
    },
    {
      title: 'Cart Management',
      description: 'Monitor and manage customer shopping carts',
      href: '/admin/carts',
      icon: '🛒',
      gradient: 'from-blue-500 to-cyan-600',
      count: 3, // This could be dynamic based on active carts
      unit: 'active carts'
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      href: '/admin/orders',
      icon: '📋',
      gradient: 'from-purple-500 to-indigo-600',
      count: stats?.activeOrders || 0,
      unit: 'active'
    },
    {
      title: 'Kitchen Display',
      description: 'Real-time order tracking for kitchen staff',
      href: '/admin/kitchen',
      icon: '🍳',
      gradient: 'from-red-500 to-orange-600',
      count: stats?.activeOrders || 0,
      unit: 'active'
    }
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
                <span className="text-5xl mr-3">🍕</span>
                <div>
                  <div className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                    {settings.app_name || 'Pizza Builder Pro'}
                  </div>
                  <div className="text-xl text-white/80 font-normal">Admin Dashboard</div>
                </div>
              </h1>
              <p className="mt-3 text-white/70 text-lg">
                Manage your pizza empire with real-time analytics and intuitive controls
              </p>
            </div>
            <button
              onClick={fetchDashboardStats}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center font-semibold shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="h-5 w-5 mr-3 z-10 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="z-10">Refresh Data</span>
            </button>
          </div>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-8 backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-100">System Error</h3>
                  <p className="mt-1 text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Revenue */}
            <div className="group relative backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-200">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm">All time earnings</span>
                </div>
              </div>
            </div>

            {/* Today's Orders */}
            <div className="group relative backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-green-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Today's Orders</p>
                    <p className="text-3xl font-bold text-white">{stats?.todayOrders || 0}</p>
                  </div>
                </div>
                <div className="flex items-center text-emerald-200">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{stats?.activeOrders || 0} active orders</span>
                </div>
              </div>
            </div>

            {/* Average Order */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
                  <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats?.averageOrderValue || 0)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-purple-100">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm">Per order metric</span>
              </div>
            </div>

            {/* Week Revenue */}
            <div className="group relative backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm font-medium uppercase tracking-wider">This Week</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats?.weekRevenue || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center text-orange-200">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm">Weekly earnings</span>
                </div>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="group relative backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Avg Order</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats?.averageOrderValue || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center text-purple-200">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Order value</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Management Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {managementCards.map((card, index) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-white">{card.count}</div>
                      <div className="text-white/60 text-sm uppercase tracking-wider">{card.unit}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <svg className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Enhanced Recent Orders */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl mb-12 overflow-hidden">
            <div className="p-8 border-b border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="text-3xl mr-3">📋</span>
                    Recent Orders
                  </h2>
                  <p className="text-white/70 mt-2">Latest customer orders and their real-time status</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-xl"
                >
                  <span className="mr-2">View All Orders</span>
                  <svg className="inline h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="p-8">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.slice(0, 5).map((order, index) => (
                    <div 
                      key={order.id} 
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 gap-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {order.orderNumber.slice(-3)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white text-lg">{order.customerName || 'Guest Customer'}</p>
                          <p className="text-white/70 text-sm">{getOrderDescription(order.orderItems)}</p>
                          <p className="text-white/50 text-xs mt-1">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <span className={`px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-xl border ${
                          order.status === 'PENDING' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200' :
                          order.status === 'CONFIRMED' ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' :
                          order.status === 'PREPARING' ? 'bg-orange-500/20 border-orange-500/30 text-orange-200' :
                          order.status === 'READY' ? 'bg-green-500/20 border-green-500/30 text-green-200' :
                          order.status === 'COMPLETED' ? 'bg-gray-500/20 border-gray-500/30 text-gray-200' :
                          'bg-red-500/20 border-red-500/30 text-red-200'
                        } flex-shrink-0 uppercase tracking-wider`}>
                          {order.status}
                        </span>
                        <p className="font-bold text-2xl text-white flex-shrink-0">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No orders yet</h3>
                  <p className="text-white/70">Orders will appear here once customers start placing them.</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Order Status Overview */}
          {stats?.orderStatusCounts && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
              {Object.entries(stats.orderStatusCounts).map(([status, count], index) => (
                <div 
                  key={status} 
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-2">{status}</p>
                      <p className="text-3xl font-bold text-white">{count}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      status === 'PENDING' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                      status === 'CONFIRMED' ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                      status === 'PREPARING' ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                      status === 'READY' ? 'bg-gradient-to-br from-green-400 to-green-500' :
                      status === 'COMPLETED' ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                      'bg-gradient-to-br from-red-400 to-red-500'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {status === 'PENDING' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {status === 'CONFIRMED' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {status === 'PREPARING' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                        {status === 'READY' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                        {status === 'COMPLETED' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {(status === 'CANCELLED' || (!['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].includes(status))) && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Quick Actions */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="text-3xl mr-3">🚀</span>
                  Quick Start Guide
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Get started by configuring your pizza components: sizes, crusts, sauces, and toppings. 
                  Then monitor incoming orders and manage your business operations efficiently.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Link
                  href="/admin/sizes"
                  className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold text-center shadow-xl"
                >
                  <span className="mr-2">Setup Menu</span>
                  <svg className="inline h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/admin/orders"
                  className="group backdrop-blur-xl bg-white/20 border border-white/30 text-white px-8 py-4 rounded-2xl hover:bg-white/30 hover:scale-105 transition-all duration-300 font-semibold text-center shadow-xl"
                >
                  <span className="mr-2">View Orders</span>
                  <svg className="inline h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
