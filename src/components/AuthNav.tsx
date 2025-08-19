'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

interface AuthNavProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export default function AuthNav({ isMobile = false, onNavigate }: AuthNavProps) {
  const { user, logout, loading } = useUser();
  const { settings } = useAppSettingsContext();
  const [showDropdown, setShowDropdown] = useState(false);

  // If user accounts are disabled, don't show auth options
  if (!settings.enable_user_accounts) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-white/20 rounded h-8 w-20"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center space-x-2 transition-colors ${
            isMobile 
              ? 'text-gray-900 hover:text-orange-600 w-full justify-start px-3 py-2' 
              : 'text-white hover:text-orange-300'
          }`}
        >
          <div className={`bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-white ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className={isMobile ? 'inline' : 'hidden sm:inline'}>{user.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className={`absolute mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 ${
            isMobile ? 'left-0' : 'right-0'
          }`}>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setShowDropdown(false);
                onNavigate?.();
              }}
            >
              Profile & Preferences
            </Link>
            <Link
              href="/order-history"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setShowDropdown(false);
                onNavigate?.();
              }}
            >
              Order History
            </Link>
            <hr className="my-1" />
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
                onNavigate?.();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-2 w-full' : 'space-x-4'}`}>
      <Link
        href="/auth/login"
        className={`transition-colors ${
          isMobile 
            ? 'text-gray-900 hover:text-orange-600 w-full text-left px-3 py-2 block' 
            : 'text-white hover:text-orange-300'
        }`}
        onClick={onNavigate}
      >
        Sign In
      </Link>
      <Link
        href="/auth/register"
        className={`transition-colors ${
          isMobile 
            ? 'bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md w-full text-center block' 
            : 'bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md'
        }`}
        onClick={onNavigate}
      >
        Sign Up
      </Link>
    </div>
  );
}
