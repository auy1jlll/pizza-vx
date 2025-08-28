'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import AdminPageLayout from '@/components/AdminPageLayout'
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiSettings, 
  FiGrid, 
  FiList,
  FiBarChart,
  FiEye,
  FiTag,
  FiPackage
} from 'react-icons/fi'

// Types
interface MenuStats {
  totalCategories: number;
  totalItems: number;
  totalCustomizationGroups: number;
  totalCustomizationOptions: number;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: {
    menuItems: number;
    customizationGroups: number;
  };
}

export default function MenuManagerPage() {
  const [stats, setStats] = useState<MenuStats | null>(null)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/menu/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/admin/menu/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error('Error fetching menu data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <AdminPageLayout title="Menu Management" description="Loading menu data...">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/10 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/10 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </AdminPageLayout>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Menu Management"
        description="Manage your restaurant's menu categories, items, and customizations"
        actionButton={
          <Link
            href="/management-portal/menu-manager/categories/new"
            className="group relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center font-semibold shadow-lg"
          >
            <FiPlus className="mr-2" />
            Add Category
          </Link>
        }
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiGrid className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Categories</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalCategories || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiList className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Menu Items</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalItems || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiTag className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Customization Groups</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalCustomizationGroups || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiPackage className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Customization Options</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalCustomizationOptions || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Main Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories Management */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-500/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30">
                <FiGrid className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Categories</h3>
            </div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30">
              {categories.length} items
            </span>
          </div>
          <p className="text-slate-300 mb-6">Manage menu categories and their settings</p>
          
          <div className="space-y-3">
            <Link
              href="/management-portal/menu-manager/categories"
              className="flex items-center justify-between w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-blue-500/30"
            >
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-medium">View All Categories</span>
              </div>
              <div className="text-blue-400 group-hover:translate-x-1 transition-transform">→</div>
            </Link>
            
            <button className="flex items-center justify-between w-full p-3 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-green-500/30">
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">Add New Category</span>
              </div>
              <div className="text-green-400 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>

        {/* Items Management */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:border-green-500/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
                <FiList className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Menu Items</h3>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/30">
              {stats?.totalItems || 0} items
            </span>
          </div>
          <p className="text-slate-300 mb-6">Add, edit, and organize menu items</p>
          
          <div className="space-y-3">
            <Link
              href="/management-portal/menu-manager/items"
              className="flex items-center justify-between w-full p-3 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-green-500/30"
            >
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">View All Items</span>
              </div>
              <div className="text-green-400 group-hover:translate-x-1 transition-transform">→</div>
            </Link>
            
            <button className="flex items-center justify-between w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-blue-500/30">
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-medium">Add New Item</span>
              </div>
              <div className="text-blue-400 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>

        {/* Customizations Management */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300 hover:border-purple-500/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30">
                <FiSettings className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Customizations</h3>
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
              {stats?.totalCustomizationGroups || 0} groups
            </span>
          </div>
          <p className="text-slate-300 mb-6">Manage customization groups and options</p>
          
          <div className="space-y-3">
            <Link
              href="/management-portal/menu-manager/customizations"
              className="flex items-center justify-between w-full p-3 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-purple-500/30"
            >
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-medium">View Customizations</span>
              </div>
              <div className="text-purple-400 group-hover:translate-x-1 transition-transform">→</div>
            </Link>
            
            <button className="flex items-center justify-between w-full p-3 bg-orange-500/20 hover:bg-orange-500/30 backdrop-blur-sm rounded-lg transition-all duration-300 group border border-orange-500/30">
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 font-medium">Add New Group</span>
              </div>
              <div className="text-orange-400 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Category Overview</h3>
          <Link
            href="/management-portal/menu-manager/categories"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <div key={category.id} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-500/50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-white truncate">{category.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  category.isActive 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium text-white">{category._count.menuItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customizations:</span>
                  <span className="font-medium text-white">{category._count.customizationGroups}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 py-1 px-2 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30">
                  <FiEdit2 className="w-3 h-3 mx-auto" />
                </button>
                <button className="flex-1 py-1 px-2 text-xs bg-slate-500/20 text-slate-400 rounded hover:bg-slate-500/30 transition-all duration-300 border border-slate-500/30">
                  <FiEye className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-lg hover:shadow-lg transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50">
            <FiBarChart className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-sm font-medium text-slate-300">View Reports</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-lg hover:shadow-lg transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50">
            <FiSettings className="w-6 h-6 text-purple-400 mb-2" />
            <span className="text-sm font-medium text-slate-300">Bulk Edit</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-lg hover:shadow-lg transition-all duration-300 border border-slate-700/50 hover:border-green-500/50">
            <FiPlus className="w-6 h-6 text-green-400 mb-2" />
            <span className="text-sm font-medium text-slate-300">Import Menu</span>
          </button>
          
          <Link
            href="/menu"
            className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-lg hover:shadow-lg transition-all duration-300 border border-slate-700/50 hover:border-orange-500/50"
          >
            <FiEye className="w-6 h-6 text-orange-400 mb-2" />
            <span className="text-sm font-medium text-slate-300">Preview Menu</span>
          </Link>
        </div>
      </div>
      </AdminPageLayout>
    </AdminLayout>
  )
}
