import React, { useState } from 'react';
import { Save, Clock, Calendar, DollarSign, Store, Bell, MapPin, Phone, Mail } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Business Info
    businessName: 'Tony\'s Pizza & Subs',
    address: '123 Main Street, Downtown',
    phone: '(555) 123-4567',
    email: 'orders@tonyspizza.com',
    
    // Tax Settings
    taxRate: 8.25,
    taxIncluded: false,
    
    // Business Hours
    businessHours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    },
    
    // Holiday Hours
    holidays: [
      { name: 'Christmas Day', date: '2025-12-25', closed: true, openTime: '', closeTime: '' },
      { name: 'New Year\'s Day', date: '2026-01-01', closed: true, openTime: '', closeTime: '' },
      { name: 'Thanksgiving', date: '2025-11-27', closed: false, openTime: '12:00', closeTime: '18:00' },
      { name: 'Independence Day', date: '2025-07-04', closed: false, openTime: '12:00', closeTime: '20:00' }
    ],
    
    // Order Settings
    minOrderAmount: 12.00,
    deliveryFee: 3.99,
    deliveryRadius: 5,
    estimatedPrepTime: 25,
    maxAdvanceOrderDays: 3,
    
    // Notifications
    orderNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    lowInventoryAlerts: true,
    
    // Payment Options
    acceptCash: true,
    acceptCard: true,
    acceptDigitalWallet: true,
    tipSuggestions: [15, 18, 20, 25]
  });

  const [activeTab, setActiveTab] = useState('business');
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      setHasChanges(true);
      return newSettings;
    });
  };

  const addHoliday = () => {
    const newHoliday = {
      name: '',
      date: '',
      closed: true,
      openTime: '',
      closeTime: ''
    };
    updateSetting('holidays', [...settings.holidays, newHoliday]);
  };

  const removeHoliday = (index) => {
    const newHolidays = settings.holidays.filter((_, i) => i !== index);
    updateSetting('holidays', newHolidays);
  };

  const updateHoliday = (index, field, value) => {
    const newHolidays = [...settings.holidays];
    newHolidays[index][field] = value;
    updateSetting('holidays', newHolidays);
  };

  const saveSettings = () => {
    // Here you would typically send the settings to your backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: Store },
    { id: 'hours', label: 'Hours & Holidays', icon: Clock },
    { id: 'orders', label: 'Orders & Payments', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your restaurant configuration</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                hasChanges 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => updateSetting('businessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => updateSetting('phone', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => updateSetting('address', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.taxRate}
                      onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id="taxIncluded"
                      checked={settings.taxIncluded}
                      onChange={(e) => updateSetting('taxIncluded', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="taxIncluded" className="ml-2 text-sm text-gray-700">
                      Tax included in prices
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Hours & Holidays Tab */}
            {activeTab === 'hours' && (
              <div className="space-y-8">
                {/* Business Hours */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Regular Business Hours</h3>
                  <div className="space-y-3">
                    {Object.entries(settings.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-24">
                            <span className="font-medium text-gray-700">{dayNames[day]}</span>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={hours.closed}
                              onChange={(e) => updateSetting(`businessHours.${day}.closed`, e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">Closed</span>
                          </label>
                        </div>
                        
                        {!hours.closed && (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => updateSetting(`businessHours.${day}.open`, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => updateSetting(`businessHours.${day}.close`, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Holiday Hours */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Holiday Hours</h3>
                    <button
                      onClick={addHoliday}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Add Holiday
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {settings.holidays.map((holiday, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Holiday Name</label>
                            <input
                              type="text"
                              value={holiday.name}
                              onChange={(e) => updateHoliday(index, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Holiday name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                            <input
                              type="date"
                              value={holiday.date}
                              onChange={(e) => updateHoliday(index, 'date', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={holiday.closed}
                                onChange={(e) => updateHoliday(index, 'closed', e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-600">Closed</span>
                            </label>
                            
                            {!holiday.closed && (
                              <div className="flex items-center gap-1">
                                <input
                                  type="time"
                                  value={holiday.openTime}
                                  onChange={(e) => updateHoliday(index, 'openTime', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs w-20"
                                />
                                <span className="text-xs text-gray-500">-</span>
                                <input
                                  type="time"
                                  value={holiday.closeTime}
                                  onChange={(e) => updateHoliday(index, 'closeTime', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs w-20"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <button
                              onClick={() => removeHoliday(index)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders & Payments Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.minOrderAmount}
                      onChange={(e) => updateSetting('minOrderAmount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.deliveryFee}
                      onChange={(e) => updateSetting('deliveryFee', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Radius (miles)
                    </label>
                    <input
                      type="number"
                      value={settings.deliveryRadius}
                      onChange={(e) => updateSetting('deliveryRadius', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Prep Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.estimatedPrepTime}
                      onChange={(e) => updateSetting('estimatedPrepTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Advance Order Days
                  </label>
                  <input
                    type="number"
                    value={settings.maxAdvanceOrderDays}
                    onChange={(e) => updateSetting('maxAdvanceOrderDays', parseInt(e.target.value))}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.acceptCash}
                        onChange={(e) => updateSetting('acceptCash', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Accept Cash</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.acceptCard}
                        onChange={(e) => updateSetting('acceptCard', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Accept Credit/Debit Cards</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.acceptDigitalWallet}
                        onChange={(e) => updateSetting('acceptDigitalWallet', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Accept Digital Wallets (Apple Pay, Google Pay)</span>
                    </label>
                  </div>
                </div>

                {/* Tip Suggestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip Suggestions (%)
                  </label>
                  <div className="flex gap-2">
                    {settings.tipSuggestions.map((tip, index) => (
                      <input
                        key={index}
                        type="number"
                        value={tip}
                        onChange={(e) => {
                          const newTips = [...settings.tipSuggestions];
                          newTips[index] = parseInt(e.target.value);
                          updateSetting('tipSuggestions', newTips);
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Order Notifications</span>
                        <p className="text-xs text-gray-500">Get notified when new orders are received</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.orderNotifications}
                        onChange={(e) => updateSetting('orderNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                        <p className="text-xs text-gray-500">Receive order confirmations and updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                        <p className="text-xs text-gray-500">Get text message alerts for urgent orders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Low Inventory Alerts</span>
                        <p className="text-xs text-gray-500">Be notified when ingredients are running low</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.lowInventoryAlerts}
                        onChange={(e) => updateSetting('lowInventoryAlerts', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;