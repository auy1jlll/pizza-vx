'use client';

import { useState, useEffect } from 'react';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import { useToast } from '@/components/ToastProvider';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  createdAt: string;
  updatedAt: string;
}

interface SettingTemplate {
  key: string;
  label: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN';
  placeholder?: string;
  defaultValue?: boolean;
  icon: string;
}

interface TemplateCategory {
  title: string;
  color: string;
  settings: SettingTemplate[];
}

// Predefined setting templates for easy point-and-click setup
const SETTING_TEMPLATES: Record<string, TemplateCategory> = {
  business: {
    title: '🏢 Business Information',
    color: 'blue',
    settings: [
      { key: 'businessName', label: 'Business Name', type: 'STRING', placeholder: 'Pizza Palace', icon: '🏪' },
      { key: 'businessEmail', label: 'Business Email', type: 'STRING', placeholder: 'info@pizzapalace.com', icon: '📧' },
      { key: 'businessPhone', label: 'Business Phone', type: 'STRING', placeholder: '(555) 123-4567', icon: '📞' },
      { key: 'businessAddress', label: 'Business Address', type: 'STRING', placeholder: '123 Main St, City, State 12345', icon: '📍' },
    ]
  },
  features: {
    title: '⚡ Feature Toggles',
    color: 'green',
    settings: [
      { key: 'enableDelivery', label: 'Enable Delivery', type: 'BOOLEAN', defaultValue: true, icon: '🚚' },
      { key: 'enablePickup', label: 'Enable Pickup', type: 'BOOLEAN', defaultValue: true, icon: '🏃‍♂️' },
      { key: 'enableOnlineOrdering', label: 'Enable Online Ordering', type: 'BOOLEAN', defaultValue: true, icon: '💻' },
      { key: 'enableLoyaltyProgram', label: 'Enable Loyalty Program', type: 'BOOLEAN', defaultValue: false, icon: '⭐' },
      { key: 'showPrices', label: 'Show Prices on Menu', type: 'BOOLEAN', defaultValue: true, icon: '💰' },
      { key: 'showNutritionInfo', label: 'Show Nutrition Info', type: 'BOOLEAN', defaultValue: false, icon: '🥗' },
    ]
  },
  pricing: {
    title: '💰 Pricing Settings',
    color: 'yellow',
    settings: [
      { key: 'deliveryFee', label: 'Delivery Fee', type: 'NUMBER', placeholder: '2.99', icon: '💵' },
      { key: 'taxRate', label: 'Tax Rate (%)', type: 'NUMBER', placeholder: '8.25', icon: '📊' },
      { key: 'minimumOrderAmount', label: 'Minimum Order Amount', type: 'NUMBER', placeholder: '15.00', icon: '🛒' },
      { key: 'tipSuggestions', label: 'Tip Suggestions (%)', type: 'STRING', placeholder: '15,18,20,25', icon: '💡' },
    ]
  },
  display: {
    title: '🎨 Display Settings',
    color: 'purple',
    settings: [
      { key: 'primaryColor', label: 'Primary Color', type: 'STRING', placeholder: '#f97316', icon: '🎨' },
      { key: 'secondaryColor', label: 'Secondary Color', type: 'STRING', placeholder: '#1f2937', icon: '🖌️' },
      { key: 'fontFamily', label: 'Font Family', type: 'STRING', placeholder: 'Inter, sans-serif', icon: '🔤' },
      { key: 'logoUrl', label: 'Logo URL', type: 'STRING', placeholder: '/images/logo.png', icon: '🖼️' },
    ]
  }
};

type SettingType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';

export default function SettingsManagementPage() {
  const { settings, refreshSettings } = useAppSettingsContext();
  const { show: showToast } = useToast();
  const [allSettings, setAllSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('business');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  // Load all settings from the API
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings?format=array');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      
      if (Array.isArray(data.settings)) {
        setAllSettings(data.settings);
      } else {
        console.error('Expected array but got:', typeof data.settings, data.settings);
        setAllSettings([]);
      }
    } catch (error) {
      showToast('Failed to load settings', { type: 'error' });
      console.error('Error loading settings:', error);
      setAllSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Get setting value by key
  const getSettingValue = (key: string) => {
    const setting = allSettings.find(s => s.key === key);
    return setting ? setting.value : '';
  };

  // Quick toggle for boolean settings
  const handleQuickToggle = async (key: string) => {
    const currentValue = getSettingValue(key);
    const newValue = currentValue === 'true' ? 'false' : 'true';
    await updateSetting(key, newValue);
  };

  // Update a single setting
  const updateSetting = async (key: string, value: string) => {
    try {
      const settingsToUpdate = { [key]: value };
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToUpdate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update setting');
      }
      
      showToast(`${key} updated successfully`, { type: 'success' });
      await loadSettings();
      refreshSettings();
    } catch (error: any) {
      showToast(`Failed to update ${key}: ${error.message || 'Unknown error'}`, { type: 'error' });
      console.error('Error updating setting:', error);
    }
  };

  // Handle pending changes in bulk mode
  const handlePendingChange = (key: string, value: string) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  };

  // Apply all pending changes
  const applyPendingChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      showToast('No changes to apply', { type: 'info' });
      return;
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: pendingChanges }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }
      
      showToast(`${Object.keys(pendingChanges).length} settings updated successfully`, { type: 'success' });
      setPendingChanges({});
      setBulkMode(false);
      await loadSettings();
      refreshSettings();
    } catch (error: any) {
      showToast(`Failed to update settings: ${error.message || 'Unknown error'}`, { type: 'error' });
      console.error('Error updating settings:', error);
    }
  };

  // Quick setup - add all settings from a template with default values
  const handleQuickSetup = async (templateKey: keyof typeof SETTING_TEMPLATES) => {
    const template = SETTING_TEMPLATES[templateKey];
    const settingsToUpdate: Record<string, string> = {};
    
    template.settings.forEach((setting: SettingTemplate) => {
      if (setting.type === 'BOOLEAN') {
        settingsToUpdate[setting.key] = setting.defaultValue ? 'true' : 'false';
      } else {
        settingsToUpdate[setting.key] = setting.placeholder || '';
      }
    });

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToUpdate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to setup settings');
      }
      
      showToast(`${template.title} setup completed`, { type: 'success' });
      await loadSettings();
      refreshSettings();
    } catch (error: any) {
      showToast(`Failed to setup ${template.title}: ${error.message || 'Unknown error'}`, { type: 'error' });
      console.error('Error setting up template:', error);
    }
  };

  // Delete a setting
  const deleteSetting = async (setting: Setting) => {
    if (!confirm(`Are you sure you want to delete "${setting.key}"?`)) return;

    try {
      const response = await fetch(`/api/admin/settings/${setting.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete setting');
      }
      
      showToast(`${setting.key} deleted successfully`, { type: 'success' });
      await loadSettings();
      refreshSettings();
    } catch (error: any) {
      showToast(`Failed to delete ${setting.key}: ${error.message || 'Unknown error'}`, { type: 'error' });
      console.error('Error deleting setting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading your settings...</p>
        </div>
      </div>
    );
  }

  const currentTemplate = SETTING_TEMPLATES[activeTab as keyof typeof SETTING_TEMPLATES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚙️ Smart Settings Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Effortlessly manage your application settings with our intuitive point-and-click interface. No typing required!
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  bulkMode 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {bulkMode ? '📝 Bulk Edit Mode' : '⚡ Quick Mode'}
              </button>
              
              {bulkMode && Object.keys(pendingChanges).length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {Object.keys(pendingChanges).length} changes pending
                  </span>
                  <button
                    onClick={applyPendingChanges}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply All Changes
                  </button>
                  <button
                    onClick={() => setPendingChanges({})}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear Changes
                  </button>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              {allSettings.length} total settings
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {Object.entries(SETTING_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {template.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentTemplate.title}
            </h2>
            <button
              onClick={() => handleQuickSetup(activeTab)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">🚀</span>
              Quick Setup
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTemplate.settings.map((template: SettingTemplate) => {
              const currentValue = getSettingValue(template.key);
              const pendingValue = pendingChanges[template.key];
              const displayValue = pendingValue !== undefined ? pendingValue : currentValue;
              const hasChanges = pendingValue !== undefined && pendingValue !== currentValue;

              return (
                <div
                  key={template.key}
                  className={`border rounded-lg p-6 transition-all ${
                    hasChanges ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{template.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.label}</h3>
                        <p className="text-sm text-gray-500">{template.key}</p>
                      </div>
                    </div>
                    
                    {currentValue && (
                      <button
                        onClick={() => deleteSetting(allSettings.find(s => s.key === template.key)!)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete setting"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {template.type === 'BOOLEAN' ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          if (bulkMode) {
                            handlePendingChange(template.key, 'true');
                          } else {
                            updateSetting(template.key, 'true');
                          }
                        }}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          displayValue === 'true'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        ✅ Enabled
                      </button>
                      <button
                        onClick={() => {
                          if (bulkMode) {
                            handlePendingChange(template.key, 'false');
                          } else {
                            updateSetting(template.key, 'false');
                          }
                        }}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          displayValue === 'false'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        ❌ Disabled
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type={template.type === 'NUMBER' ? 'number' : 'text'}
                        value={displayValue}
                        onChange={(e) => {
                          if (bulkMode) {
                            handlePendingChange(template.key, e.target.value);
                          } else {
                            updateSetting(template.key, e.target.value);
                          }
                        }}
                        placeholder={template.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      {template.type === 'STRING' && template.key.includes('Color') && displayValue && (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded border border-gray-300"
                            style={{ backgroundColor: displayValue }}
                          ></div>
                          <span className="text-sm text-gray-600">Color preview</span>
                        </div>
                      )}
                    </div>
                  )}

                  {hasChanges && (
                    <div className="mt-3 text-sm text-orange-600 font-medium">
                      📝 Changed (will be saved with bulk update)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Total Settings</h3>
            <p className="text-2xl font-bold text-blue-600">{allSettings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🔤</div>
            <h3 className="font-semibold text-gray-900">Text Settings</h3>
            <p className="text-2xl font-bold text-green-600">
              {allSettings.filter(s => s.type === 'STRING').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🔢</div>
            <h3 className="font-semibold text-gray-900">Number Settings</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {allSettings.filter(s => s.type === 'NUMBER').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900">Feature Toggles</h3>
            <p className="text-2xl font-bold text-purple-600">
              {allSettings.filter(s => s.type === 'BOOLEAN').length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
            >
              📊 Admin Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
            >
              🌐 View Website
            </button>
            <button
              onClick={() => {
                refreshSettings();
                loadSettings();
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
            >
              🔄 Refresh Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
