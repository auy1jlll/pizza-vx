'use client';

import { useAppSettingsContext } from '@/contexts/AppSettingsContext';

export default function FeatureStatus() {
  const { settings } = useAppSettingsContext();

  const features = [
    { key: 'enable_pizza_builder', label: 'Pizza Builder', icon: '🍕' },
    { key: 'enable_menu_ordering', label: 'Menu Ordering', icon: '📋' },
    { key: 'enable_user_accounts', label: 'User Accounts', icon: '👥' },
    { key: 'enable_guest_checkout', label: 'Guest Checkout', icon: '🛒' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Feature Status</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((feature) => {
          const isEnabled = settings[feature.key as keyof typeof settings] as boolean;
          
          return (
            <div key={feature.key} 
                 className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                   isEnabled 
                     ? 'border-green-200 bg-green-50' 
                     : 'border-red-200 bg-red-50'
                 }`}>
              <div className="flex items-center space-x-3">
                <span className="text-lg">{feature.icon}</span>
                <span className="font-medium text-gray-900">{feature.label}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isEnabled ? 'ON' : 'OFF'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Dynamic Configuration</h4>
        <p className="text-sm text-blue-800">
          These features are controlled by your database settings and can be toggled 
          through the admin panel in real-time without code changes.
        </p>
      </div>
    </div>
  );
}
