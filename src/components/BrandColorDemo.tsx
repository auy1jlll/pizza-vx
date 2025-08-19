'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import { useBrandColors } from '@/hooks/useAppSettings';

export default function BrandColorDemo() {
  const { settings } = useAppSettingsContext();
  const brandColors = useBrandColors();

  if (!brandColors) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Brand Colors for {settings.app_name || 'Your Business'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.primary }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Primary</p>
          <p className="text-xs text-gray-500">{brandColors.primary}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.secondary }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Secondary</p>
          <p className="text-xs text-gray-500">{brandColors.secondary}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.accent }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Accent</p>
          <p className="text-xs text-gray-500">{brandColors.accent}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.background }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Background</p>
          <p className="text-xs text-gray-500">{brandColors.background}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.text }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Text</p>
          <p className="text-xs text-gray-500">{brandColors.text}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.success }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Success</p>
          <p className="text-xs text-gray-500">{brandColors.success}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.warning }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Warning</p>
          <p className="text-xs text-gray-500">{brandColors.warning}</p>
        </div>

        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-4 border-white"
            style={{ backgroundColor: brandColors.error }}
          ></div>
          <p className="text-sm font-medium text-gray-700">Error</p>
          <p className="text-xs text-gray-500">{brandColors.error}</p>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: brandColors.background }}>
        <h3 className="font-semibold mb-2" style={{ color: brandColors.text }}>
          Sample Text Display
        </h3>
        <p style={{ color: brandColors.text }}>
          This demonstrates how your brand colors look with text content.
        </p>
        <div className="mt-3 space-x-2">
          <button 
            className="px-4 py-2 rounded text-white font-medium"
            style={{ backgroundColor: brandColors.primary }}
          >
            Primary Button
          </button>
          <button 
            className="px-4 py-2 rounded text-white font-medium"
            style={{ backgroundColor: brandColors.accent }}
          >
            Accent Button
          </button>
        </div>
      </div>
    </div>
  );
}
