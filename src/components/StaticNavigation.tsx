'use client';
import React from 'react';
import Link from "next/link";
import AuthNav from '@/components/AuthNav';

// Simple static navigation that works during SSR
export default function StaticNavigation() {
  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-green-700 shadow-lg border-b border-green-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
            🍕 <span className="text-orange-300">Local Pizza House</span>
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
