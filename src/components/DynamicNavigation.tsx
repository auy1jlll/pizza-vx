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
      {/* Professional QSR-Style Navigation */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 relative z-40 overflow-visible">
        <ProfessionalNavbar />
      </div>

      {/* Secondary Actions Bar (if needed) */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <Link href="/build-pizza" className="hover:text-white transition-colors">
              Pizza Builder
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
    </>
  );
}