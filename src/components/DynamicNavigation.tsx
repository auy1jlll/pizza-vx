'use client';
import React from 'react';
import Link from "next/link";
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';

export default function DynamicNavigation() {
  const { settings, loading } = useAppSettingsContext();
  
  if (loading) {
    // Show a loading state or skeleton
    return (
      <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-white">
              🍕 <span className="animate-pulse">Loading...</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-white animate-pulse">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
            🍕 <span className="text-orange-300">{settings.app_name}</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Home
            </Link>
            
            {settings.enable_menu_ordering && (
              <Link 
                href="/menu" 
                className="text-white hover:text-orange-300 transition-colors font-medium"
              >
                Menu
              </Link>
            )}
            
            <Link 
              href="/cart" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Cart
            </Link>
            
            <AuthNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
