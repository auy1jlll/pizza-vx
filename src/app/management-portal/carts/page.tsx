'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { ShoppingCart, Eye, Trash2, Users, Clock, DollarSign, Search, Filter, RefreshCw } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: any;
  type: 'pizza' | 'menu';
}

interface CustomerCart {
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalItems: number;
  totalValue: number;
  lastUpdated: string;
  sessionId?: string;
}

export default function AdminCartPage() {
  const [carts, setCarts] = useState<CustomerCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');

  useEffect(() => {
    fetchActiveCarts();
  }, []);

  const fetchActiveCarts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/management-portal/carts');
      if (response.ok) {
        const data = await response.json();
        setCarts(data.carts || []);
      } else {
        setError('Failed to fetch cart data');
      }
    } catch (error) {
      console.error('Error fetching carts:', error);
      setError('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (userId: string) => {
    if (!confirm('Are you sure you want to clear this customer\'s cart?')) {
      return;
    }

    try {
      const response = await fetch(`/api/management-portal/carts/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchActiveCarts(); // Refresh the list
      } else {
        setError('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
    }
  };

  const viewCartDetails = (cart: CustomerCart) => {
    // You could open a modal or navigate to a detailed view
    console.log('View cart details:', cart);
  };

  // Filter and sort carts
  const filteredCarts = carts
    .filter(cart => {
      const matchesSearch = 
        cart.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cart.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'large' && cart.totalItems >= 5) ||
        (filterType === 'valuable' && cart.totalValue >= 50);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'customerName':
          return a.customerName.localeCompare(b.customerName);
        case 'totalValue':
          return b.totalValue - a.totalValue;
        case 'totalItems':
          return b.totalItems - a.totalItems;
        case 'lastUpdated':
        default:
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

  const totalActiveCustomers = carts.length;
  const totalItemsInCarts = carts.reduce((sum, cart) => sum + cart.totalItems, 0);
  const totalValueInCarts = carts.reduce((sum, cart) => sum + cart.totalValue, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-orange-400" />
                  Cart Management
                </h1>
                <p className="mt-2 text-white/70">Monitor and manage customer shopping carts</p>
              </div>
              <button
                onClick={fetchActiveCarts}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Active Carts</p>
                  <p className="text-2xl font-bold text-white">{totalActiveCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-white">{totalItemsInCarts}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-white">${totalValueInCarts.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by customer name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Carts</option>
                  <option value="large">Large Carts (5+ items)</option>
                  <option value="valuable">Valuable Carts ($50+)</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="lastUpdated">Last Updated</option>
                  <option value="customerName">Customer Name</option>
                  <option value="totalValue">Total Value</option>
                  <option value="totalItems">Total Items</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Carts List */}
          {filteredCarts.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
              <ShoppingCart className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Active Carts</h3>
              <p className="text-white/70">
                {carts.length === 0 
                  ? "No customers have items in their carts at the moment."
                  : "No carts match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCarts.map((cart) => (
                <div key={cart.userId} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{cart.customerName}</h3>
                      <p className="text-white/70">{cart.customerEmail}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-white/70">Total Value</p>
                        <p className="text-xl font-bold text-green-400">${cart.totalValue.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/70">Items</p>
                        <p className="text-xl font-bold text-blue-400">{cart.totalItems}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Last updated: {new Date(cart.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewCartDetails(cart)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button
                        onClick={() => clearCart(cart.userId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  {/* Cart Items Preview */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <h4 className="text-sm font-medium text-white/90 mb-2">Items in Cart:</h4>
                    <div className="space-y-1">
                      {cart.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-white/70">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-white/90">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {cart.items.length > 3 && (
                        <p className="text-xs text-white/50">
                          +{cart.items.length - 3} more items...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
