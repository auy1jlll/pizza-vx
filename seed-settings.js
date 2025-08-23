const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSettings() {
  try {
    console.log('Seeding essential app settings...');
    
    const defaultSettings = [
      // Business Information
      { key: 'businessName', value: 'Greenland Famous Pizza', type: 'STRING' },
      { key: 'businessPhone', value: '(630) 501-0774', type: 'STRING' },
      { key: 'businessEmail', value: 'info@greenlandfamous.com', type: 'STRING' },
      { key: 'businessAddress', value: '123 Main Street, Boston, MA 02101', type: 'STRING' },
      { key: 'businessDescription', value: 'Authentic pizza and sandwiches since 1995', type: 'STRING' },
      
      // Pricing & Payments (taxRate already exists)
      { key: 'deliveryFee', value: '3.99', type: 'NUMBER' },
      { key: 'deliveryEnabled', value: 'false', type: 'BOOLEAN' },
      { key: 'minimumOrder', value: '15.00', type: 'NUMBER' },
      { key: 'tipPercentages', value: '[15, 18, 20, 22, 25]', type: 'JSON' },
      { key: 'defaultTipPercentage', value: '18', type: 'NUMBER' },
      { key: 'allowPayAtPickup', value: 'true', type: 'BOOLEAN' },
      { key: 'allowPayLater', value: 'false', type: 'BOOLEAN' },
      { key: 'payLaterMinimumOrder', value: '50.00', type: 'NUMBER' },
      
      // Operations & Timing
      { key: 'preparationTime', value: '25', type: 'NUMBER' },
      { key: 'deliveryTimeBuffer', value: '10', type: 'NUMBER' },
      { key: 'showDeliveryTime', value: 'true', type: 'BOOLEAN' },
      
      // Business Hours
      { key: 'mondayOpen', value: '11:00', type: 'STRING' },
      { key: 'mondayClose', value: '22:00', type: 'STRING' },
      { key: 'mondayClosed', value: 'false', type: 'BOOLEAN' },
      { key: 'tuesdayOpen', value: '11:00', type: 'STRING' },
      { key: 'tuesdayClose', value: '22:00', type: 'STRING' },
      { key: 'tuesdayClosed', value: 'false', type: 'BOOLEAN' },
      { key: 'wednesdayOpen', value: '11:00', type: 'STRING' },
      { key: 'wednesdayClose', value: '22:00', type: 'STRING' },
      { key: 'wednesdayClosed', value: 'false', type: 'BOOLEAN' },
      { key: 'thursdayOpen', value: '11:00', type: 'STRING' },
      { key: 'thursdayClose', value: '22:00', type: 'STRING' },
      { key: 'thursdayClosed', value: 'false', type: 'BOOLEAN' },
      { key: 'fridayOpen', value: '11:00', type: 'STRING' },
      { key: 'fridayClose', value: '23:00', type: 'STRING' },
      { key: 'fridayClosed', value: 'false', type: 'BOOLEAN' },
      { key: 'saturdayOpen', value: '11:00', type: 'STRING' },
      { key: 'saturdayClose', value: '23:00', type: 'STRING' },
      { key: 'saturdayClosed', value: 'false', type: 'BOOLEAN' },
      { key: 'sundayOpen', value: '12:00', type: 'STRING' },
      { key: 'sundayClose', value: '21:00', type: 'STRING' },
      { key: 'sundayClosed', value: 'false', type: 'BOOLEAN' },
      
      // Features & Display
      { key: 'showPricingBreakdown', value: 'true', type: 'BOOLEAN' },
      { key: 'allowRemovalCredits', value: 'true', type: 'BOOLEAN' },
      { key: 'enableRewards', value: 'false', type: 'BOOLEAN' },
      { key: 'enableNotifications', value: 'true', type: 'BOOLEAN' },
      { key: 'enableInventoryTracking', value: 'false', type: 'BOOLEAN' },
      { key: 'enableLoyaltyProgram', value: 'false', type: 'BOOLEAN' },
      { key: 'enableMultiLocation', value: 'false', type: 'BOOLEAN' },
      { key: 'enableAdvancedReporting', value: 'false', type: 'BOOLEAN' },
      
      // Branding & Appearance
      { key: 'primaryColor', value: '#FF6B35', type: 'STRING' },
      { key: 'secondaryColor', value: '#FFA500', type: 'STRING' },
      { key: 'logoUrl', value: '/images/logo.png', type: 'STRING' },
      { key: 'faviconUrl', value: '/favicon.ico', type: 'STRING' },
      { key: 'themeMode', value: 'light', type: 'STRING' },
      { key: 'brandFont', value: 'Inter', type: 'STRING' },
      { key: 'headerBackgroundColor', value: '#1F2937', type: 'STRING' },
      { key: 'accentColor', value: '#10B981', type: 'STRING' },
      { key: 'customCSS', value: '', type: 'STRING' },
      { key: 'brand_colors', value: '{"primary":"#FF6B35","secondary":"#FFA500","success":"#10B981","warning":"#F59E0B","error":"#EF4444","info":"#3B82F6"}', type: 'JSON' },
      
      // Notifications & Alerts
      { key: 'emailNotifications', value: 'true', type: 'BOOLEAN' },
      { key: 'smsNotifications', value: 'false', type: 'BOOLEAN' },
      { key: 'adminAlerts', value: 'true', type: 'BOOLEAN' },
      { key: 'orderNotifications', value: 'true', type: 'BOOLEAN' },
      { key: 'inventoryAlerts', value: 'false', type: 'BOOLEAN' },
      { key: 'lowStockAlerts', value: 'false', type: 'BOOLEAN' },
      { key: 'customerNotifications', value: 'true', type: 'BOOLEAN' },
      
      // Pricing Multipliers
      { key: 'intensityLightMultiplier', value: '0.75', type: 'NUMBER' },
      { key: 'intensityRegularMultiplier', value: '1.0', type: 'NUMBER' },
      { key: 'intensityExtraMultiplier', value: '1.5', type: 'NUMBER' },
      { key: 'removalCreditPercentage', value: '50', type: 'NUMBER' },
      
      // System Configuration (Technical Settings)
      { key: 'rateLimitWindowSeconds', value: '60', type: 'NUMBER' },
      { key: 'rateLimitMaxRequests', value: '100', type: 'NUMBER' },
      { key: 'adminRateLimitWindowSeconds', value: '60', type: 'NUMBER' },
      { key: 'adminRateLimitMaxRequests', value: '200', type: 'NUMBER' },
      { key: 'kitchenPollingIntervalSeconds', value: '30', type: 'NUMBER' }
    ];
    
    console.log(`Preparing to seed ${defaultSettings.length} settings...`);
    
    // Use upsert to create or update settings
    for (const setting of defaultSettings) {
      await prisma.appSetting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          type: setting.type
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type
        }
      });
      console.log(`✓ ${setting.key}: ${setting.value}`);
    }
    
    console.log(`\n✅ Successfully seeded ${defaultSettings.length} app settings!`);
    console.log('🎉 Global settings page should now work properly');
    
  } catch (error) {
    console.error('Error seeding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSettings();
