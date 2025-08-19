const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function populateAllSettings() {
  console.log('🔧 Populating ALL settings into database...');

  const settings = [
    // === CORE BRANDING ===
    { key: 'app_name', value: 'Omar Pizza', type: 'STRING' },
    { key: 'app_tagline', value: 'Build your perfect pizza', type: 'STRING' },
    { key: 'business_name', value: 'Omar Pizza', type: 'STRING' },
    { key: 'business_slogan', value: 'Crafted to Perfection', type: 'STRING' },

    // === CONTACT INFORMATION ===
    { key: 'business_phone', value: '(555) 123-PIZZA', type: 'STRING' },
    { key: 'business_email', value: 'orders@omarpizza.com', type: 'STRING' },
    { key: 'business_address', value: '123 Pizza Street', type: 'STRING' },
    { key: 'business_website', value: 'https://omarpizza.com', type: 'STRING' },

    // === SEO ===
    { key: 'meta_title', value: 'Omar Pizza - Build Your Perfect Pizza', type: 'STRING' },
    { key: 'meta_description', value: 'Create your perfect custom pizza with fresh ingredients and fast delivery. Omar Pizza - where every slice is crafted to perfection.', type: 'STRING' },
    { key: 'meta_keywords', value: 'pizza, custom pizza, pizza builder, Omar Pizza, delivery, fresh ingredients', type: 'STRING' },

    // === SOCIAL MEDIA ===
    { key: 'facebook_url', value: '', type: 'STRING' },
    { key: 'instagram_url', value: '', type: 'STRING' },
    { key: 'twitter_url', value: '', type: 'STRING' },
    { key: 'youtube_url', value: '', type: 'STRING' },

    // === BRAND COLORS ===
    { 
      key: 'brand_colors', 
      value: JSON.stringify({
        primary: '#FF6B35',
        secondary: '#2E8B57',
        accent: '#FFD700',
        background: '#FFFFFF',
        text: '#333333',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      }), 
      type: 'JSON'
    },

    // === FEATURE TOGGLES ===
    { key: 'enable_pizza_builder', value: 'true', type: 'BOOLEAN' },
    { key: 'enable_menu_ordering', value: 'true', type: 'BOOLEAN' },
    { key: 'enable_user_accounts', value: 'true', type: 'BOOLEAN' },
    { key: 'enable_guest_checkout', value: 'true', type: 'BOOLEAN' },

    // === PRICING & OPERATIONS ===
    { key: 'tax_rate', value: '8.25', type: 'NUMBER' },
    { key: 'delivery_fee', value: '3.99', type: 'NUMBER' },
    { key: 'minimum_order', value: '15.00', type: 'NUMBER' },
    { key: 'preparation_time', value: '25', type: 'NUMBER' },

    // === OPERATING HOURS ===
    { 
      key: 'operating_hours', 
      value: JSON.stringify({
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '12:00', close: '23:00', closed: false },
        sunday: { open: '12:00', close: '21:00', closed: false }
      }), 
      type: 'JSON'
    },

    // === CONTENT & MESSAGING ===
    { key: 'welcome_message', value: 'Welcome to Omar Pizza!', type: 'STRING' },
    { key: 'welcome_subtitle', value: 'Create your perfect pizza', type: 'STRING' },
    { key: 'footer_text', value: '© 2025 Omar Pizza. All rights reserved.', type: 'STRING' },
    { key: 'footer_description', value: 'Experience the art of pizza making.', type: 'STRING' },

    // === LEGAL ===
    { key: 'terms_url', value: '/terms', type: 'STRING' },
    { key: 'privacy_url', value: '/privacy', type: 'STRING' },
    { key: 'refund_policy_url', value: '/refund-policy', type: 'STRING' }
  ];

  console.log(`📝 Adding ${settings.length} settings to database...`);

  let created = 0;
  let updated = 0;

  for (const setting of settings) {
    try {
      const result = await prisma.appSetting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          type: setting.type,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type
        }
      });

      // Check if it was created or updated
      const existing = await prisma.appSetting.findUnique({
        where: { key: setting.key }
      });
      
      if (existing) {
        console.log(`✅ ${setting.key} (${setting.section})`);
        if (existing.createdAt.getTime() === existing.updatedAt.getTime()) {
          created++;
        } else {
          updated++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to add ${setting.key}:`, error.message);
    }
  }

  console.log('\n🎉 SETTINGS POPULATION COMPLETE!');
  console.log(`📊 Created: ${created} | Updated: ${updated}`);
  
  // Verify all settings
  const allSettings = await prisma.appSetting.findMany({
    orderBy: { key: 'asc' }
  });

  console.log('\n📋 ALL SETTINGS:');
  allSettings.forEach(setting => {
    console.log(`   • ${setting.key}: ${setting.value.length > 50 ? setting.value.substring(0, 50) + '...' : setting.value}`);
  });

  console.log(`\n✨ Total settings in database: ${allSettings.length}`);
}

async function main() {
  try {
    await populateAllSettings();
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
