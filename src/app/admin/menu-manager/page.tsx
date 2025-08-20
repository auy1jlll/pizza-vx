'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Menu Management</h1>
          <p className="text-gray-300 mt-1">Manage your restaurant's menu categories, items, and customizations</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold text-blue-900">{stats?.totalCategories || 0}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FiGrid className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Menu Items</p>
              <p className="text-2xl font-bold text-green-900">{stats?.totalItems || 0}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <FiList className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Customization Groups</p>
              <p className="text-2xl font-bold text-purple-900">{stats?.totalCustomizationGroups || 0}</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <FiTag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Customization Options</p>
              <p className="text-2xl font-bold text-orange-900">{stats?.totalCustomizationOptions || 0}</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-lg">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiGrid className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              {categories.length} items
            </span>
          </div>
          <p className="text-gray-600 mb-6">Manage menu categories and their settings</p>
          
          <div className="space-y-3">
            <Link
              href="/admin/menu-manager/categories"
              className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">View All Categories</span>
              </div>
              <div className="text-blue-500 group-hover:translate-x-1 transition-transform">→</div>
            </Link>
            
            <button className="flex items-center justify-between w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">Add New Category</span>
              </div>
              <div className="text-green-500 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>

        {/* Items Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiList className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
              {stats?.totalItems || 0} items
            </span>
          </div>
          <p className="text-gray-600 mb-6">Add, edit, and organize menu items</p>
          
          <div className="space-y-3">
            <Link
              href="/admin/menu-manager/items"
              className="flex items-center justify-between w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">View All Items</span>
              </div>
              <div className="text-green-500 group-hover:translate-x-1 transition-transform">→</div>
            </Link>
            
            <button className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">Add New Item</span>
              </div>
              <div className="text-blue-500 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>

        {/* Customizations Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiSettings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Customizations</h3>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
              {stats?.totalCustomizationGroups || 0} groups
            </span>
          </div>
          <p className="text-gray-600 mb-6">Manage customization groups and options</p>
          
          <div className="space-y-3">
            <Link
              href="/admin/menu-manager/customizations"
              className="flex items-center justify-between w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 font-medium">View Customizations</span>
              </div>
              <div className="text-purple-500 group-hover:translate-x-1 transition-transform">→</div>
            </Link>
            
            <button className="flex items-center justify-between w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group">
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 font-medium">Add New Group</span>
              </div>
              <div className="text-orange-500 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Category Overview</h3>
          <Link
            href="/admin/menu-manager/categories"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900 truncate">{category.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{category._count.menuItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customizations:</span>
                  <span className="font-medium">{category._count.customizationGroups}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 py-1 px-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                  <FiEdit2 className="w-3 h-3 mx-auto" />
                </button>
                <button className="flex-1 py-1 px-2 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors">
                  <FiEye className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            <FiBarChart className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            <FiSettings className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Bulk Edit</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            <FiPlus className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Import Menu</span>
          </button>
          
          <Link
            href="/menu"
            className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
          >
            <FiEye className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Preview Menu</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
