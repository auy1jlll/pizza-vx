'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';

interface AppSettings {
  app_name: string;
  app_tagline: string;
  business_name: string;
  business_slogan: string;
  business_phone: string;
  business_email: string;
  business_address: string;
  business_website: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
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
  enable_pizza_builder: boolean;
  enable_menu_ordering: boolean;
  enable_user_accounts: boolean;
  enable_guest_checkout: boolean;
  deliveryEnabled: boolean;
  tax_rate: number;
  delivery_fee: number;
  minimum_order: number;
  preparation_time: number;
  operating_hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  welcome_message: string;
  welcome_subtitle: string;
  footer_text: string;
  footer_description: string;
  terms_url: string;
  privacy_url: string;
  refund_policy_url: string;
  appLogoUrl: string;
}

interface AppSettingsContextType {
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const settingsData = useAppSettings();

  return (
    <AppSettingsContext.Provider value={settingsData}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettingsContext() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettingsContext must be used within an AppSettingsProvider');
  }
  return context;
}
