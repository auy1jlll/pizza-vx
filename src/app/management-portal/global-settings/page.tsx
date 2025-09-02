'use client';

import { useState, useEffect } from 'react';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import { useToast } from '@/components/ToastProvider';
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
  Shield,
  Settings,
  Palette,
  Users,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Timer,
  Edit3,
  Eye,
  EyeOff,
  Upload,
  Image,
  Copy
} from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  createdAt: string;
  updatedAt: string;
}

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  settings: Setting[];
}

export default function GlobalSettingsPage() {
  const { settings, refreshSettings } = useAppSettingsContext();
  const { show: showToast } = useToast();
  const [allSettings, setAllSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('business');
  const [editingSettings, setEditingSettings] = useState<{[key: string]: any}>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all settings from the API
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/management-portal/settings?format=array');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      
      if (Array.isArray(data.settings)) {
        setAllSettings(data.settings);
        
        // Initialize editing state with current values
        const editState: {[key: string]: any} = {};
        data.settings.forEach((setting: Setting) => {
          editState[setting.key] = setting.value;
        });
        setEditingSettings(editState);
      } else {
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

  // Helper function to render setting input based on type

  // Define setting sections with categorized settings
  const settingSections: SettingSection[] = [
    {
      id: 'business',
      title: 'Business Information',
      description: 'Basic business details and contact information',
      icon: Building,
      color: 'from-blue-500 to-blue-600',
      settings: allSettings.filter(s => 
        ['app_name', 'app_tagline', 'businessName', 'businessPhone', 'businessEmail', 'businessAddress', 'businessDescription'].includes(s.key)
      )
    },
    {
      id: 'hours',
      title: 'Business Hours',
      description: 'Set your restaurant\'s operating hours for each day of the week',
      icon: Clock,
      color: 'from-indigo-500 to-indigo-600',
      settings: allSettings.filter(s => 
        ['mondayOpen', 'mondayClose', 'mondayClosed', 'tuesdayOpen', 'tuesdayClose', 'tuesdayClosed', 'wednesdayOpen', 'wednesdayClose', 'wednesdayClosed', 'thursdayOpen', 'thursdayClose', 'thursdayClosed', 'fridayOpen', 'fridayClose', 'fridayClosed', 'saturdayOpen', 'saturdayClose', 'saturdayClosed', 'sundayOpen', 'sundayClose', 'sundayClosed', 'operating_hours'].includes(s.key)
      )
    },
    {
      id: 'pricing',
      title: 'Pricing & Payments',
      description: 'Tax rates, delivery fees, and payment options',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      settings: allSettings.filter(s => 
        ['taxRate', 'deliveryFee', 'deliveryEnabled', 'minimumOrder', 'tipPercentages', 'defaultTipPercentage', 'allowPayAtPickup', 'allowPayLater', 'payLaterMinimumOrder', 'intensityLightMultiplier', 'intensityRegularMultiplier', 'intensityExtraMultiplier', 'removalCreditPercentage'].includes(s.key)
      )
    },
    {
      id: 'operations',
      title: 'Operations & Timing',
      description: 'Preparation times, delivery settings, and operational preferences',
      icon: Timer,
      color: 'from-orange-500 to-orange-600',
      settings: allSettings.filter(s => 
        ['preparationTime', 'deliveryTimeBuffer', 'showDeliveryTime'].includes(s.key)
      )
    },
    {
      id: 'features',
      title: 'Features & Display',
      description: 'Enable/disable features and customize display options',
      icon: Settings,
      color: 'from-purple-500 to-purple-600',
      settings: allSettings.filter(s => 
        ['showPricingBreakdown', 'allowRemovalCredits', 'enableRewards', 'enableNotifications', 'enableInventoryTracking', 'enableLoyaltyProgram', 'enableMultiLocation', 'enableAdvancedReporting'].includes(s.key)
      )
    },
    {
      id: 'branding',
      title: 'Branding & Appearance',
      description: 'Colors, logos, and visual customization',
      icon: Palette,
      color: 'from-pink-500 to-pink-600',
      settings: allSettings.filter(s => 
        ['primaryColor', 'secondaryColor', 'logoUrl', 'faviconUrl', 'appLogoUrl', 'themeMode', 'brandFont', 'headerBackgroundColor', 'accentColor', 'customCSS', 'brand_colors'].includes(s.key)
      )
    },
    {
      id: 'notifications',
      title: 'Notifications & Alerts',
      description: 'Email, SMS, and system notification settings',
      icon: Bell,
      color: 'from-red-500 to-red-600',
      settings: allSettings.filter(s => 
        ['emailNotifications', 'smsNotifications', 'adminAlerts', 'orderNotifications', 'inventoryAlerts', 'lowStockAlerts', 'customerNotifications'].includes(s.key)
      )
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'Gmail service settings for email notifications and communications',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      settings: allSettings.filter(s => 
        ['gmailUser', 'gmailAppPassword', 'emailServiceEnabled', 'emailFromName', 'emailReplyTo'].includes(s.key)
      )
    },
    {
      id: 'technical',
      title: 'System Configuration',
      description: 'Advanced technical settings and rate limiting configuration (Admin Only)',
      icon: Shield,
      color: 'from-gray-700 to-gray-800',
      settings: allSettings.filter(s => 
        ['rateLimitWindowSeconds', 'rateLimitMaxRequests', 'adminRateLimitWindowSeconds', 'adminRateLimitMaxRequests', 'kitchenPollingIntervalSeconds'].includes(s.key)
      )
    }
  ];

  // Get all settings that are already categorized
  const categorizedSettingKeys = settingSections.flatMap(section => 
    section.settings.map(setting => setting.key)
  );

  // Business hours keys that should never appear in "Other Settings"
  const businessHoursKeys = [
    'mondayOpen', 'mondayClose', 'mondayClosed',
    'tuesdayOpen', 'tuesdayClose', 'tuesdayClosed',
    'wednesdayOpen', 'wednesdayClose', 'wednesdayClosed',
    'thursdayOpen', 'thursdayClose', 'thursdayClosed',
    'fridayOpen', 'fridayClose', 'fridayClosed',
    'saturdayOpen', 'saturdayClose', 'saturdayClosed',
    'sundayOpen', 'sundayClose', 'sundayClosed',
    'operating_hours'
  ];

  // Add uncategorized settings section for any remaining settings
  const uncategorizedSettings = allSettings.filter(s => 
    !categorizedSettingKeys.includes(s.key) && !businessHoursKeys.includes(s.key)
  );

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('All settings:', allSettings.map(s => s.key));
    console.log('Categorized keys:', categorizedSettingKeys);
    console.log('Business hours keys:', businessHoursKeys);
    console.log('Uncategorized settings:', uncategorizedSettings.map(s => s.key));
    console.log('Business hours in uncategorized:', uncategorizedSettings.filter(s => businessHoursKeys.includes(s.key)).map(s => s.key));
  }

  // Add uncategorized section only if there are uncategorized settings
  if (uncategorizedSettings.length > 0) {
    settingSections.push({
      id: 'other',
      title: 'Other Settings',
      description: 'Additional configuration options and custom settings',
      icon: Globe,
      color: 'from-gray-500 to-gray-600',
      settings: uncategorizedSettings
    });
  }

  // Handle setting value change
  const handleSettingChange = (key: string, value: any, type: string) => {
    let processedValue = value;
    
    // Process value based on type
    if (type === 'BOOLEAN') {
      processedValue = value.toString();
    } else if (type === 'NUMBER') {
      processedValue = value.toString();
    } else if (type === 'JSON') {
      try {
        JSON.parse(value);
        processedValue = value;
      } catch {
        // Keep invalid JSON as string for now
        processedValue = value;
      }
    }
    
    setEditingSettings(prev => ({ ...prev, [key]: processedValue }));
    setHasChanges(true);
  };

  // Save all changes
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Prepare settings object for bulk update
      const settingsToUpdate: {[key: string]: any} = {};
      let changeCount = 0;
      
      for (const setting of allSettings) {
        if (editingSettings[setting.key] !== setting.value) {
          let processedValue = editingSettings[setting.key];
          
          // Convert values based on type for API
          switch (setting.type) {
            case 'BOOLEAN':
              processedValue = processedValue === 'true' || processedValue === true;
              break;
            case 'NUMBER':
              processedValue = parseFloat(processedValue) || 0;
              break;
            case 'JSON':
              try {
                processedValue = JSON.parse(processedValue);
              } catch {
                // Keep as string if invalid JSON
                processedValue = processedValue;
              }
              break;
            default:
              processedValue = String(processedValue);
          }
          
          settingsToUpdate[setting.key] = processedValue;
          changeCount++;
        }
      }

      if (changeCount === 0) {
        showToast('No changes to save', { type: 'info' });
        return;
      }

      // Send bulk update to API
      const response = await fetch('/api/management-portal/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToUpdate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }
      
      showToast(`Successfully saved ${changeCount} setting(s)`, { type: 'success' });
      setHasChanges(false);
      await loadSettings();
      refreshSettings();
    } catch (error) {
      showToast('Failed to save settings', { type: 'error' });
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  // Reset changes
  const handleResetChanges = () => {
    const editState: {[key: string]: any} = {};
    allSettings.forEach((setting: Setting) => {
      editState[setting.key] = setting.value;
    });
    setEditingSettings(editState);
    setHasChanges(false);
    showToast('Changes reset', { type: 'info' });
  };

  // Get user-friendly setting information
  const getSettingInfo = (key: string) => {
    const settingLabels: {[key: string]: {label: string, description: string}} = {
      // Business Information
      app_name: { label: 'Restaurant Name', description: 'The name displayed in your website header and branding' },
      app_tagline: { label: 'Tagline', description: 'Short tagline or slogan displayed under your restaurant name' },
      businessName: { label: 'Business Name', description: 'The name of your restaurant' },
      businessPhone: { label: 'Phone Number', description: 'Main contact phone number' },
      businessEmail: { label: 'Email Address', description: 'Main contact email address' },
      businessAddress: { label: 'Business Address', description: 'Full street address of your restaurant' },
      businessDescription: { label: 'Description', description: 'Brief description of your restaurant' },
      
      // Pricing & Payments
      taxRate: { label: 'Tax Rate', description: 'Sales tax percentage (e.g., 8.25 for 8.25%)' },
      deliveryFee: { label: 'Delivery Fee', description: 'Standard delivery charge in dollars' },
      deliveryEnabled: { label: 'Enable Delivery', description: 'Allow customers to place delivery orders' },
      minimumOrder: { label: 'Minimum Order', description: 'Minimum order amount for delivery' },
      tipPercentages: { label: 'Tip Options', description: 'Available tip percentage options for customers' },
      defaultTipPercentage: { label: 'Default Tip', description: 'Pre-selected tip percentage' },
      allowPayAtPickup: { label: 'Pay at Pickup', description: 'Allow customers to pay when picking up orders' },
      allowPayLater: { label: 'Pay Later', description: 'Allow customers to pay after receiving orders' },
      payLaterMinimumOrder: { label: 'Pay Later Minimum', description: 'Minimum order amount for pay later option' },
      
      // Operations & Timing
      preparationTime: { label: 'Preparation Time', description: 'Average time to prepare orders (minutes)' },
      deliveryTimeBuffer: { label: 'Delivery Buffer', description: 'Extra time buffer for deliveries (minutes)' },
      showDeliveryTime: { label: 'Show Delivery Time', description: 'Display estimated delivery times to customers' },
      
      // Business Hours
      mondayOpen: { label: 'Monday Opening', description: 'Opening time on Mondays' },
      mondayClose: { label: 'Monday Closing', description: 'Closing time on Mondays' },
      mondayClosed: { label: 'Monday Closed', description: 'Mark Monday as closed' },
      tuesdayOpen: { label: 'Tuesday Opening', description: 'Opening time on Tuesdays' },
      tuesdayClose: { label: 'Tuesday Closing', description: 'Closing time on Tuesdays' },
      tuesdayClosed: { label: 'Tuesday Closed', description: 'Mark Tuesday as closed' },
      wednesdayOpen: { label: 'Wednesday Opening', description: 'Opening time on Wednesdays' },
      wednesdayClose: { label: 'Wednesday Closing', description: 'Closing time on Wednesdays' },
      wednesdayClosed: { label: 'Wednesday Closed', description: 'Mark Wednesday as closed' },
      thursdayOpen: { label: 'Thursday Opening', description: 'Opening time on Thursdays' },
      thursdayClose: { label: 'Thursday Closing', description: 'Closing time on Thursdays' },
      thursdayClosed: { label: 'Thursday Closed', description: 'Mark Thursday as closed' },
      fridayOpen: { label: 'Friday Opening', description: 'Opening time on Fridays' },
      fridayClose: { label: 'Friday Closing', description: 'Closing time on Fridays' },
      fridayClosed: { label: 'Friday Closed', description: 'Mark Friday as closed' },
      saturdayOpen: { label: 'Saturday Opening', description: 'Opening time on Saturdays' },
      saturdayClose: { label: 'Saturday Closing', description: 'Closing time on Saturdays' },
      saturdayClosed: { label: 'Saturday Closed', description: 'Mark Saturday as closed' },
      sundayOpen: { label: 'Sunday Opening', description: 'Opening time on Sundays' },
      sundayClose: { label: 'Sunday Closing', description: 'Closing time on Sundays' },
      sundayClosed: { label: 'Sunday Closed', description: 'Mark Sunday as closed' },
      
      // Features & Display
      showPricingBreakdown: { label: 'Show Pricing Details', description: 'Display detailed price breakdown to customers' },
      allowRemovalCredits: { label: 'Removal Credits', description: 'Give credits for removed toppings' },
      enableRewards: { label: 'Rewards Program', description: 'Enable customer loyalty rewards' },
      enableNotifications: { label: 'System Notifications', description: 'Enable system-wide notifications' },
      enableInventoryTracking: { label: 'Inventory Tracking', description: 'Track ingredient and item inventory' },
      enableLoyaltyProgram: { label: 'Loyalty Program', description: 'Enable customer loyalty program' },
      enableMultiLocation: { label: 'Multi-Location', description: 'Enable multiple restaurant locations' },
      enableAdvancedReporting: { label: 'Advanced Reports', description: 'Enable detailed analytics and reporting' },
      
      // Branding & Appearance
      primaryColor: { label: 'Primary Color', description: 'Main brand color for your restaurant' },
      secondaryColor: { label: 'Secondary Color', description: 'Secondary brand color' },
      accentColor: { label: 'Accent Color', description: 'Accent color for highlights and buttons' },
      headerBackgroundColor: { label: 'Header Background', description: 'Background color for page headers' },
      logoUrl: { label: 'Logo URL', description: 'URL to your restaurant logo image' },
      appLogoUrl: { label: 'Restaurant Logo', description: 'Logo displayed in the navigation bar and branding' },
      faviconUrl: { label: 'Favicon URL', description: 'URL to your website favicon' },
      themeMode: { label: 'Theme Mode', description: 'Light or dark theme preference' },
      brandFont: { label: 'Brand Font', description: 'Font family for your brand' },
      customCSS: { label: 'Custom Styles', description: 'Additional CSS styling for customization' },
      brand_colors: { label: 'Brand Color Palette', description: 'Complete color scheme for your restaurant brand' },
      
      // Notifications & Alerts
      emailNotifications: { label: 'Email Notifications', description: 'Send notifications via email' },
      smsNotifications: { label: 'SMS Notifications', description: 'Send notifications via SMS' },
      adminAlerts: { label: 'Admin Alerts', description: 'Send alerts to administrators' },
      orderNotifications: { label: 'Order Notifications', description: 'Notify about new orders' },
      inventoryAlerts: { label: 'Inventory Alerts', description: 'Alert when inventory is low' },
      lowStockAlerts: { label: 'Low Stock Alerts', description: 'Alert when items are running low' },
      customerNotifications: { label: 'Customer Notifications', description: 'Send notifications to customers' },
      
      // Pricing Multipliers
      intensityLightMultiplier: { label: 'Light Intensity Multiplier', description: 'Price multiplier for light intensity toppings' },
      intensityRegularMultiplier: { label: 'Regular Intensity Multiplier', description: 'Price multiplier for regular intensity toppings' },
      intensityExtraMultiplier: { label: 'Extra Intensity Multiplier', description: 'Price multiplier for extra intensity toppings' },
      removalCreditPercentage: { label: 'Removal Credit %', description: 'Credit percentage for removed standard toppings' },
      
      // System Configuration (Technical Settings)
      rateLimitWindowSeconds: { label: 'Rate Limit Window', description: 'Duration for general API rate limiting window (seconds)' },
      rateLimitMaxRequests: { label: 'Rate Limit Max Requests', description: 'Maximum requests allowed per rate limit window for general APIs' },
      adminRateLimitWindowSeconds: { label: 'Admin Rate Limit Window', description: 'Duration for admin API rate limiting window (seconds)' },
      adminRateLimitMaxRequests: { label: 'Admin Rate Limit Max Requests', description: 'Maximum requests allowed per window for admin/kitchen APIs' },
      kitchenPollingIntervalSeconds: { label: 'Kitchen Polling Interval', description: 'How often kitchen display refreshes orders (seconds)' }
    };
    
    return settingLabels[key] || { label: key, description: 'Configuration setting' };
  };
  const renderSettingInput = (setting: Setting) => {
    const currentValue = editingSettings[setting.key] || setting.value;
    
    // Special handling for specific settings
    if (setting.key === 'tipPercentages') {
      let tipValues: number[] = [];
      try {
        tipValues = JSON.parse(currentValue);
        if (!Array.isArray(tipValues)) tipValues = [];
      } catch {
        tipValues = [];
      }
      
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Tip percentage options for customers:</div>
          {tipValues.map((tip, index) => (
            <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
              <input
                type="number"
                value={tip}
                onChange={(e) => {
                  const newTips = [...tipValues];
                  newTips[index] = parseFloat(e.target.value) || 0;
                  handleSettingChange(setting.key, JSON.stringify(newTips), setting.type);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter tip percentage"
                min="0"
                max="100"
                step="0.5"
              />
              <span className="text-gray-500 font-medium">%</span>
              <button
                onClick={() => {
                  const newTips = tipValues.filter((_, i) => i !== index);
                  handleSettingChange(setting.key, JSON.stringify(newTips), setting.type);
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newTips = [...tipValues, 15];
              handleSettingChange(setting.key, JSON.stringify(newTips), setting.type);
            }}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <DollarSign size={16} className="mr-2" />
            Add New Tip Option
          </button>
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            <strong>Tip:</strong> Common tip percentages are 15%, 18%, 20%, and 25%. You can add as many options as needed.
          </div>
        </div>
      );
    }
    
    // Time inputs for business hours
    if (setting.key.includes('Open') || setting.key.includes('Close')) {
      return (
        <div className="space-y-2">
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="time"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="text-xs text-gray-500">
            Set to 00:00 if closed on this day
          </div>
        </div>
      );
    }
    
    // Color picker for color settings
    if (setting.key.toLowerCase().includes('color')) {
      const isValidColor = /^#[0-9A-F]{6}$/i.test(currentValue);
      
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="color"
                value={currentValue.startsWith('#') ? currentValue : '#' + currentValue}
                onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
                className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors"
              />
              <div 
                className="absolute top-0 left-0 w-16 h-12 rounded-lg border-2 border-white pointer-events-none"
                style={{ backgroundColor: isValidColor ? currentValue : '#cccccc' }}
              ></div>
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  isValidColor ? 'border-gray-300' : 'border-red-300 bg-red-50'
                }`}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
              {!isValidColor && (
                <div className="text-xs text-red-600 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Please enter a valid hex color (e.g., #FF5722)
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            <strong>Tip:</strong> Use the color picker or enter a hex color code. Examples: #FF5722 (orange), #2196F3 (blue)
          </div>
        </div>
      );
    }
    
    // Email input for email settings
    if (setting.key.toLowerCase().includes('email')) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue);
      
      return (
        <div className="space-y-2">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                currentValue && !isValidEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="email@example.com"
            />
          </div>
          {currentValue && !isValidEmail && (
            <div className="text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Please enter a valid email address
            </div>
          )}
        </div>
      );
    }
    
    // Phone input for phone settings
    if (setting.key.toLowerCase().includes('phone')) {
      return (
        <div className="space-y-2">
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="text-xs text-gray-500">
            Enter your business phone number with area code
          </div>
        </div>
      );
    }
    
    // URL inputs with upload functionality for logos and favicons
    if (setting.key.toLowerCase().includes('url') || setting.key.toLowerCase().includes('logo') || setting.key.toLowerCase().includes('favicon')) {
      const isValidUrl = currentValue === '' || /^https?:\/\/.+/.test(currentValue);
      const isImageSetting = setting.key.toLowerCase().includes('logo') || setting.key.toLowerCase().includes('favicon');
      
      const handleFileUpload = async (file: File) => {
        if (!file) {
          console.log('No file provided');
          return;
        }
        
        console.log('Starting file upload for:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.error('Invalid file type:', file.type);
          alert('Please select an image file');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error('File too large:', file.size);
          alert('File size must be less than 5MB');
          return;
        }
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', setting.key.toLowerCase().includes('favicon') ? 'favicon' : 'logo');
          
          console.log('Uploading to /api/upload/image...');
          
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });
          
          console.log('Upload response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed with status:', response.status, 'Error:', errorText);
            throw new Error(`Upload failed: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Upload successful:', data);
          
          // Update the setting with the new URL
          handleSettingChange(setting.key, data.url, setting.type);
          console.log('Setting updated with URL:', data.url);
          
          alert(`Upload successful! URL: ${data.url}`);
        } catch (error) {
          console.error('Upload error:', error);
          alert('Failed to upload image. Please try again. Check console for details.');
        }
      };
      
      return (
        <div className="space-y-4">
          {/* URL Input */}
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-3 text-white/50" />
            <input
              type="url"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${
                currentValue && !isValidUrl ? 'border-red-300' : 'border-white/20'
              }`}
              placeholder="https://example.com or upload an image below"
            />
          </div>
          
          {/* Upload Section for Images */}
          {isImageSetting && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white flex items-center">
                  <Upload size={16} className="mr-2 text-orange-400" />
                  Upload {setting.key.toLowerCase().includes('favicon') ? 'Favicon' : 'Logo'}
                </h4>
                <span className="text-xs text-white/60">Max 5MB</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-colors">
                    <Upload size={16} className="mr-2 text-orange-400" />
                    <span className="text-sm text-orange-300">Choose File</span>
                  </div>
                </label>
                
                {/* Preview current image if URL exists */}
                {currentValue && isValidUrl && (
                  <div className="relative group">
                    <img
                      src={currentValue}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-xs text-white">Preview</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-white/60 mt-2">
                {setting.key.toLowerCase().includes('favicon') 
                  ? 'Recommended: 32x32px ICO or PNG format'
                  : 'Recommended: PNG or SVG format, transparent background'
                }
              </div>
            </div>
          )}
          
          {currentValue && !isValidUrl && (
            <div className="text-xs text-red-400 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Please enter a valid URL starting with http:// or https://
            </div>
          )}
        </div>
      );
    }
    
    // Textarea for long text settings
    if (setting.key.toLowerCase().includes('description') || setting.key.toLowerCase().includes('address') || setting.key.toLowerCase().includes('css')) {
      return (
        <div className="space-y-2">
          <div className="relative">
            {setting.key.toLowerCase().includes('address') && (
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
            )}
            <textarea
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              rows={setting.key.toLowerCase().includes('css') ? 5 : 3}
              className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
                setting.key.toLowerCase().includes('address') ? 'pl-10' : ''
              } ${setting.key.toLowerCase().includes('css') ? 'font-mono text-sm' : ''}`}
              placeholder={
                setting.key.includes('address') ? "123 Main St, City, State 12345" : 
                setting.key.includes('css') ? "/* Custom CSS styles */" :
                "Enter description..."
              }
            />
          </div>
          <div className="text-xs text-gray-500">
            {setting.key.includes('css') && 'Enter custom CSS styles to customize your restaurant\'s appearance'}
            {setting.key.includes('description') && 'Describe your restaurant in a few sentences'}
            {setting.key.includes('address') && 'Enter your full business address'}
          </div>
        </div>
      );
    }
    
    switch (setting.type) {
      case 'BOOLEAN':
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSettingChange(setting.key, currentValue === 'true' ? 'false' : 'true', setting.type)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentValue === 'true' ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentValue === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">
              {currentValue === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      
      case 'NUMBER':
        const isPercentage = setting.key.includes('Rate') || setting.key.includes('Percentage');
        const isCurrency = setting.key.includes('Fee') || setting.key.includes('Order') || setting.key.includes('minimum');
        const isTime = setting.key.includes('Time') || setting.key.includes('Buffer');
        
        return (
          <div className="relative">
            {isCurrency && (
              <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
            )}
            <input
              type="number"
              step={isPercentage || setting.key.includes('Multiplier') ? '0.01' : isCurrency ? '0.01' : '1'}
              min="0"
              max={isPercentage ? '100' : undefined}
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                isCurrency ? 'pl-8' : ''
              } ${isPercentage ? 'pr-8' : ''}`}
              placeholder={isPercentage ? 'Enter percentage' : isCurrency ? 'Enter amount' : isTime ? 'Enter minutes' : 'Enter number'}
            />
            {isPercentage && (
              <span className="absolute right-3 top-3 text-gray-500 font-medium">%</span>
            )}
            {isTime && (
              <span className="absolute right-3 top-3 text-gray-500 text-sm">min</span>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {isPercentage && 'Enter as decimal (e.g., 8.25 for 8.25%)'}
              {isCurrency && 'Enter amount in dollars (e.g., 3.50)'}
              {isTime && 'Enter time in minutes (e.g., 15)'}
            </div>
          </div>
        );
      
      case 'JSON':
        // For JSON settings that we haven't specifically handled, show a user-friendly message
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center text-yellow-800">
              <AlertCircle size={16} className="mr-2" />
              <span className="text-sm font-medium">Advanced Setting</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              This is a complex setting that requires technical configuration. Current value: 
              <code className="bg-yellow-100 px-1 rounded text-xs ml-1">{JSON.stringify(currentValue).substring(0, 50)}...</code>
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Contact technical support to modify this setting safely.
            </p>
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter value..."
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <span className="ml-4 text-lg text-gray-600">Loading settings...</span>
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
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Globe className="mr-4 text-orange-400" size={40} />
                  Global Settings
                </h1>
                <p className="text-white/70">
                  Manage your restaurant configuration with our intuitive point-and-click interface
                </p>
                <div className="mt-3 flex items-center text-sm text-white/60">
                  <CheckCircle className="mr-2 text-green-400" size={16} />
                  No JSON editing required - everything is user-friendly forms
                </div>
              </div>
              
              {/* Save/Reset Actions */}
              {hasChanges && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleResetChanges}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/20 flex items-center"
                  >
                    <AlertCircle className="mr-2" size={18} />
                    Reset
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all shadow-lg flex items-center font-medium"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section Navigation */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Settings Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingSections.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                const settingsCount = section.settings.length;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`group cursor-pointer bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left ${
                      isActive ? 'bg-white/25 border-orange-400/50 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold transition-colors ${
                          isActive ? 'text-orange-300' : 'text-white group-hover:text-orange-300'
                        }`}>
                          {section.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed mb-3">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">
                        {settingsCount} setting{settingsCount !== 1 ? 's' : ''}
                      </span>
                      <div className={`text-sm font-medium transition-colors ${
                        isActive ? 'text-orange-300' : 'text-orange-400 group-hover:text-orange-300'
                      }`}>
                        Configure →
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Section Settings */}
          {settingSections.map((section) => {
            if (activeSection !== section.id) return null;
            
            const IconComponent = section.icon;
            
            return (
              <div key={section.id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                {/* Section Header */}
                <div className={`p-6 bg-gradient-to-r ${section.color} text-white rounded-t-2xl`}>
                  <div className="flex items-center">
                    <IconComponent size={32} className="mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                      <p className="text-white/90 mt-1">{section.description}</p>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                  {section.settings.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle size={48} className="mx-auto text-white/40 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Settings Found</h3>
                      <p className="text-white/70">
                        No settings have been configured for this category yet.
                      </p>
                    </div>
                  ) : section.id === 'hours' ? (
                    // Special layout for business hours
                    <div className="space-y-4">
                      {/* Handle operating_hours JSON setting if it exists */}
                      {(() => {
                        const operatingHoursSetting = section.settings.find(s => s.key === 'operating_hours');
                        if (operatingHoursSetting) {
                          return (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                              <div className="flex items-center text-yellow-300 mb-2">
                                <AlertCircle size={16} className="mr-2" />
                                <span className="text-sm font-medium">Legacy Operating Hours Setting Detected</span>
                              </div>
                              <p className="text-sm text-yellow-200">
                                Found an old JSON-based operating hours setting. Consider migrating to individual day settings for better management.
                              </p>
                              <details className="mt-2">
                                <summary className="text-sm text-yellow-200 cursor-pointer">View Raw JSON Data</summary>
                                <pre className="text-xs bg-yellow-500/20 p-2 rounded mt-2 overflow-auto text-yellow-100">
                                  {operatingHoursSetting.value}
                                </pre>
                              </details>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                      const openKey = `${day}Open`;
                      const closeKey = `${day}Close`;
                      const closedKey = `${day}Closed`;
                      const openSetting = section.settings.find(s => s.key === openKey);
                      const closeSetting = section.settings.find(s => s.key === closeKey);
                      const closedSetting = section.settings.find(s => s.key === closedKey);
                      
                      // Always show the day row even if some settings are missing
                      const openValue = editingSettings[openKey] || openSetting?.value || '09:00';
                      const closeValue = editingSettings[closeKey] || closeSetting?.value || '17:00';
                      const closedValue = editingSettings[closedKey] !== undefined 
                        ? editingSettings[closedKey] 
                        : (closedSetting?.value === 'true');
                      
                      // Check if closed based on either the boolean setting or time-based closure
                      const isClosed = closedValue === true || (openValue === '00:00' && closeValue === '00:00');
                      
                      return (
                        <div key={day} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <h4 className="font-semibold text-white text-lg capitalize">{day}</h4>
                              <div className="ml-3 flex items-center">
                                <button
                                  onClick={() => {
                                    if (isClosed) {
                                      // Opening the day
                                      handleSettingChange(openKey, '09:00', 'STRING');
                                      handleSettingChange(closeKey, '17:00', 'STRING');
                                      if (closedSetting) {
                                        handleSettingChange(closedKey, false, 'BOOLEAN');
                                      }
                                    } else {
                                      // Closing the day
                                      if (closedSetting) {
                                        handleSettingChange(closedKey, true, 'BOOLEAN');
                                      } else {
                                        // Fallback to time-based closure
                                        handleSettingChange(openKey, '00:00', 'STRING');
                                        handleSettingChange(closeKey, '00:00', 'STRING');
                                      }
                                    }
                                  }}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    !isClosed ? 'bg-green-500' : 'bg-white/20'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      !isClosed ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className={`ml-2 text-sm ${!isClosed ? 'text-green-400' : 'text-white/50'}`}>
                                  {!isClosed ? 'Open' : 'Closed'}
                                </span>
                              </div>
                            </div>
                            {((openSetting && editingSettings[openKey] !== openSetting.value) || 
                              (closeSetting && editingSettings[closeKey] !== closeSetting.value) ||
                              (closedSetting && editingSettings[closedKey] !== undefined && editingSettings[closedKey] !== (closedSetting.value === 'true'))) && (
                              <span className="text-orange-400 font-medium flex items-center text-sm">
                                <Edit3 size={12} className="mr-1" />
                                Modified
                              </span>
                            )}
                          </div>
                          
                          {!isClosed && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white/90">Opening Time</label>
                                <div className="relative">
                                  <Clock size={16} className="absolute left-3 top-3 text-white/50" />
                                  <input
                                    type="time"
                                    value={openValue}
                                    onChange={(e) => handleSettingChange(openKey, e.target.value, 'STRING')}
                                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white/90">Closing Time</label>
                                <div className="relative">
                                  <Clock size={16} className="absolute left-3 top-3 text-white/50" />
                                  <input
                                    type="time"
                                    value={closeValue}
                                    onChange={(e) => handleSettingChange(closeKey, e.target.value, 'STRING')}
                                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {isClosed && (
                            <div className="text-center py-4 text-white/50">
                              <span className="text-sm">Restaurant is closed on {day}s</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">📋 Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
                              handleSettingChange(`${day}Open`, '09:00', 'STRING');
                              handleSettingChange(`${day}Close`, '17:00', 'STRING');
                            });
                          }}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          Set Weekdays 9-5
                        </button>
                        <button
                          onClick={() => {
                            ['saturday', 'sunday'].forEach(day => {
                              handleSettingChange(`${day}Open`, '10:00', 'STRING');
                              handleSettingChange(`${day}Close`, '16:00', 'STRING');
                            });
                          }}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          Set Weekend 10-4
                        </button>
                        <button
                          onClick={() => {
                            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
                              handleSettingChange(`${day}Open`, '00:00', 'STRING');
                              handleSettingChange(`${day}Close`, '00:00', 'STRING');
                            });
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Close All Days
                        </button>
                      </div>
                    </div>
                  </div>
                ) : section.id === 'branding' ? (
                  // Special layout for branding and appearance
                  <div className="space-y-6">
                    {/* Logo Upload Section */}
                    {(() => {
                      const logoSetting = section.settings.find(s => s.key === 'appLogoUrl');
                      const faviconSetting = section.settings.find(s => s.key === 'appFaviconUrl');
                      
                      return (
                        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-6 backdrop-blur-sm">
                          <div className="flex items-center text-pink-300 mb-4">
                            <Image size={20} className="mr-2" />
                            <h3 className="text-lg font-semibold">Brand Assets</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo Upload */}
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-white/90">Restaurant Logo</label>
                              <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-pink-400 transition-colors backdrop-blur-sm">
                                {logoSetting?.value ? (
                                  <div className="space-y-3">
                                    <img 
                                      src={logoSetting.value} 
                                      alt="Current Logo" 
                                      className="max-h-16 mx-auto rounded"
                                      onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                    <div className="space-y-2">
                                      <input
                                        type="url"
                                        value={editingSettings['appLogoUrl'] || logoSetting.value}
                                        onChange={(e) => handleSettingChange('appLogoUrl', e.target.value, 'STRING')}
                                        placeholder="Enter logo URL"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm backdrop-blur-sm"
                                      />
                                      <label className="block cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const handleFileUpload = async (file: File) => {
                                                if (!file) {
                                                  console.log('No file provided');
                                                  return;
                                                }
                                                
                                                console.log('Starting file upload for:', file.name, 'Size:', file.size, 'Type:', file.type);
                                                
                                                // Validate file type
                                                if (!file.type.startsWith('image/')) {
                                                  console.error('Invalid file type:', file.type);
                                                  alert('Please select an image file');
                                                  return;
                                                }
                                                
                                                // Validate file size (max 5MB)
                                                if (file.size > 5 * 1024 * 1024) {
                                                  console.error('File too large:', file.size);
                                                  alert('File size must be less than 5MB');
                                                  return;
                                                }
                                                
                                                try {
                                                  const formData = new FormData();
                                                  formData.append('file', file);
                                                  formData.append('type', 'logo');
                                                  
                                                  console.log('Uploading to /api/upload/image...');
                                                  
                                                  const response = await fetch('/api/upload/image', {
                                                    method: 'POST',
                                                    body: formData,
                                                  });
                                                  
                                                  console.log('Upload response status:', response.status);
                                                  
                                                  if (!response.ok) {
                                                    const errorText = await response.text();
                                                    console.error('Upload failed with status:', response.status, 'Error:', errorText);
                                                    throw new Error(`Upload failed: ${response.status}`);
                                                  }
                                                  
                                                  const data = await response.json();
                                                  console.log('Upload successful:', data);
                                                  
                                                  // Update the setting with the new URL
                                                  handleSettingChange('appLogoUrl', data.url, 'STRING');
                                                  console.log('Setting updated with URL:', data.url);
                                                  
                                                  alert(`Logo upload successful! URL: ${data.url}`);
                                                } catch (error) {
                                                  console.error('Upload error:', error);
                                                  alert('Failed to upload logo. Please try again. Check console for details.');
                                                }
                                              };
                                              handleFileUpload(file);
                                            }
                                          }}
                                          className="hidden"
                                        />
                                        <div className="flex items-center justify-center px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg transition-colors">
                                          <Upload size={16} className="mr-2 text-pink-400" />
                                          <span className="text-sm text-pink-300">Upload New Logo</span>
                                        </div>
                                      </label>
                                      <button
                                        onClick={() => handleSettingChange('appLogoUrl', '', 'STRING')}
                                        className="text-sm text-red-400 hover:text-red-300"
                                      >
                                        Remove Logo
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <Upload size={32} className="mx-auto text-white/50" />
                                    <div>
                                      <p className="text-sm text-white/70 mb-2">Upload your restaurant logo</p>
                                      <input
                                        type="url"
                                        value={editingSettings['appLogoUrl'] || ''}
                                        onChange={(e) => handleSettingChange('appLogoUrl', e.target.value, 'STRING')}
                                        placeholder="Enter logo URL"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm backdrop-blur-sm mb-2"
                                      />
                                      <label className="block cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const handleFileUpload = async (file: File) => {
                                                if (!file) {
                                                  console.log('No file provided');
                                                  return;
                                                }
                                                
                                                console.log('Starting file upload for:', file.name, 'Size:', file.size, 'Type:', file.type);
                                                
                                                // Validate file type
                                                if (!file.type.startsWith('image/')) {
                                                  console.error('Invalid file type:', file.type);
                                                  alert('Please select an image file');
                                                  return;
                                                }
                                                
                                                // Validate file size (max 5MB)
                                                if (file.size > 5 * 1024 * 1024) {
                                                  console.error('File too large:', file.size);
                                                  alert('File size must be less than 5MB');
                                                  return;
                                                }
                                                
                                                try {
                                                  const formData = new FormData();
                                                  formData.append('file', file);
                                                  formData.append('type', 'logo');
                                                  
                                                  console.log('Uploading to /api/upload/image...');
                                                  
                                                  const response = await fetch('/api/upload/image', {
                                                    method: 'POST',
                                                    body: formData,
                                                  });
                                                  
                                                  console.log('Upload response status:', response.status);
                                                  
                                                  if (!response.ok) {
                                                    const errorText = await response.text();
                                                    console.error('Upload failed with status:', response.status, 'Error:', errorText);
                                                    throw new Error(`Upload failed: ${response.status}`);
                                                  }
                                                  
                                                  const data = await response.json();
                                                  console.log('Upload successful:', data);
                                                  
                                                  // Update the setting with the new URL
                                                  handleSettingChange('appLogoUrl', data.url, 'STRING');
                                                  console.log('Setting updated with URL:', data.url);
                                                  
                                                  alert(`Logo upload successful! URL: ${data.url}`);
                                                } catch (error) {
                                                  console.error('Upload error:', error);
                                                  alert('Failed to upload logo. Please try again. Check console for details.');
                                                }
                                              };
                                              handleFileUpload(file);
                                            }
                                          }}
                                          className="hidden"
                                        />
                                        <div className="flex items-center justify-center px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg transition-colors">
                                          <Upload size={16} className="mr-2 text-pink-400" />
                                          <span className="text-sm text-pink-300">Choose Logo File</span>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Favicon Upload */}
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-white/90">Favicon</label>
                              <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-pink-400 transition-colors backdrop-blur-sm">
                                {faviconSetting?.value ? (
                                  <div className="space-y-3">
                                    <img 
                                      src={faviconSetting.value} 
                                      alt="Current Favicon" 
                                      className="w-8 h-8 mx-auto rounded"
                                      onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                    <div className="space-y-2">
                                      <input
                                        type="url"
                                        value={editingSettings['appFaviconUrl'] || faviconSetting.value}
                                        onChange={(e) => handleSettingChange('appFaviconUrl', e.target.value, 'STRING')}
                                        placeholder="Enter favicon URL"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm backdrop-blur-sm"
                                      />
                                      <label className="block cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const handleFileUpload = async (file: File) => {
                                                if (!file) {
                                                  console.log('No file provided');
                                                  return;
                                                }
                                                
                                                console.log('Starting file upload for:', file.name, 'Size:', file.size, 'Type:', file.type);
                                                
                                                // Validate file type
                                                if (!file.type.startsWith('image/')) {
                                                  console.error('Invalid file type:', file.type);
                                                  alert('Please select an image file');
                                                  return;
                                                }
                                                
                                                // Validate file size (max 5MB)
                                                if (file.size > 5 * 1024 * 1024) {
                                                  console.error('File too large:', file.size);
                                                  alert('File size must be less than 5MB');
                                                  return;
                                                }
                                                
                                                try {
                                                  const formData = new FormData();
                                                  formData.append('file', file);
                                                  formData.append('type', 'favicon');
                                                  
                                                  console.log('Uploading to /api/upload/image...');
                                                  
                                                  const response = await fetch('/api/upload/image', {
                                                    method: 'POST',
                                                    body: formData,
                                                  });
                                                  
                                                  console.log('Upload response status:', response.status);
                                                  
                                                  if (!response.ok) {
                                                    const errorText = await response.text();
                                                    console.error('Upload failed with status:', response.status, 'Error:', errorText);
                                                    throw new Error(`Upload failed: ${response.status}`);
                                                  }
                                                  
                                                  const data = await response.json();
                                                  console.log('Upload successful:', data);
                                                  
                                                  // Update the setting with the new URL
                                                  handleSettingChange('appFaviconUrl', data.url, 'STRING');
                                                  console.log('Setting updated with URL:', data.url);
                                                  
                                                  alert(`Favicon upload successful! URL: ${data.url}`);
                                                } catch (error) {
                                                  console.error('Upload error:', error);
                                                  alert('Failed to upload favicon. Please try again. Check console for details.');
                                                }
                                              };
                                              handleFileUpload(file);
                                            }
                                          }}
                                          className="hidden"
                                        />
                                        <div className="flex items-center justify-center px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg transition-colors">
                                          <Upload size={16} className="mr-2 text-pink-400" />
                                          <span className="text-sm text-pink-300">Upload New Favicon</span>
                                        </div>
                                      </label>
                                      <button
                                        onClick={() => handleSettingChange('appFaviconUrl', '', 'STRING')}
                                        className="text-sm text-red-400 hover:text-red-300"
                                      >
                                        Remove Favicon
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="w-8 h-8 mx-auto bg-white/20 rounded flex items-center justify-center">
                                      <Image size={16} className="text-white/50" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-white/70 mb-2">Upload favicon (16x16px recommended)</p>
                                      <input
                                        type="url"
                                        value={editingSettings['appFaviconUrl'] || ''}
                                        onChange={(e) => handleSettingChange('appFaviconUrl', e.target.value, 'STRING')}
                                        placeholder="Enter favicon URL"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm backdrop-blur-sm mb-2"
                                      />
                                      <label className="block cursor-pointer">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const handleFileUpload = async (file: File) => {
                                                if (!file) {
                                                  console.log('No file provided');
                                                  return;
                                                }
                                                
                                                console.log('Starting file upload for:', file.name, 'Size:', file.size, 'Type:', file.type);
                                                
                                                // Validate file type
                                                if (!file.type.startsWith('image/')) {
                                                  console.error('Invalid file type:', file.type);
                                                  alert('Please select an image file');
                                                  return;
                                                }
                                                
                                                // Validate file size (max 5MB)
                                                if (file.size > 5 * 1024 * 1024) {
                                                  console.error('File too large:', file.size);
                                                  alert('File size must be less than 5MB');
                                                  return;
                                                }
                                                
                                                try {
                                                  const formData = new FormData();
                                                  formData.append('file', file);
                                                  formData.append('type', 'favicon');
                                                  
                                                  console.log('Uploading to /api/upload/image...');
                                                  
                                                  const response = await fetch('/api/upload/image', {
                                                    method: 'POST',
                                                    body: formData,
                                                  });
                                                  
                                                  console.log('Upload response status:', response.status);
                                                  
                                                  if (!response.ok) {
                                                    const errorText = await response.text();
                                                    console.error('Upload failed with status:', response.status, 'Error:', errorText);
                                                    throw new Error(`Upload failed: ${response.status}`);
                                                  }
                                                  
                                                  const data = await response.json();
                                                  console.log('Upload successful:', data);
                                                  
                                                  // Update the setting with the new URL
                                                  handleSettingChange('appFaviconUrl', data.url, 'STRING');
                                                  console.log('Setting updated with URL:', data.url);
                                                  
                                                  alert(`Favicon upload successful! URL: ${data.url}`);
                                                } catch (error) {
                                                  console.error('Upload error:', error);
                                                  alert('Failed to upload favicon. Please try again. Check console for details.');
                                                }
                                              };
                                              handleFileUpload(file);
                                            }
                                          }}
                                          className="hidden"
                                        />
                                        <div className="flex items-center justify-center px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg transition-colors">
                                          <Upload size={16} className="mr-2 text-pink-400" />
                                          <span className="text-sm text-pink-300">Choose Favicon File</span>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Brand Color Palette Section */}
                    {(() => {
                      const brandColorsSetting = section.settings.find(s => s.key === 'brand_colors');
                      let brandColors = {
                        primary: '#FF6B35',
                        secondary: '#2E8B57',
                        accent: '#FFD700',
                        background: '#FFFFFF',
                        text: '#333333',
                        success: '#10B981',
                        warning: '#F59E0B',
                        error: '#EF4444'
                      };

                      try {
                        if (brandColorsSetting?.value) {
                          brandColors = { ...brandColors, ...JSON.parse(brandColorsSetting.value) };
                        }
                        if (editingSettings['brand_colors']) {
                          brandColors = { ...brandColors, ...JSON.parse(editingSettings['brand_colors']) };
                        }
                      } catch (e) {
                        console.warn('Invalid brand_colors JSON:', e);
                      }

                      const updateBrandColor = (colorKey: string, colorValue: string) => {
                        const newColors = { ...brandColors, [colorKey]: colorValue };
                        handleSettingChange('brand_colors', JSON.stringify(newColors), 'JSON');
                      };

                      const colorPresets = [
                        { name: 'Warm & Inviting', colors: { primary: '#FF6B35', secondary: '#2E8B57', accent: '#FFD700' } },
                        { name: 'Modern Blue', colors: { primary: '#2563EB', secondary: '#7C3AED', accent: '#06B6D4' } },
                        { name: 'Fresh Green', colors: { primary: '#059669', secondary: '#0D9488', accent: '#84CC16' } },
                        { name: 'Classic Red', colors: { primary: '#DC2626', secondary: '#7C2D12', accent: '#F59E0B' } },
                        { name: 'Purple Elegance', colors: { primary: '#7C3AED', secondary: '#C2410C', accent: '#EC4899' } }
                      ];

                      return (
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
                          <div className="flex items-center justify-between text-purple-300 mb-4">
                            <div className="flex items-center">
                              <Palette size={20} className="mr-2" />
                              <h3 className="text-lg font-semibold">Brand Color Palette</h3>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(brandColors, null, 2));
                                // Could add a toast notification here
                              }}
                              className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm"
                            >
                              <Copy size={14} className="mr-1" />
                              Copy JSON
                            </button>
                          </div>

                          {/* Color Presets */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Color Schemes</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                              {colorPresets.map((preset) => (
                                <button
                                  key={preset.name}
                                  onClick={() => {
                                    Object.entries(preset.colors).forEach(([key, value]) => {
                                      updateBrandColor(key, value);
                                    });
                                  }}
                                  className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                                >
                                  <div className="flex space-x-1 mb-2">
                                    {Object.values(preset.colors).map((color, idx) => (
                                      <div
                                        key={idx}
                                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-600 text-center">{preset.name}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Individual Color Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(brandColors).map(([colorKey, colorValue]) => (
                              <div key={colorKey} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                  {colorKey} Color
                                </label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={colorValue}
                                    onChange={(e) => updateBrandColor(colorKey, e.target.value)}
                                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={colorValue}
                                    onChange={(e) => updateBrandColor(colorKey, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                  />
                                </div>
                                <div 
                                  className="h-8 rounded border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: colorValue }}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Color Preview */}
                          <div className="mt-6 p-4 border border-gray-200 rounded-lg" style={{ backgroundColor: brandColors.background }}>
                            <h4 className="text-sm font-medium mb-3" style={{ color: brandColors.text }}>Brand Preview</h4>
                            <div className="space-y-2">
                              <button 
                                className="px-4 py-2 rounded-lg text-white font-medium mr-2"
                                style={{ backgroundColor: brandColors.primary }}
                              >
                                Primary Button
                              </button>
                              <button 
                                className="px-4 py-2 rounded-lg text-white font-medium mr-2"
                                style={{ backgroundColor: brandColors.secondary }}
                              >
                                Secondary Button
                              </button>
                              <button 
                                className="px-4 py-2 rounded-lg text-white font-medium"
                                style={{ backgroundColor: brandColors.accent }}
                              >
                                Accent Button
                              </button>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <span 
                                className="px-2 py-1 rounded text-xs text-white"
                                style={{ backgroundColor: brandColors.success }}
                              >
                                Success
                              </span>
                              <span 
                                className="px-2 py-1 rounded text-xs text-white"
                                style={{ backgroundColor: brandColors.warning }}
                              >
                                Warning
                              </span>
                              <span 
                                className="px-2 py-1 rounded text-xs text-white"
                                style={{ backgroundColor: brandColors.error }}
                              >
                                Error
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Other Branding Settings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {section.settings.filter(s => !['logoUrl', 'faviconUrl', 'brand_colors'].includes(s.key)).map((setting) => {
                        const settingInfo = getSettingInfo(setting.key);
                        
                        const currentValue = editingSettings[setting.key] !== undefined 
                          ? editingSettings[setting.key] 
                          : setting.value;
                        const hasChanged = editingSettings[setting.key] !== undefined && editingSettings[setting.key] !== setting.value;

                        return (
                          <div key={setting.key} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <label className="text-sm font-medium text-white">{settingInfo.label}</label>
                                {settingInfo.description && (
                                  <p className="text-xs text-white/70 mt-1">{settingInfo.description}</p>
                                )}
                              </div>
                              {hasChanged && (
                                <span className="text-orange-400 font-medium flex items-center text-sm">
                                  <Edit3 size={12} className="mr-1" />
                                  Modified
                                </span>
                              )}
                            </div>

                            {setting.type === 'BOOLEAN' ? (
                              <button
                                onClick={() => handleSettingChange(setting.key, !currentValue, 'BOOLEAN')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  currentValue ? 'bg-green-500' : 'bg-white/20'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    currentValue ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            ) : setting.key.toLowerCase().includes('color') ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={currentValue || '#000000'}
                                  onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
                                  className="w-12 h-10 bg-white/10 border border-white/20 rounded-lg cursor-pointer backdrop-blur-sm"
                                />
                                <input
                                  type="text"
                                  value={currentValue || ''}
                                  onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
                                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm backdrop-blur-sm"
                                  placeholder="#000000"
                                />
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={currentValue || ''}
                                onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-sm"
                                placeholder={`Enter ${settingInfo.label.toLowerCase()}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : section.id === 'technical' ? (
                  // Special layout for technical/system settings with warnings
                  <div className="space-y-6">
                    {/* Warning Banner */}
                    <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-red-300 mb-2">⚠️ Advanced Technical Settings</h3>
                          <div className="text-red-200 text-sm space-y-1">
                            <p>• These settings control system performance and security features</p>
                            <p>• Improper configuration may affect site stability or security</p>
                            <p>• Only modify if you understand rate limiting and system architecture</p>
                            <p>• Changes take effect within 1-2 minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Settings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {section.settings.map((setting) => {
                        const settingInfo = getSettingInfo(setting.key);
                        const isSeconds = setting.key.includes('Seconds') || setting.key.includes('Interval');
                        const currentValue = editingSettings[setting.key] !== undefined ? editingSettings[setting.key] : setting.value;
                        
                        // Convert value for display (show seconds instead of milliseconds)
                        const displayValue = isSeconds ? currentValue : currentValue;
                        
                        return (
                          <div key={setting.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-600/30 hover:border-orange-400/50 transition-all">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-white text-lg">{settingInfo.label}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-600/30 text-gray-300 border border-gray-500/30">
                                    {setting.type}
                                  </span>
                                  {isSeconds && (
                                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-600/30 text-blue-300 border border-blue-500/30">
                                      SECONDS
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm mb-3">{settingInfo.description}</p>
                            </div>
                            
                            {setting.type === 'BOOLEAN' ? (
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={currentValue === 'true'}
                                  onChange={(e) => handleSettingChange(setting.key, e.target.checked.toString(), setting.type)}
                                  className="w-5 h-5 text-orange-500 bg-gray-800/50 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                                />
                                <span className="text-white">{currentValue === 'true' ? 'Enabled' : 'Disabled'}</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  value={displayValue || ''}
                                  onChange={(e) => handleSettingChange(setting.key, e.target.value, setting.type)}
                                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                                  placeholder={`Enter ${settingInfo.label.toLowerCase()}`}
                                />
                                {isSeconds && (
                                  <div className="text-xs text-gray-400">
                                    <p>• Current: {displayValue} seconds ({Math.round(parseInt(displayValue || '0') / 60)} minutes)</p>
                                    {setting.key.includes('rateLimitWindow') && (
                                      <p>• Rate limit window duration</p>
                                    )}
                                    {setting.key.includes('kitchenPolling') && (
                                      <p>• Kitchen display refresh rate</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Regular grid layout for other sections
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {section.settings.map((setting) => {
                      const settingInfo = getSettingInfo(setting.key);
                      
                      return (
                        <div key={setting.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:border-orange-400/50 transition-all hover:bg-white/10">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white text-lg">{settingInfo.label}</h4>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                setting.type === 'BOOLEAN' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                setting.type === 'NUMBER' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                setting.type === 'JSON' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                              }`}>
                                {setting.type}
                              </span>
                            </div>
                            <p className="text-sm text-white/70 mb-3">{settingInfo.description}</p>
                            <div className="text-xs text-white/50 mb-3">
                              Key: <code className="bg-white/10 px-1 rounded text-white/80">{setting.key}</code>
                            </div>
                          </div>
                          
                          {renderSettingInput(setting)}
                          
                          <div className="mt-3 text-xs text-white/50 flex items-center justify-between">
                            <span>Last updated: {new Date(setting.updatedAt).toLocaleDateString()}</span>
                            {editingSettings[setting.key] !== setting.value && (
                              <span className="text-orange-400 font-medium flex items-center">
                                <Edit3 size={12} className="mr-1" />
                                Modified
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <Edit3 size={18} className="mr-2" />
            Unsaved changes
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  );
}
