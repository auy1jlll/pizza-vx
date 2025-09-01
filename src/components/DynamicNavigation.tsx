'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';
import DynamicMenuNavbar from '@/components/DynamicMenuNavbar';

export default function DynamicNavigation() {
  const { settings, loading } = useAppSettingsContext();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR and before hydration, show a consistent placeholder
  // After hydration, show the real data from database
  const appName = isHydrated && !loading
    ? (settings.business_name || 'Restaurant')
    : 'Restaurant'; // Generic placeholder until database loads

  return (
    <>
      <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
        <div className="pr-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex flex-col items-start pl-4">
              <Link href="/" className="text-4xl font-bold text-white hover:text-orange-300 transition-colors">
                🍕 <span className="text-orange-300">{appName}</span>
              </Link>
              {isHydrated && settings.app_tagline && (
                <p className="text-base text-green-200 italic ml-8">
                  {settings.app_tagline}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-white hover:text-orange-300 transition-colors font-medium text-lg"
              >
                Home
              </Link>
              
              {(isHydrated ? settings.enable_menu_ordering : true) && (
                <Link 
                  href="/menu" 
                  className="text-white hover:text-orange-300 transition-colors font-medium text-lg"
                >
                  Menu
                </Link>
              )}

              {(isHydrated ? settings.enable_pizza_builder : true) && (
                <Link 
                  href="/build-pizza" 
                  className="text-white hover:text-orange-300 transition-colors font-medium text-lg"
                >
                  Pizza Builder
                </Link>
              )}
              
              <Link 
                href="/cart" 
                className="text-white hover:text-orange-300 transition-colors font-medium text-lg"
              >
                Cart
              </Link>

              <Link 
                href="/contact" 
                className="text-white hover:text-orange-300 transition-colors font-medium text-lg"
              >
                Contact
              </Link>

              <Link 
                href="/management-portal/global-settings" 
                className="text-white hover:text-orange-300 transition-colors font-medium text-lg"
              >
                Settings
              </Link>
              
              <AuthNav />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Dynamic Menu Categories Navbar */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 shadow-md border-b border-green-600">
        <div className="px-4 py-2">
          <DynamicMenuNavbar 
            className="navbar-menu"
            hideEmptyCategories={true}
          />
        </div>
      </div>
    </>
  );
}
