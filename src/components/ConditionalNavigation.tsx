'use client';

import { usePathname } from 'next/navigation';
import DynamicNavigation from '@/components/DynamicNavigation';
import FloatingCartButton from '@/components/FloatingCartButton';
import DynamicFooter from '@/components/DynamicFooter';
import Link from 'next/link';

// Simple login nav for admin pages
function AdminLoginNav() {
  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
              🏪 <span className="text-orange-300">Pizza</span> Portal
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/management-portal/login"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Admin Login
            </Link>
            <Link
              href="/"
              className="text-white hover:text-orange-300 text-sm font-medium transition-colors duration-200"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Component for top navigation (renders before main content)
export function ConditionalTopNavigation() {
  const pathname = usePathname();
  
  // For admin routes, only show navigation on login page
  const isAdminRoute = pathname?.startsWith('/management-portal');
  const isLoginPage = pathname === '/management-portal/login';
  
  // Hide navigation on store routes (kitchen display, etc.)
  const isStoreRoute = pathname?.startsWith('/store/');
  
  if (isAdminRoute && !isLoginPage) {
    return null; // Let AdminLayout/AdminPageLayout handle navigation for authenticated pages
  }
  
  if (isStoreRoute) {
    return null; // Hide navigation on store routes for clean display
  }
  
  if (isLoginPage) {
    return <AdminLoginNav />; // Show login navigation for login page
  }
  
  return <DynamicNavigation />;
}

// Component for bottom elements (renders after main content)
export function ConditionalBottomElements() {
  const pathname = usePathname();
  
  // Hide public navigation on admin pages
  const isAdminRoute = pathname?.startsWith('/management-portal');
  
  // Hide navigation on store routes (kitchen display, etc.)
  const isStoreRoute = pathname?.startsWith('/store/');
  
  if (isAdminRoute) {
    return null; // Don't render public navigation on admin pages
  }
  
  if (isStoreRoute) {
    return null; // Don't render navigation on store routes for clean display
  }
  
  return (
    <>
      <FloatingCartButton />
      <DynamicFooter />
    </>
  );
}

// Default export for backward compatibility
export default function ConditionalNavigation() {
  return (
    <>
      <ConditionalTopNavigation />
      <ConditionalBottomElements />
    </>
  );
}
