// Custom hook for accessing app settings
import { useState, useEffect } from 'react';

interface AppSettings {
  // Core Branding
  app_name: string;
  app_tagline: string;
  business_name: string;
  business_slogan: string;
  
  // Contact
  business_phone: string;
  business_email: string;
  business_address: string;
  business_website: string;
  
  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  
  // Social Media
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  
  // Brand Colors
  brand_colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  
  // Features
  enable_pizza_builder: boolean;
  enable_menu_ordering: boolean;
  enable_user_accounts: boolean;
  enable_guest_checkout: boolean;
  deliveryEnabled: boolean;
  
  // Operations
  tax_rate: number;
  delivery_fee: number;
  minimum_order: number;
  preparation_time: number;
  
  // Hours
  operating_hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  
  // Messages
  welcome_message: string;
  welcome_subtitle: string;
  footer_text: string;
  footer_description: string;
  
  // Legal
  terms_url: string;
  privacy_url: string;
  refund_policy_url: string;
  
  // Logo
  appLogoUrl: string;
}

// SSR-safe initial settings - matches expected content to prevent hydration issues
const ssrSafeSettings: AppSettings = {
  app_name: 'Greenland Famous Pizza',
  app_tagline: 'Build your perfect pizza',
  business_name: 'Restaurant',
  business_slogan: 'Crafted to Perfection',
  business_phone: '(555) 123-PIZZA',
  business_email: 'orders@pizzarestaurant.com',
  business_address: '123 Pizza Street',
  business_website: 'https://pizzarestaurant.com',
  meta_title: 'Greenland Famous Pizza',
  meta_description: 'Build your perfect pizza',
  meta_keywords: 'pizza, custom pizza, pizza builder',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  brand_colors: {
    primary: '#FF6B35',
    secondary: '#2E8B57',
    accent: '#FFD700',
    background: '#FFFFFF',
    text: '#333333',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  enable_pizza_builder: true,
  enable_menu_ordering: true,
  enable_user_accounts: true,
  enable_guest_checkout: true,
  deliveryEnabled: true,
  tax_rate: 8.25,
  delivery_fee: 3.99,
  minimum_order: 15.00,
  preparation_time: 25,
  operating_hours: {
    monday: { open: '11:00', close: '22:00', closed: false },
    tuesday: { open: '11:00', close: '22:00', closed: false },
    wednesday: { open: '11:00', close: '22:00', closed: false },
    thursday: { open: '11:00', close: '22:00', closed: false },
    friday: { open: '11:00', close: '23:00', closed: false },
    saturday: { open: '12:00', close: '23:00', closed: false },
    sunday: { open: '12:00', close: '21:00', closed: false }
  },
  welcome_message: 'Welcome to Greenland Famous Pizza!',
  welcome_subtitle: 'Create your perfect pizza',
  footer_text: '© 2025 Greenland Famous Pizza. All rights reserved.',
  footer_description: 'Experience the art of pizza making.',
  terms_url: '/terms',
  privacy_url: '/privacy',
  refund_policy_url: '/refund-policy',
  appLogoUrl: ''
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(ssrSafeSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      
      // Use fetched settings directly - they should be complete from database
      if (data.settings && Object.keys(data.settings).length > 0) {
        setSettings(data.settings);
      } else {
        console.warn('No settings returned from API, using SSR-safe fallback');
        setSettings(ssrSafeSettings);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching app settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      // Keep using SSR-safe settings on error to prevent hydration issues
      setSettings(ssrSafeSettings);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    fetchSettings();
  };

  return {
    settings,
    loading,
    error,
    refreshSettings
  };
}

// Helper hook for just getting the app name
export function useAppName() {
  const { settings } = useAppSettings();
  return settings.app_name;
}

// Helper hook for getting brand colors
export function useBrandColors() {
  const { settings } = useAppSettings();
  return settings.brand_colors;
}

// Helper hook for business info
export function useBusinessInfo() {
  const { settings } = useAppSettings();
  return {
    name: settings.business_name,
    slogan: settings.business_slogan,
    phone: settings.business_phone,
    email: settings.business_email,
    address: settings.business_address,
    website: settings.business_website
  };
}
