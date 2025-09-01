'use client';
import React from 'react';
import Link from "next/link";
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';

// Simple static navigation that works during SSR
export default function StaticNavigation() {
  const { settings, loading } = useAppSettingsContext();
  
  // Use business_name from settings with a generic fallback
  const businessName = settings?.business_name || 'Restaurant';

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
      <div className="px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
            🍕 <span className="text-orange-300">{businessName}</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Home
            </Link>
            
            <Link 
              href="/menu" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Menu
            </Link>

            <Link 
              href="/build-pizza" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Pizza Builder
            </Link>
            
            <Link 
              href="/cart" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Cart
            </Link>

            <Link 
              href="/contact" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Contact
            </Link>

            <Link 
              href="/management-portal/global-settings" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Settings
            </Link>
            
            <AuthNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
