'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';

export default function DynamicNavigation() {
  const { settings, loading } = useAppSettingsContext();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR and before hydration, show a consistent placeholder
  // After hydration, show the real data
  const appName = isHydrated && !loading
    ? (settings.app_name || settings.business_name || 'Omar Pizza')
    : 'Omar Pizza'; // Consistent placeholder that matches expected content

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
              🍕 <span className="text-orange-300">{appName}</span>
            </Link>
            {isHydrated && settings.app_tagline && (
              <p className="text-sm text-green-200 italic ml-8">
                {settings.app_tagline}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-white hover:text-orange-300 transition-colors font-medium"
            >
              Home
            </Link>
            
            {(isHydrated ? settings.enable_menu_ordering : true) && (
              <Link 
                href="/menu" 
                className="text-white hover:text-orange-300 transition-colors font-medium"
              >
                Menu
              </Link>
            )}

            {(isHydrated ? settings.enable_pizza_builder : true) && (
              <Link 
                href="/build-pizza" 
                className="text-white hover:text-orange-300 transition-colors font-medium"
              >
                Pizza Builder
              </Link>
            )}
            
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
              href="/settings-demo" 
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
