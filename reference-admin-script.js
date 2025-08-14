import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  MapPin,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Pizza,
  Sandwich
} from 'lucide-react';

export default function PizzaAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const stats = {
    totalRevenue: 12847.50,
    todayOrders: 47,
    activeCustomers: 892,
    averageOrderValue: 28.50
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', items: 'Large Pepperoni Pizza', total: 18.99, status: 'preparing', time: '2 min ago' },
    { id: 'ORD-002', customer: 'Sarah Smith', items: 'Italian Sub + Fries', total: 12.50, status: 'ready', time: '5 min ago' },
    { id: 'ORD-003', customer: 'Mike Johnson', items: 'Medium Margherita', total: 15.99, status: 'delivered', time: '12 min ago' },
    { id: 'ORD-004', customer: 'Lisa Chen', items: 'Turkey Club Sub', total: 9.99, status: 'pending', time: '15 min ago' }
  ];

  const menuItems = [
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 15.99, stock: 'In Stock', sales: 45 },
    { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 18.99, stock: 'In Stock', sales: 67 },
    { id: 3, name: 'Italian Sub', category: 'Sandwiches', price: 12.50, stock: 'Low Stock', sales: 23 },
    { id: 4, name: 'Turkey Club', category: 'Sandwiches', price: 9.99, stock: 'In Stock', sales: 34 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock) => {
    switch (stock) {
      case 'In Stock': return 'text-green-600';
      case 'Low Stock': return 'text-yellow-600';
      case 'Out of Stock': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', badge: null },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', badge: '12' },
    { id: 'menu', icon: Package, label: 'Menu Management', badge: null },
    { id: 'customers', icon: Users, label: 'Customers', badge: null },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center text-blue-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12.5% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Today's Orders</p>
                    <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center text-green-100">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">3 pending</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Active Customers</p>
                    <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center text-purple-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+8.2% this week</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Avg Order Value</p>
                    <p className="text-2xl font-bold">${stats.averageOrderValue}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center text-orange-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+5.1% from yesterday</span>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                          {order.items.includes('Pizza') ? <Pizza className="h-5 w-5 text-white" /> : <Sandwich className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="font-semibold text-gray-900">${order.total}</p>
                        <p className="text-sm text-gray-500">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                              {item.category === 'Pizza' ? <Pizza className="h-5 w-5 text-white" /> : <Sandwich className="h-5 w-5 text-white" />}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getStockColor(item.stock)}`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sales} this week</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 p-1">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-700 p-1">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 p-1">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <div className="flex items-center space-x-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Delivered</option>
                </select>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Refresh Orders
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Pending: 3</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Preparing: 5</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Ready: 2</span>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Delivered: 37</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{order.id.split('-')[1]}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{order.customer}</p>
                            <p className="text-sm text-gray-600">{order.items}</p>
                            <p className="text-xs text-gray-500">{order.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                          <p className="font-bold text-lg text-gray-900">${order.total}</p>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h2>
            <p className="text-gray-500">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Pizza className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Pizza Builder Pro Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-80"
              />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@pizzabuilder.com</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}