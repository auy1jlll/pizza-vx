'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function AuthNav() {
  const { user, logout, loading } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

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
          className="flex items-center space-x-2 text-white hover:text-orange-300 transition-colors"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline">{user.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDropdown(false)}
            >
              Profile & Preferences
            </Link>
            <Link
              href="/order-history"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDropdown(false)}
            >
              Order History
            </Link>
            <hr className="my-1" />
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
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
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/login"
        className="text-white hover:text-orange-300 transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/auth/register"
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
