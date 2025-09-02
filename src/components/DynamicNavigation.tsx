'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';
import ProfessionalNavbar from '@/components/ProfessionalNavbar';

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
    ? (settings?.app_name || 'Pizza Vx')
    : 'Pizza Vx';

  return (
    <>
      {/* Secondary Actions Bar - Top Static Bar */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2 shadow-sm relative z-[100000]">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/build-pizza?fresh=true" className="hover:text-white transition-colors">
              Pizza Maker
            </Link>
            <Link href="/build-calzone?fresh=true" className="hover:text-white transition-colors">
              Calzone Maker
            </Link>
            <Link href="/locations" className="hover:text-white transition-colors">
              Locations
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
          
          <AuthNav />
        </div>
      </div>

      {/* Professional QSR-Style Navigation - TRUE 0PX HEIGHT WITH NEGATIVE MARGIN */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 relative z-30 overflow-visible -mt-0 border-t-0">
        <ProfessionalNavbar />
      </div>
    </>
  );
}