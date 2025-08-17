'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Store, 
  Clock, 
  DollarSign, 
  Bell, 
  Truck, 
  Globe, 
  Save,
  AlertCircle,
  CheckCircle,
  Building,
  Calculator,
  Shield
} from 'lucide-react';

interface SettingsState {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  taxRate: number;
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: number;
  
  // Tip Settings
  tipPercentages: number[];
  allowCustomTip: boolean;
  defaultTipPercentage: number;
  
  // Payment Options
  allowPayAtPickup: boolean;
  allowPayLater: boolean;
  payLaterMinimumOrder: number;
  
  // Dynamic Pricing Settings
  intensityLightMultiplier: number;
  intensityRegularMultiplier: number;
  intensityExtraMultiplier: number;
  removalCreditPercentage: number;
  deliveryTimeBuffer: number;
  showPricingBreakdown: boolean;
  allowRemovalCredits: boolean;
  
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  sundayOpen: string;
  saturdayClose: string;
  sundayClose: string;
  mondayClosed: boolean;
  tuesdayClosed: boolean;
  wednesdayClosed: boolean;
  thursdayClosed: boolean;
  fridayClosed: boolean;
  saturdayClosed: boolean;
  sundayClosed: boolean;
  orderNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    businessName: 'Pizza Builder',
    businessPhone: '',
    businessEmail: '',
    businessAddress: '',
    taxRate: 8.25,
    deliveryFee: 3.99,
    minimumOrder: 15.00,
    preparationTime: 25,
    
    // Tip Settings
    tipPercentages: [15, 18, 20, 25],
    allowCustomTip: true,
    defaultTipPercentage: 18,
    
    // Payment Options
    allowPayAtPickup: true,
    allowPayLater: true,
    payLaterMinimumOrder: 25.00,
    
    // Dynamic Pricing Settings
    intensityLightMultiplier: 0.75,
    intensityRegularMultiplier: 1.0,
    intensityExtraMultiplier: 1.5,
    removalCreditPercentage: 0.5,
    deliveryTimeBuffer: 10,
    showPricingBreakdown: true,
    allowRemovalCredits: true,
    
    mondayOpen: '11:00',
    mondayClose: '22:00',
    tuesdayOpen: '11:00',
    tuesdayClose: '22:00',
    wednesdayOpen: '11:00',
    wednesdayClose: '22:00',
    thursdayOpen: '11:00',
    thursdayClose: '22:00',
    fridayOpen: '11:00',
    fridayClose: '23:00',
    saturdayOpen: '11:00',
    saturdayClose: '23:00',
    sundayOpen: '12:00',
    sundayClose: '21:00',
    mondayClosed: false,
    tuesdayClosed: false,
    wednesdayClosed: false,
    thursdayClosed: false,
    fridayClosed: false,
    saturdayClosed: false,
    sundayClosed: false,
    orderNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (response.ok) {
        const data = await response.json();
        // Merge loaded settings with defaults
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setHasChanges(false);
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const settingCards = [
    {
      id: 'business',
      title: 'Business Information',
      description: 'Basic business details and contact information',
      icon: Building,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'hours',
      title: 'Business Hours',
      description: 'Operating hours for each day of the week',
      icon: Clock,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'pricing',
      title: 'Pricing & Tax',
      description: 'Tax rates, delivery fees, and pricing settings',
      icon: Calculator,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'tips-payment',
      title: 'Tips & Payment',
      description: 'Tip options and payment method settings',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Order settings and operational preferences',
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alert preferences and notification settings',
      icon: Bell,
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password management and security settings',
      icon: Shield,
      color: 'from-red-500 to-red-600',
    },
  ];

  if (activeSection) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveSection(null)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    ←
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {settingCards.find(card => card.id === activeSection)?.title}
                    </h1>
                    <p className="text-white/70">
                      {settingCards.find(card => card.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={saveSettings}
                  disabled={!hasChanges || loading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    hasChanges && !loading
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            {/* Alert Messages */}
            {message && (
              <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-100' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-100'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Settings Content */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              {activeSection === 'business' && (
                <BusinessSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'hours' && (
                <HoursSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'pricing' && (
                <PricingSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'tips-payment' && (
                <TipsPaymentSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'operations' && (
                <OperationsSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'notifications' && (
                <NotificationsSettings settings={settings} updateSetting={updateSetting} />
              )}
              {activeSection === 'security' && (
                <SecuritySettings />
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-white/70">Manage your restaurant configuration and preferences</p>
              </div>
              {hasChanges && (
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Alert Messages */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-100' 
                : 'bg-red-500/20 border border-red-500/30 text-red-100'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Settings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveSection(card.id)}
                  className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-4 text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">
                    Configure →
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Individual setting components will be defined below...

// Business Information Settings Component
function BusinessSettings({ 
  settings, 
  updateSetting 
}: { 
  settings: SettingsState; 
  updateSetting: (key: keyof SettingsState, value: any) => void; 
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={settings.businessName}
            onChange={(e) => updateSetting('businessName', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.businessPhone}
            onChange={(e) => updateSetting('businessPhone', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={settings.businessEmail}
          onChange={(e) => updateSetting('businessEmail', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="orders@pizzabuilder.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Business Address
        </label>
        <textarea
          value={settings.businessAddress}
          onChange={(e) => updateSetting('businessAddress', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="123 Main Street, City, State, ZIP"
        />
      </div>
    </div>
  );
}

// Business Hours Settings Component
function HoursSettings({ 
  settings, 
  updateSetting 
}: { 
  settings: SettingsState; 
  updateSetting: (key: keyof SettingsState, value: any) => void; 
}) {
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const openKey = `${day.key}Open` as keyof SettingsState;
        const closeKey = `${day.key}Close` as keyof SettingsState;
        const closedKey = `${day.key}Closed` as keyof SettingsState;
        
        return (
          <div key={day.key} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="font-medium text-white">{day.label}</span>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings[closedKey] as boolean}
                    onChange={(e) => updateSetting(closedKey, e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-white/70">Closed</span>
                </label>
              </div>
              
              {!(settings[closedKey] as boolean) && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={settings[openKey] as string}
                    onChange={(e) => updateSetting(openKey, e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-white/70">to</span>
                  <input
                    type="time"
                    value={settings[closeKey] as string}
                    onChange={(e) => updateSetting(closeKey, e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Pricing & Tax Settings Component
function PricingSettings({ 
  settings, 
  updateSetting 
}: { 
  settings: SettingsState; 
  updateSetting: (key: keyof SettingsState, value: any) => void; 
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.taxRate}
            onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="8.25"
          />
          <p className="text-xs text-white/50 mt-1">Applied to all orders</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Delivery Fee ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.deliveryFee}
            onChange={(e) => updateSetting('deliveryFee', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="3.99"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Minimum Order Amount ($)
        </label>
        <input
          type="number"
          step="0.01"
          value={settings.minimumOrder}
          onChange={(e) => updateSetting('minimumOrder', parseFloat(e.target.value) || 0)}
          className="w-full md:w-1/2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="15.00"
        />
        <p className="text-xs text-white/50 mt-1">Minimum amount required for orders</p>
      </div>
    </div>
  );
}

// Tips & Payment Settings Component
function TipsPaymentSettings({ 
  settings, 
  updateSetting 
}: { 
  settings: SettingsState; 
  updateSetting: (key: keyof SettingsState, value: any) => void;
}) {
  const [customTipPercentages, setCustomTipPercentages] = useState<string>(
    settings.tipPercentages?.join(', ') || '15, 18, 20, 25'
  );

  const handleTipPercentagesChange = (value: string) => {
    setCustomTipPercentages(value);
    // Parse the comma-separated values into an array of numbers
    const percentages = value
      .split(',')
      .map(p => parseFloat(p.trim()))
      .filter(p => !isNaN(p) && p >= 0 && p <= 100);
    updateSetting('tipPercentages', percentages);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Tip Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Available Tip Percentages
            </label>
            <input
              type="text"
              value={customTipPercentages}
              onChange={(e) => handleTipPercentagesChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="15, 18, 20, 25"
            />
            <p className="text-xs text-white/50 mt-1">Comma-separated percentage values (e.g., 15, 18, 20, 25)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Default Tip Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.defaultTipPercentage}
              onChange={(e) => updateSetting('defaultTipPercentage', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="18"
            />
            <p className="text-xs text-white/50 mt-1">Pre-selected tip percentage for customers</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.allowCustomTip}
              onChange={(e) => updateSetting('allowCustomTip', e.target.checked)}
              className="w-5 h-5 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2"
            />
            <span className="text-white">Allow Custom Tip Amount</span>
          </label>
          <p className="text-xs text-white/50 mt-1 ml-8">Customers can enter their own tip amount (including $0)</p>
        </div>
      </div>

      <div className="border-t border-white/20 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Options</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.allowPayAtPickup}
                onChange={(e) => updateSetting('allowPayAtPickup', e.target.checked)}
                className="w-5 h-5 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-white">Allow Pay at Pickup</span>
            </label>
            <p className="text-xs text-white/50 mt-1 ml-8">Customers can choose to pay when they pick up their order</p>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.allowPayLater}
                onChange={(e) => updateSetting('allowPayLater', e.target.checked)}
                className="w-5 h-5 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-white">Allow Pay on Delivery</span>
            </label>
            <p className="text-xs text-white/50 mt-1 ml-8">Customers can choose to pay when their order is delivered</p>
          </div>

          {settings.allowPayLater && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-white mb-2">
                Minimum Order for Pay on Delivery ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.payLaterMinimumOrder}
                onChange={(e) => updateSetting('payLaterMinimumOrder', parseFloat(e.target.value) || 0)}
                className="w-full md:w-1/2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="25.00"
              />
              <p className="text-xs text-white/50 mt-1">Minimum order amount required to allow pay on delivery</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium">Payment Settings Info</h4>
            <ul className="text-blue-200 text-sm mt-1 space-y-1">
              <li>• Tip settings only apply to delivery orders</li>
              <li>• Pay at pickup is always available for pickup orders</li>
              <li>• Pay on delivery requires driver to handle cash transactions</li>
              <li>• Custom tip allows customers to enter $0 or any amount</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Operations Settings Component
function OperationsSettings({ 
  settings, 
  updateSetting 
}: { 
  settings: SettingsState; 
  updateSetting: (key: keyof SettingsState, value: any) => void; 
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Average Preparation Time (minutes)
        </label>
        <input
          type="number"
          value={settings.preparationTime}
          onChange={(e) => updateSetting('preparationTime', parseInt(e.target.value) || 0)}
          className="w-full md:w-1/2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="25"
        />
        <p className="text-xs text-white/50 mt-1">Used for estimated pickup/delivery times</p>
      </div>
    </div>
  );
}

// Notifications Settings Component
function NotificationsSettings({ 
  settings, 
  updateSetting 
}: { 
  settings: SettingsState; 
  updateSetting: (key: keyof SettingsState, value: any) => void; 
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-lg p-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-white">Order Notifications</span>
            <p className="text-xs text-white/50">Get notified when new orders are received</p>
          </div>
          <input
            type="checkbox"
            checked={settings.orderNotifications}
            onChange={(e) => updateSetting('orderNotifications', e.target.checked)}
            className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
          />
        </label>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-white">Email Notifications</span>
            <p className="text-xs text-white/50">Receive updates via email</p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
            className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
          />
        </label>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4">
        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-white">SMS Notifications</span>
            <p className="text-xs text-white/50">Get text message alerts for urgent orders</p>
          </div>
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
            className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
          />
        </label>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while changing password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
        <p className="text-white/70 text-sm mb-6">
          Update your admin account password. Make sure to use a strong, unique password.
        </p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter your new password (min 6 characters)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Confirm your new password"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>{loading ? 'Changing Password...' : 'Change Password'}</span>
          </button>
        </div>
      </form>

      {/* Security Tips */}
      <div className="bg-white/5 rounded-lg p-6 mt-8">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Tips
        </h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• Use a strong password with at least 8 characters</li>
          <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
          <li>• Don't reuse passwords from other accounts</li>
          <li>• Change your password regularly</li>
          <li>• Never share your admin credentials with others</li>
        </ul>
      </div>
    </div>
  );
}
