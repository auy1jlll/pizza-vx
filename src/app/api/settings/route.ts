import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Default settings to use when database is empty
const defaultSettings = {
  app_name: 'Restaurant',
  app_tagline: 'Welcome to our restaurant',
  business_name: 'Restaurant',
  business_slogan: 'Great food, great service',
  business_phone: '(555) 000-0000',
  business_email: 'contact@restaurant.com',
  business_address: '123 Main Street',
  business_website: 'https://restaurant.com',
  meta_title: 'Restaurant',
  meta_description: 'Welcome to our restaurant',
  meta_keywords: 'restaurant, food, dining',
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
  welcome_message: 'Welcome to our restaurant!',
  welcome_subtitle: 'Enjoy our delicious food',
  footer_text: '© 2025 Restaurant. All rights reserved.',
  footer_description: 'Experience the art of pizza making.',
  terms_url: '/terms',
  privacy_url: '/privacy',
  refund_policy_url: '/refund-policy'
};

// Get settings (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });

    // If no settings in database, return defaults
    if (!settings || settings.length === 0) {
      return NextResponse.json({ settings: defaultSettings });
    }

    // Convert database settings to object format
    const settingsObject: Record<string, any> = settings.reduce((acc: Record<string, any>, setting) => {
      let value: any = setting.value;

      // Parse values based on type
      switch (setting.type) {
        case 'NUMBER':
          value = parseFloat(setting.value);
          break;
        case 'BOOLEAN':
          value = setting.value === 'true';
          break;
        case 'JSON':
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
          break;
        default:
          value = setting.value;
      }

      // Map database keys to frontend expected keys
      let mappedKey = setting.key;
      switch (setting.key) {
        case 'businessName':
          mappedKey = 'business_name';
          break;
        case 'businessSlogan':
          mappedKey = 'business_slogan';
          break;
        case 'businessPhone':
          mappedKey = 'business_phone';
          break;
        case 'businessEmail':
          mappedKey = 'business_email';
          break;
        case 'businessAddress':
          mappedKey = 'business_address';
          break;
        case 'businessWebsite':
          mappedKey = 'business_website';
          break;
        case 'metaTitle':
          mappedKey = 'meta_title';
          break;
        case 'metaDescription':
          mappedKey = 'meta_description';
          break;
        case 'metaKeywords':
          mappedKey = 'meta_keywords';
          break;
        case 'facebookUrl':
          mappedKey = 'facebook_url';
          break;
        case 'instagramUrl':
          mappedKey = 'instagram_url';
          break;
        case 'twitterUrl':
          mappedKey = 'twitter_url';
          break;
        case 'youtubeUrl':
          mappedKey = 'youtube_url';
          break;
        case 'brandColors':
          mappedKey = 'brand_colors';
          break;
        case 'enablePizzaBuilder':
          mappedKey = 'enable_pizza_builder';
          break;
        case 'enableMenuOrdering':
          mappedKey = 'enable_menu_ordering';
          break;
        case 'enableUserAccounts':
          mappedKey = 'enable_user_accounts';
          break;
        case 'enableGuestCheckout':
          mappedKey = 'enable_guest_checkout';
          break;
        case 'taxRate':
          mappedKey = 'tax_rate';
          break;
        case 'deliveryFee':
          mappedKey = 'delivery_fee';
          break;
        case 'minimumOrder':
          mappedKey = 'minimum_order';
          break;
        case 'preparationTime':
          mappedKey = 'preparation_time';
          break;
        case 'operatingHours':
          mappedKey = 'operating_hours';
          break;
        case 'welcomeMessage':
          mappedKey = 'welcome_message';
          break;
        case 'welcomeSubtitle':
          mappedKey = 'welcome_subtitle';
          break;
        case 'footerText':
          mappedKey = 'footer_text';
          break;
        case 'footerDescription':
          mappedKey = 'footer_description';
          break;
        case 'termsUrl':
          mappedKey = 'terms_url';
          break;
        case 'privacyUrl':
          mappedKey = 'privacy_url';
          break;
        case 'refundPolicyUrl':
          mappedKey = 'refund_policy_url';
          break;
      }

      acc[mappedKey] = value;
      return acc;
    }, {});

    // Merge with defaults to ensure all required fields are present
    const mergedSettings = { ...defaultSettings, ...settingsObject };

    return NextResponse.json({ settings: mergedSettings });

  } catch (error) {
    console.error('Error fetching settings:', error);

    // Return defaults on error
    return NextResponse.json({ settings: defaultSettings });
  }
}
