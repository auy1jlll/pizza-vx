const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultSettings = [
  // Business Information
  { key: 'businessName', value: 'Pizza Builder', type: 'STRING' },
  { key: 'businessPhone', value: '(555) 123-4567', type: 'STRING' },
  { key: 'businessEmail', value: 'orders@pizzabuilder.com', type: 'STRING' },
  { key: 'businessAddress', value: '123 Main Street, City, State, ZIP Code', type: 'STRING' },
  
  // Pricing & Tax
  { key: 'taxRate', value: '8.25', type: 'NUMBER' },
  { key: 'deliveryFee', value: '3.99', type: 'NUMBER' },
  { key: 'minimumOrder', value: '15.00', type: 'NUMBER' },
  
  // Operations
  { key: 'preparationTime', value: '25', type: 'NUMBER' },
  
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
  
  // Notifications
  { key: 'orderNotifications', value: 'true', type: 'BOOLEAN' },
  { key: 'emailNotifications', value: 'true', type: 'BOOLEAN' },
  { key: 'smsNotifications', value: 'false', type: 'BOOLEAN' },
];

async function seedSettings() {
  console.log('🔧 Seeding default settings...');
  
  try {
    for (const setting of defaultSettings) {
      await prisma.appSetting.upsert({
        where: { key: setting.key },
        update: {
          // Don't overwrite existing values
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
        },
      });
    }
    
    console.log(`✅ Successfully seeded ${defaultSettings.length} default settings`);
    
    // Display current settings
    const allSettings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });
    
    console.log('\n📋 Current Settings:');
    allSettings.forEach(setting => {
      console.log(`  ${setting.key}: ${setting.value} (${setting.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSettings();
