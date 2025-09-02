'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export default function AdminPageLayout({ 
  children, 
  title, 
  description, 
  actionButton 
}: AdminPageLayoutProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't apply auth checks to login page
  const isLoginPage = pathname === '/management-portal/login';

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE'))) {
      router.push('/management-portal/login');
    }
  }, [user, loading, router, isLoginPage]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!isLoginPage && (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE'))) {
    return null;
  }

  // For login page, just render without navigation
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  // At this point, user should be authenticated for admin pages
  if (!user) {
    return null;
  }

  // Define navigation based on user role
  const allNavigation = [
    { name: 'Dashboard', href: '/management-portal', icon: '📊', roles: ['ADMIN'] },
    { name: 'Orders', href: '/management-portal/orders', icon: '📋', roles: ['ADMIN', 'EMPLOYEE'] },
    { name: 'Kitchen Display', href: '/management-portal/kitchen', icon: '🍳', roles: ['ADMIN', 'EMPLOYEE'] },
    { name: 'Menu Manager', href: '/management-portal/menu-manager', icon: '🍽️', roles: ['ADMIN'] },
    { name: 'Pizza Manager', href: '/management-portal/pizza-manager', icon: '🍕', roles: ['ADMIN'] },
    { name: 'Calzone Manager', href: '/management-portal/calzone-manager', icon: '🥟', roles: ['ADMIN'] },
    { name: 'Users', href: '/management-portal/users', icon: '👥', roles: ['ADMIN'] },
    { name: 'Content', href: '/management-portal/content', icon: '📝', roles: ['ADMIN'] },
    { name: 'Analytics', href: '/management-portal/analytics', icon: '📈', roles: ['ADMIN'] },
  ];

  // Filter navigation based on user role
  const navigation = allNavigation.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/management-portal/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo/Title */}
            <div className="flex items-center">
              <Link 
                href={user.role === 'EMPLOYEE' ? '/management-portal/orders' : '/management-portal'} 
                className="text-2xl font-bold text-white hover:text-orange-300 transition-colors"
              >
                🏪 <span className="text-orange-300">
                  {user.role === 'EMPLOYEE' ? 'Employee Portal' : 'Admin Portal'}
                </span>
              </Link>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-orange-300 hover:bg-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-white">
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
              <Link
                href="/"
                className="text-white hover:text-orange-300 text-sm font-medium transition-colors duration-200"
              >
                ← Back to Site
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:text-orange-300 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {sidebarOpen && (
          <div className="md:hidden bg-green-800 border-t border-green-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-orange-300 hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-green-600 pt-2 mt-2">
                <div className="px-3 py-2 text-white text-sm">
                  {user.name} ({user.email})
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

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
              <div>
                <div className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </div>
                {description && (
                  <p className="mt-3 text-white/70 text-lg">
                    {description}
                  </p>
                )}
              </div>
            </h1>
          </div>
          {actionButton && (
            <div className="flex gap-3">
              {actionButton}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
