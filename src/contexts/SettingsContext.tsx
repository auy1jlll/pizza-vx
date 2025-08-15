'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GlobalSettings {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  taxRate: number;
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: number;
  // Tip settings
  tipPercentages: number[];
  allowCustomTip: boolean;
  defaultTipPercentage: number;
  // Payment options
  allowPayAtPickup: boolean;
  allowPayLater: boolean;
  payLaterMinimumOrder: number;
  // Business hours
  mondayOpen: string;
  mondayClose: string;
  mondayClosed: boolean;
  tuesdayOpen: string;
  tuesdayClose: string;
  tuesdayClosed: boolean;
  wednesdayOpen: string;
  wednesdayClose: string;
  wednesdayClosed: boolean;
  thursdayOpen: string;
  thursdayClose: string;
  thursdayClosed: boolean;
  fridayOpen: string;
  fridayClose: string;
  fridayClosed: boolean;
  saturdayOpen: string;
  saturdayClose: string;
  saturdayClosed: boolean;
  sundayOpen: string;
  sundayClose: string;
  sundayClosed: boolean;
  // Notifications
  orderNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface SettingsContextType {
  settings: GlobalSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  getTaxAmount: (subtotal: number) => number;
  getTotalWithTax: (subtotal: number) => number;
  isOpenToday: () => boolean;
  getTodayHours: () => { open: string; close: string; closed: boolean };
}

const defaultSettings: GlobalSettings = {
  businessName: 'Pizza Builder',
  businessPhone: '',
  businessEmail: '',
  businessAddress: '',
  taxRate: 8.25,
  deliveryFee: 3.99,
  minimumOrder: 15.00,
  preparationTime: 25,
  // Tip settings
  tipPercentages: [15, 18, 20, 25],
  allowCustomTip: true,
  defaultTipPercentage: 18,
  // Payment options
  allowPayAtPickup: true,
  allowPayLater: true,
  payLaterMinimumOrder: 25.00,
  mondayOpen: '11:00',
  mondayClose: '22:00',
  mondayClosed: false,
  tuesdayOpen: '11:00',
  tuesdayClose: '22:00',
  tuesdayClosed: false,
  wednesdayOpen: '11:00',
  wednesdayClose: '22:00',
  wednesdayClosed: false,
  thursdayOpen: '11:00',
  thursdayClose: '22:00',
  thursdayClosed: false,
  fridayOpen: '11:00',
  fridayClose: '23:00',
  fridayClosed: false,
  saturdayOpen: '11:00',
  saturdayClose: '23:00',
  saturdayClosed: false,
  sundayOpen: '12:00',
  sundayClose: '21:00',
  sundayClosed: false,
  orderNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error loading global settings:', error);
      // Use default settings on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refreshSettings = async () => {
    await loadSettings();
  };

  const getTaxAmount = (subtotal: number): number => {
    return +(subtotal * (settings.taxRate / 100)).toFixed(2);
  };

  const getTotalWithTax = (subtotal: number): number => {
    return +(subtotal + getTaxAmount(subtotal)).toFixed(2);
  };

  const isOpenToday = (): boolean => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayKeys[today];
    const closedKey = `${dayKey}Closed` as keyof GlobalSettings;
    
    return !settings[closedKey];
  };

  const getTodayHours = (): { open: string; close: string; closed: boolean } => {
    const today = new Date().getDay();
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayKeys[today];
    
    const openKey = `${dayKey}Open` as keyof GlobalSettings;
    const closeKey = `${dayKey}Close` as keyof GlobalSettings;
    const closedKey = `${dayKey}Closed` as keyof GlobalSettings;
    
    return {
      open: settings[openKey] as string,
      close: settings[closeKey] as string,
      closed: settings[closedKey] as boolean,
    };
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        getTaxAmount,
        getTotalWithTax,
        isOpenToday,
        getTodayHours,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
