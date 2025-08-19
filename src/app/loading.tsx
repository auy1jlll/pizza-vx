'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

export default function Loading() {
  const { settings } = useAppSettingsContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-300 border-t-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{settings.app_name || 'Pizza Builder Pro'}</h2>
        <p className="text-gray-500">Loading your perfect pizza experience...</p>
      </div>
    </div>
  );
}
