const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedBrandingSettings() {
  console.log('🎨 Seeding branding and app settings...');

  const brandingSettings = [
    // Core Branding
    { key: 'app_name', value: 'Pizza Builder Pro', type: 'STRING', description: 'Main application name' },
    { key: 'app_tagline', value: 'Build your perfect pizza with our interactive pizza builder', type: 'STRING', description: 'App tagline/description' },
    { key: 'business_name', value: 'Pizza Builder Pro', type: 'STRING', description: 'Business name (can be different from app name)' },
    { key: 'business_slogan', value: 'Crafted to Perfection, Delivered with Love', type: 'STRING', description: 'Business slogan/motto' },
    
    // Contact Information
    { key: 'business_phone', value: '(555) 123-PIZZA', type: 'STRING', description: 'Business phone number' },
    { key: 'business_email', value: 'orders@pizzabuilderpro.com', type: 'STRING', description: 'Business email' },
    { key: 'business_address', value: '123 Pizza Street, Flavor Town, FT 12345', type: 'STRING', description: 'Business address' },
    { key: 'business_website', value: 'https://pizzabuilderpro.com', type: 'STRING', description: 'Business website URL' },
    
    // SEO and Meta
    { key: 'meta_title', value: 'Pizza Builder Pro - Custom Pizza Builder', type: 'STRING', description: 'SEO meta title' },
    { key: 'meta_description', value: 'Build your perfect pizza with our interactive pizza builder. Choose from fresh ingredients and watch your creation come to life!', type: 'STRING', description: 'SEO meta description' },
    { key: 'meta_keywords', value: 'pizza, custom pizza, pizza builder, online ordering, fresh ingredients', type: 'STRING', description: 'SEO keywords' },
    
    // Social Media
    { key: 'facebook_url', value: '', type: 'STRING', description: 'Facebook page URL' },
    { key: 'instagram_url', value: '', type: 'STRING', description: 'Instagram profile URL' },
    { key: 'twitter_url', value: '', type: 'STRING', description: 'Twitter profile URL' },
    { key: 'youtube_url', value: '', type: 'STRING', description: 'YouTube channel URL' },
    
    // Branding Colors (stored as JSON)
    { key: 'brand_colors', value: JSON.stringify({
      primary: '#FF6B35',
      secondary: '#2E8B57', 
      accent: '#FFD700',
      background: '#FFFFFF',
      text: '#333333',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    }), type: 'JSON', description: 'Brand color palette' },
    
    // App Features
    { key: 'enable_pizza_builder', value: 'true', type: 'BOOLEAN', description: 'Enable interactive pizza builder' },
    { key: 'enable_menu_ordering', value: 'true', type: 'BOOLEAN', description: 'Enable regular menu ordering' },
    { key: 'enable_user_accounts', value: 'true', type: 'BOOLEAN', description: 'Enable user registration and accounts' },
    { key: 'enable_guest_checkout', value: 'true', type: 'BOOLEAN', description: 'Allow guest checkout without account' },
    
    // Operational Settings
    { key: 'tax_rate', value: '8.25', type: 'NUMBER', description: 'Tax rate percentage' },
    { key: 'delivery_fee', value: '3.99', type: 'NUMBER', description: 'Standard delivery fee' },
    { key: 'minimum_order', value: '15.00', type: 'NUMBER', description: 'Minimum order amount' },
    { key: 'preparation_time', value: '25', type: 'NUMBER', description: 'Average preparation time in minutes' },
    
    // Operating Hours (JSON format for flexibility)
    { key: 'operating_hours', value: JSON.stringify({
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '12:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    }), type: 'JSON', description: 'Restaurant operating hours' },
    
    // Welcome Messages
    { key: 'welcome_message', value: 'Welcome to Pizza Builder Pro!', type: 'STRING', description: 'Homepage welcome message' },
    { key: 'welcome_subtitle', value: 'Create your perfect pizza or explore our delicious menu', type: 'STRING', description: 'Homepage welcome subtitle' },
    
    // Footer Content
    { key: 'footer_text', value: '© 2025 Pizza Builder Pro. All rights reserved.', type: 'STRING', description: 'Footer copyright text' },
    { key: 'footer_description', value: 'Experience the art of pizza making with our interactive builder and fresh, quality ingredients.', type: 'STRING', description: 'Footer description' },
    
    // Terms and Policies
    { key: 'terms_url', value: '/terms', type: 'STRING', description: 'Terms of service URL' },
    { key: 'privacy_url', value: '/privacy', type: 'STRING', description: 'Privacy policy URL' },
    { key: 'refund_policy_url', value: '/refund-policy', type: 'STRING', description: 'Refund policy URL' },
  ];

  console.log(`📝 Adding ${brandingSettings.length} branding settings...`);

  for (const setting of brandingSettings) {
    try {
      await prisma.appSetting.upsert({
        where: { key: setting.key },
        update: { 
          value: setting.value,
          type: setting.type,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
        }
      });
      console.log(`✅ ${setting.key}: ${setting.value}`);
    } catch (error) {
      console.error(`❌ Failed to add ${setting.key}:`, error.message);
    }
  }

  console.log('🎨 Branding settings seeded successfully!');
}

async function main() {
  try {
    await seedBrandingSettings();
  } catch (error) {
    console.error('❌ Error seeding branding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
