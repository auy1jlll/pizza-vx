'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

export default function Loading() {
  const { settings } = useAppSettingsContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        {/* Pizza Loading Animation */}
        <div className="relative mb-8">
          {/* Spinning Pizza */}
          <div className="text-8xl animate-spin" style={{ animationDuration: '3s' }}>
            🍕
          </div>
          
          {/* Floating Ingredients */}
          <div className="absolute -top-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>
            🍅
          </div>
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>
            🧀
          </div>
          <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>
            🌿
          </div>
          <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>
            🥓
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {settings.app_name || 'Pizza Builder Pro'}
          </h2>
          <p className="text-lg text-gray-600">
            Preparing your perfect pizza experience... 🔥
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full animate-pulse"></div>
        </div>

        {/* Fallback Spinner for Critical Sections */}
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-300 border-t-red-600 mx-auto mb-4"></div>

        {/* Fun Loading Messages */}
        <div className="text-sm text-gray-500 animate-pulse">
          <p>🍕 Tossing dough and heating the oven... 🔥</p>
        </div>
      </div>
    </div>
  );
}
