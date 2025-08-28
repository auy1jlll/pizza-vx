'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/management-portal/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/management-portal', icon: '📊' },
    { name: 'Orders', href: '/management-portal/orders', icon: '📋' },
    { name: 'Menu Manager', href: '/management-portal/menu-manager', icon: '🍽️' },
    { name: 'Pizza Manager', href: '/management-portal/pizza-manager', icon: '🍕' },
    { name: 'Users', href: '/management-portal/users', icon: '👥' },
    { name: 'Kitchen Display', href: '/management-portal/kitchen', icon: '🍳' },
    { name: 'Content', href: '/management-portal/content', icon: '📝' },
    { name: 'Analytics', href: '/management-portal/analytics', icon: '📈' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/management-portal/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo/Title */}
            <div className="flex items-center">
              <Link href="/management-portal" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
                🏪 <span className="text-orange-300">Admin Portal</span>
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

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}