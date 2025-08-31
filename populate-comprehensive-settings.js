const { PrismaClient } = require('@prisma/client');

async function populateAllSettings() {
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Populating comprehensive settings in database...\n');

    // Check existing settings
    const existingSettings = await prisma.appSetting.findMany();
    const existingKeys = existingSettings.map(s => s.key);

    console.log(`📊 Found ${existingSettings.length} existing settings`);

    // Comprehensive settings to create
    const allSettings = [
      // Business Information
      { key: 'businessName', value: 'Greenland Famous Pizza', type: 'STRING' },
      { key: 'businessPhone', value: '(603) 555-0123', type: 'STRING' },
      { key: 'businessEmail', value: 'info@greenlandpizza.com', type: 'STRING' },
      { key: 'businessAddress', value: '123 Main Street, Greenland, NH 03840', type: 'STRING' },
      { key: 'businessDescription', value: 'Authentic Italian pizza and cuisine since 1985', type: 'STRING' },

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
      { key: 'operating_hours', value: '{"monday":"11:00-22:00","tuesday":"11:00-22:00","wednesday":"11:00-22:00","thursday":"11:00-22:00","friday":"11:00-23:00","saturday":"11:00-23:00","sunday":"12:00-21:00"}', type: 'JSON' },

      // Pricing & Payments
      { key: 'taxRate', value: '9.0', type: 'NUMBER' },
      { key: 'deliveryFee', value: '3.99', type: 'NUMBER' },
      { key: 'deliveryEnabled', value: 'true', type: 'BOOLEAN' },
      { key: 'minimumOrder', value: '15.00', type: 'NUMBER' },
      { key: 'tipPercentages', value: '[15,18,20,25]', type: 'JSON' },
      { key: 'defaultTipPercentage', value: '18', type: 'NUMBER' },
      { key: 'allowPayAtPickup', value: 'true', type: 'BOOLEAN' },
      { key: 'allowPayLater', value: 'false', type: 'BOOLEAN' },
      { key: 'payLaterMinimumOrder', value: '25.00', type: 'NUMBER' },
      { key: 'intensityLightMultiplier', value: '0.8', type: 'NUMBER' },
      { key: 'intensityRegularMultiplier', value: '1.0', type: 'NUMBER' },
      { key: 'intensityExtraMultiplier', value: '1.2', type: 'NUMBER' },
      { key: 'removalCreditPercentage', value: '10', type: 'NUMBER' },

      // Operations & Timing
      { key: 'preparationTime', value: '20', type: 'NUMBER' },
      { key: 'deliveryTimeBuffer', value: '10', type: 'NUMBER' },
      { key: 'showDeliveryTime', value: 'true', type: 'BOOLEAN' },

      // Features & Display
      { key: 'showPricingBreakdown', value: 'true', type: 'BOOLEAN' },
      { key: 'allowRemovalCredits', value: 'true', type: 'BOOLEAN' },
      { key: 'enableRewards', value: 'true', type: 'BOOLEAN' },
      { key: 'enableNotifications', value: 'true', type: 'BOOLEAN' },
      { key: 'enableInventoryTracking', value: 'false', type: 'BOOLEAN' },
      { key: 'enableLoyaltyProgram', value: 'true', type: 'BOOLEAN' },
      { key: 'enableMultiLocation', value: 'false', type: 'BOOLEAN' },
      { key: 'enableAdvancedReporting', value: 'true', type: 'BOOLEAN' },

      // Branding & Appearance
      { key: 'primaryColor', value: '#FF6B35', type: 'STRING' },
      { key: 'secondaryColor', value: '#FFA500', type: 'STRING' },
      { key: 'logoUrl', value: '/logo.png', type: 'STRING' },
      { key: 'faviconUrl', value: '/favicon.ico', type: 'STRING' },
      { key: 'themeMode', value: 'light', type: 'STRING' },
      { key: 'brandFont', value: 'Inter', type: 'STRING' },
      { key: 'headerBackgroundColor', value: '#1a1a1a', type: 'STRING' },
      { key: 'accentColor', value: '#FF6B35', type: 'STRING' },
      { key: 'customCSS', value: '', type: 'STRING' },
      { key: 'brand_colors', value: '{"primary":"#FF6B35","secondary":"#FFA500","accent":"#FF6B35"}', type: 'JSON' },

      // Notifications & Alerts
      { key: 'smsNotifications', value: 'false', type: 'BOOLEAN' },
      { key: 'adminAlerts', value: 'true', type: 'BOOLEAN' },
      { key: 'orderNotifications', value: 'true', type: 'BOOLEAN' },
      { key: 'inventoryAlerts', value: 'true', type: 'BOOLEAN' },
      { key: 'lowStockAlerts', value: 'true', type: 'BOOLEAN' },
      { key: 'customerNotifications', value: 'true', type: 'BOOLEAN' },

      // System Configuration
      { key: 'rateLimitWindowSeconds', value: '60', type: 'NUMBER' },
      { key: 'rateLimitMaxRequests', value: '100', type: 'NUMBER' },
      { key: 'adminRateLimitWindowSeconds', value: '60', type: 'NUMBER' },
      { key: 'adminRateLimitMaxRequests', value: '500', type: 'NUMBER' },
      { key: 'kitchenPollingIntervalSeconds', value: '30', type: 'NUMBER' },

      // Additional Business Settings
      { key: 'websiteUrl', value: 'https://greenlandpizza.com', type: 'STRING' },
      { key: 'facebookUrl', value: 'https://facebook.com/greenlandpizza', type: 'STRING' },
      { key: 'instagramUrl', value: 'https://instagram.com/greenlandpizza', type: 'STRING' },
      { key: 'twitterUrl', value: 'https://twitter.com/greenlandpizza', type: 'STRING' },
      { key: 'googleMapsUrl', value: '', type: 'STRING' },
      { key: 'reservationPhone', value: '(603) 555-0123', type: 'STRING' },
      { key: 'cateringPhone', value: '(603) 555-0123', type: 'STRING' },
      { key: 'managerOnDuty', value: 'John Smith', type: 'STRING' },
      { key: 'storeManager', value: 'Jane Doe', type: 'STRING' },

      // Menu Display Settings
      { key: 'showPrices', value: 'true', type: 'BOOLEAN' },
      { key: 'showCalories', value: 'false', type: 'BOOLEAN' },
      { key: 'showAllergens', value: 'true', type: 'BOOLEAN' },
      { key: 'enableOnlineOrdering', value: 'true', type: 'BOOLEAN' },
      { key: 'enableReservations', value: 'true', type: 'BOOLEAN' },
      { key: 'enableCatering', value: 'true', type: 'BOOLEAN' },
      { key: 'maxOrderAdvanceDays', value: '7', type: 'NUMBER' },
      { key: 'minOrderAdvanceHours', value: '1', type: 'NUMBER' },

      // Payment Settings
      { key: 'acceptCash', value: 'true', type: 'BOOLEAN' },
      { key: 'acceptCreditCard', value: 'true', type: 'BOOLEAN' },
      { key: 'acceptDebitCard', value: 'true', type: 'BOOLEAN' },
      { key: 'acceptGiftCards', value: 'true', type: 'BOOLEAN' },
      { key: 'squarePaymentEnabled', value: 'false', type: 'BOOLEAN' },
      { key: 'stripePaymentEnabled', value: 'false', type: 'BOOLEAN' },
      { key: 'paypalEnabled', value: 'false', type: 'BOOLEAN' },

      // Delivery Settings
      { key: 'deliveryRadius', value: '10', type: 'NUMBER' },
      { key: 'freeDeliveryThreshold', value: '25.00', type: 'NUMBER' },
      { key: 'deliveryDrivers', value: '3', type: 'NUMBER' },
      { key: 'averageDeliveryTime', value: '30', type: 'NUMBER' },
      { key: 'deliveryInstructions', value: 'Please ring doorbell and leave at door if no answer', type: 'STRING' },

      // Kitchen Settings
      { key: 'kitchenStations', value: '3', type: 'NUMBER' },
      { key: 'maxConcurrentOrders', value: '10', type: 'NUMBER' },
      { key: 'orderAlertsEnabled', value: 'true', type: 'BOOLEAN' },
      { key: 'printerEnabled', value: 'true', type: 'BOOLEAN' },
      { key: 'autoPrintOrders', value: 'true', type: 'BOOLEAN' },

      // Customer Service
      { key: 'customerServiceEmail', value: 'support@greenlandpizza.com', type: 'STRING' },
      { key: 'complaintEmail', value: 'manager@greenlandpizza.com', type: 'STRING' },
      { key: 'feedbackEnabled', value: 'true', type: 'BOOLEAN' },
      { key: 'surveyEnabled', value: 'true', type: 'BOOLEAN' },
      { key: 'loyaltyPointsPerDollar', value: '1', type: 'NUMBER' },
      { key: 'loyaltyPointsValue', value: '0.01', type: 'NUMBER' },

      // Analytics & Reporting
      { key: 'googleAnalyticsId', value: '', type: 'STRING' },
      { key: 'facebookPixelId', value: '', type: 'STRING' },
      { key: 'enableOrderTracking', value: 'true', type: 'BOOLEAN' },
      { key: 'enableCustomerTracking', value: 'true', type: 'BOOLEAN' },
      { key: 'reportRetentionDays', value: '365', type: 'NUMBER' },

      // Security Settings
      { key: 'sessionTimeoutMinutes', value: '60', type: 'NUMBER' },
      { key: 'maxLoginAttempts', value: '5', type: 'NUMBER' },
      { key: 'passwordMinLength', value: '8', type: 'NUMBER' },
      { key: 'requireSpecialCharacters', value: 'true', type: 'BOOLEAN' },
      { key: 'twoFactorEnabled', value: 'false', type: 'BOOLEAN' },

      // Backup & Maintenance
      { key: 'autoBackupEnabled', value: 'true', type: 'BOOLEAN' },
      { key: 'backupFrequency', value: 'daily', type: 'STRING' },
      { key: 'backupRetentionDays', value: '30', type: 'NUMBER' },
      { key: 'maintenanceMode', value: 'false', type: 'BOOLEAN' },
      { key: 'maintenanceMessage', value: 'We are currently performing maintenance. Please check back soon.', type: 'STRING' }
    ];

    console.log(`📝 Preparing to create ${allSettings.length} settings...`);

    let created = 0;
    let skipped = 0;

    for (const setting of allSettings) {
      if (!existingKeys.includes(setting.key)) {
        await prisma.appSetting.create({
          data: setting
        });
        created++;
        console.log(`✅ Created: ${setting.key}`);
      } else {
        skipped++;
        console.log(`⏭️  Skipped (exists): ${setting.key}`);
      }
    }

    console.log(`\n🎉 Settings population complete!`);
    console.log(`📊 Created: ${created} new settings`);
    console.log(`⏭️  Skipped: ${skipped} existing settings`);
    console.log(`📈 Total settings in database: ${existingSettings.length + created}`);

    // Verify final count
    const finalSettings = await prisma.appSetting.findMany();
    console.log(`\n🔍 Final verification: ${finalSettings.length} settings in database`);

  } catch (error) {
    console.error('❌ Error populating settings:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

populateAllSettings();
