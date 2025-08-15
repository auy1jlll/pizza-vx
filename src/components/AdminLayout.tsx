'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/sizes', {
        method: 'GET',
      });
      
      if (response.status === 401) {
        setIsAuthenticated(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setIsAuthenticated(false);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null; // Will redirect via useEffect
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🎯' },
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/kitchen', label: 'Kitchen Display', icon: '🍳' },
    { href: '/admin/pizza-manager', label: 'Pizza Manager', icon: '🍕' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="backdrop-blur-xl bg-black/20 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl">🍕</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                      Pizza Builder
                    </h1>
                    <p className="text-xs text-white/60 font-medium">Admin Portal</p>
                  </div>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:ml-10 lg:flex lg:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white border border-white/20 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {pathname === item.href && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.405-3.405A2.032 2.032 0 0118 11.158V6a6 6 0 10-12 0v5.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:scale-105 flex items-center space-x-2"
              >
                <svg className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex flex-col items-center space-y-1 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-center leading-tight">{item.label}</span>
                  {pathname === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
