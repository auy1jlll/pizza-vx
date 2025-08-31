const { PrismaClient } = require('@prisma/client');

async function verifySettingsCategories() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Verifying settings categories...\n');

    const allSettings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });

    console.log(`📊 Total settings: ${allSettings.length}\n`);

    // Define the categories from the global settings page
    const categories = {
      business: ['businessName', 'businessPhone', 'businessEmail', 'businessAddress', 'businessDescription'],
      hours: ['mondayOpen', 'mondayClose', 'mondayClosed', 'tuesdayOpen', 'tuesdayClose', 'tuesdayClosed', 'wednesdayOpen', 'wednesdayClose', 'wednesdayClosed', 'thursdayOpen', 'thursdayClose', 'thursdayClosed', 'fridayOpen', 'fridayClose', 'fridayClosed', 'saturdayOpen', 'saturdayClose', 'saturdayClosed', 'sundayOpen', 'sundayClose', 'sundayClosed', 'operating_hours'],
      pricing: ['taxRate', 'deliveryFee', 'deliveryEnabled', 'minimumOrder', 'tipPercentages', 'defaultTipPercentage', 'allowPayAtPickup', 'allowPayLater', 'payLaterMinimumOrder', 'intensityLightMultiplier', 'intensityRegularMultiplier', 'intensityExtraMultiplier', 'removalCreditPercentage'],
      operations: ['preparationTime', 'deliveryTimeBuffer', 'showDeliveryTime'],
      features: ['showPricingBreakdown', 'allowRemovalCredits', 'enableRewards', 'enableNotifications', 'enableInventoryTracking', 'enableLoyaltyProgram', 'enableMultiLocation', 'enableAdvancedReporting'],
      branding: ['primaryColor', 'secondaryColor', 'logoUrl', 'faviconUrl', 'themeMode', 'brandFont', 'headerBackgroundColor', 'accentColor', 'customCSS', 'brand_colors'],
      notifications: ['emailNotifications', 'smsNotifications', 'adminAlerts', 'orderNotifications', 'inventoryAlerts', 'lowStockAlerts', 'customerNotifications'],
      email: ['gmailUser', 'gmailAppPassword', 'emailServiceEnabled', 'emailFromName', 'emailReplyTo'],
      technical: ['rateLimitWindowSeconds', 'rateLimitMaxRequests', 'adminRateLimitWindowSeconds', 'adminRateLimitMaxRequests', 'kitchenPollingIntervalSeconds']
    };

    let totalCategorized = 0;

    Object.entries(categories).forEach(([categoryName, categoryKeys]) => {
      const categorySettings = allSettings.filter(s => categoryKeys.includes(s.key));
      console.log(`📁 ${categoryName}: ${categorySettings.length} settings`);
      totalCategorized += categorySettings.length;
    });

    // Find uncategorized settings
    const allCategoryKeys = Object.values(categories).flat();
    const uncategorizedSettings = allSettings.filter(s => !allCategoryKeys.includes(s.key));

    console.log(`\n📂 Uncategorized: ${uncategorizedSettings.length} settings`);
    if (uncategorizedSettings.length > 0) {
      console.log('Uncategorized settings:');
      uncategorizedSettings.forEach(setting => {
        console.log(`- ${setting.key}`);
      });
    }

    console.log(`\n✅ Summary:`);
    console.log(`- Categorized settings: ${totalCategorized}`);
    console.log(`- Uncategorized settings: ${uncategorizedSettings.length}`);
    console.log(`- Total: ${allSettings.length}`);

    if (totalCategorized + uncategorizedSettings.length === allSettings.length) {
      console.log('✅ All settings accounted for!');
    } else {
      console.log('❌ Settings count mismatch!');
    }

  } catch (error) {
    console.error('❌ Error verifying settings:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySettingsCategories();
