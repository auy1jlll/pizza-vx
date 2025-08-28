'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/components/AdminNavigation';
import { designSystem, colors, components } from '@/lib/design-system';

interface AnalyticsData {
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  seo: {
    rankings: Array<{
      keyword: string;
      position: number;
      change: number;
      competition: string;
    }>;
    traffic: {
      organic: number;
      direct: number;
      social: number;
      referral: number;
    };
  };
  topProducts: Array<{
    name: string;
    orders: number;
    revenue: number;
    growth: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    items: string;
    total: number;
    time: string;
    status: string;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate analytics data (replace with real API calls)
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        orders: {
          total: 1247,
          today: 23,
          thisWeek: 156,
          thisMonth: 478,
          growth: 12.5
        },
        revenue: {
          total: 28750.50,
          today: 567.25,
          thisWeek: 3425.75,
          thisMonth: 11250.25,
          growth: 18.3
        },
        customers: {
          total: 892,
          new: 45,
          returning: 847,
          growth: 8.7
        },
        seo: {
          rankings: [
            { keyword: 'pizza Greenland NH', position: 3, change: 2, competition: 'Nick & Charlie Pizza' },
            { keyword: 'pizza delivery Greenland', position: 2, change: 1, competition: 'Local Competitors' },
            { keyword: 'best pizza Seacoast NH', position: 5, change: 3, competition: 'Regional Chains' },
            { keyword: 'Italian restaurant Greenland', position: 4, change: 1, competition: 'Local Italian' },
            { keyword: 'pizza Portsmouth NH', position: 6, change: 2, competition: 'Portsmouth Pizza' }
          ],
          traffic: {
            organic: 2847,
            direct: 1256,
            social: 678,
            referral: 456
          }
        },
        topProducts: [
          { name: 'Greenland Special Pizza', orders: 89, revenue: 1893.50, growth: 15.2 },
          { name: 'Margherita Classic', orders: 67, revenue: 1258.75, growth: 8.9 },
          { name: 'Portsmouth Supreme', orders: 54, revenue: 1456.25, growth: 22.1 },
          { name: 'Caesar Salad', orders: 78, revenue: 701.22, growth: 5.7 },
          { name: 'Seacoast Seafood Pizza', orders: 32, revenue: 895.50, growth: 28.4 }
        ],
        recentOrders: [
          { id: '#1247', customer: 'Sarah M.', items: 'Greenland Special (L), Caesar Salad', total: 34.98, time: '12 min ago', status: 'Preparing' },
          { id: '#1246', customer: 'Mike T.', items: 'Margherita Classic (M), Garlic Bread', total: 24.48, time: '18 min ago', status: 'Out for delivery' },
          { id: '#1245', customer: 'Lisa P.', items: 'Portsmouth Supreme (L), Wings', total: 39.97, time: '25 min ago', status: 'Delivered' },
          { id: '#1244', customer: 'John D.', items: 'Build Your Own (M), Soft Drink', total: 19.98, time: '32 min ago', status: 'Delivered' },
          { id: '#1243', customer: 'Emma W.', items: 'Seacoast Seafood (L), Tiramisu', total: 36.98, time: '45 min ago', status: 'Delivered' }
        ]
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminNavigation />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const StatCard = ({ title, value, change, icon, prefix = '', suffix = '' }: {
    title: string;
    value: string | number;
    change: number;
    icon: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className={`${components.card.glass} p-6 rounded-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
        <span className={`text-sm flex items-center ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminNavigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`${designSystem.h1} text-white`}>
              📊 Restaurant Analytics
            </h1>
            <p className="text-gray-300 mt-2">
              Track your performance and SEO success against competitors
            </p>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`${components.input.glass} rounded-lg`}
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={analyticsData.orders.thisMonth}
            change={analyticsData.orders.growth}
            icon="🍕"
          />
          <StatCard
            title="Revenue"
            value={analyticsData.revenue.thisMonth.toFixed(2)}
            change={analyticsData.revenue.growth}
            icon="💰"
            prefix="$"
          />
          <StatCard
            title="Customers"
            value={analyticsData.customers.total}
            change={analyticsData.customers.growth}
            icon="👥"
          />
        </div>

        {/* SEO Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${components.card.glass} p-6 rounded-xl`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              🔍 SEO Rankings vs Competitors
            </h2>
            <div className="space-y-4">
              {analyticsData.seo.rankings.map((rank, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{rank.keyword}</p>
                    <p className="text-gray-400 text-sm">vs {rank.competition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">#{rank.position}</p>
                    <p className={`text-sm ${rank.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {rank.change > 0 ? '↗' : '↘'} {Math.abs(rank.change)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${components.card.glass} p-6 rounded-xl`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              🌐 Traffic Sources
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🔍 Organic Search</span>
                <span className="text-white font-bold">{analyticsData.seo.traffic.organic.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🔗 Direct</span>
                <span className="text-white font-bold">{analyticsData.seo.traffic.direct.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">📱 Social Media</span>
                <span className="text-white font-bold">{analyticsData.seo.traffic.social.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">🔄 Referral</span>
                <span className="text-white font-bold">{analyticsData.seo.traffic.referral.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${components.card.glass} p-6 rounded-xl`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              🏆 Top Performing Items
            </h2>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">{product.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${product.revenue.toFixed(2)}</p>
                    <p className="text-green-400 text-sm">↗ {product.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${components.card.glass} p-6 rounded-xl`}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              📋 Recent Orders
            </h2>
            <div className="space-y-4">
              {analyticsData.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{order.id} - {order.customer}</p>
                    <p className="text-gray-400 text-sm">{order.items}</p>
                    <p className="text-gray-500 text-xs">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'Out for delivery' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitive Analysis Section */}
        <div className={`${components.card.glass} p-6 rounded-xl mt-8`}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            ⚔️ Competitive Analysis: RestoApp vs Nick & Charlie Pizza
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">🏆 SEO Performance</h3>
              <p className="text-green-400 text-2xl font-bold">WINNING</p>
              <p className="text-gray-300 text-sm">Ranking higher for 4/5 target keywords</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">📱 Website Quality</h3>
              <p className="text-green-400 text-2xl font-bold">SUPERIOR</p>
              <p className="text-gray-300 text-sm">Modern design vs outdated competitor site</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">🚀 Growth Rate</h3>
              <p className="text-green-400 text-2xl font-bold">+18.3%</p>
              <p className="text-gray-300 text-sm">Revenue growth this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
