'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import AuthNav from '@/components/AuthNav';
import ProfessionalNavbar from '@/components/ProfessionalNavbar';
import { Clock, Phone } from 'lucide-react';
import { getRestaurantStatus } from '@/utils/businessHours';

export default function DynamicNavigation() {
  const { settings, loading } = useAppSettingsContext();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update time every minute to keep status current
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // During SSR and before hydration, show a consistent placeholder
  // After hydration, show the real data from database
  const appName = isHydrated && !loading
    ? (settings?.app_name || 'Pizza Vx')
    : 'Pizza Vx';

  // Get restaurant status based on operating hours
  const getBusinessStatus = () => {
    if (!isHydrated || loading || !settings?.operating_hours) {
      return {
        text: 'Open',
        isOpen: true,
        className: 'text-green-200',
        iconClassName: 'text-green-300'
      };
    }

    try {
      const operatingHours = typeof settings.operating_hours === 'string' 
        ? JSON.parse(settings.operating_hours) 
        : settings.operating_hours;
      
      return getRestaurantStatus(operatingHours);
    } catch (error) {
      console.error('Error parsing operating hours:', error);
      return {
        text: 'Open',
        isOpen: true,
        className: 'text-green-200',
        iconClassName: 'text-green-300'
      };
    }
  };

  const businessStatus = getBusinessStatus();

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
          
          <div className="flex items-center space-x-4">
            {/* Store Status - Hidden on small screens to save space */}
            <div className="hidden sm:flex items-center space-x-1 text-white">
              <Clock className={`w-4 h-4 ${businessStatus.iconClassName}`} />
              <span className={`font-semibold text-sm ${businessStatus.className}`}>
                {businessStatus.text}
              </span>
            </div>

            {/* Mobile-only compact status */}
            <div className="flex sm:hidden items-center space-x-1 text-white">
              <Clock className={`w-4 h-4 ${businessStatus.iconClassName}`} />
              <span className={`font-semibold text-xs ${businessStatus.className}`}>
                {businessStatus.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Call Now Button - Responsive sizing */}
            <a 
              href="tel:(630) 501-0774"
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Call Now</span>
              <span className="inline xs:hidden sm:hidden">Call</span>
            </a>

            <AuthNav />
          </div>
        </div>
      </div>

      {/* Professional QSR-Style Navigation - TRUE 0PX HEIGHT WITH NEGATIVE MARGIN */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 relative z-30 overflow-visible -mt-0 border-t-0">
        <ProfessionalNavbar />
      </div>
    </>
  );
}