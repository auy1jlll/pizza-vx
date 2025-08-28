'use client';

import React from 'react';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export default function AdminPageLayout({ 
  children, 
  title, 
  description, 
  actionButton 
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
              <div>
                <div className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </div>
                {description && (
                  <p className="mt-3 text-white/70 text-lg">
                    {description}
                  </p>
                )}
              </div>
            </h1>
          </div>
          {actionButton && (
            <div className="flex gap-3">
              {actionButton}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
