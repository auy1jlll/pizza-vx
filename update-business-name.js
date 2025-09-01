const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBusinessName() {
  try {
    console.log('🔄 Checking current business name settings...');
    
    // Check current business name settings
    const currentSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['businessName', 'business_name', 'app_name']
        }
      }
    });
    
    console.log('Current business name settings:');
    currentSettings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
    // Update business name settings to use a generic name
    const businessNameKey = 'businessName';
    
    const existingSetting = await prisma.appSetting.findUnique({
      where: { key: businessNameKey }
    });
    
    if (existingSetting) {
      console.log(`\n🔄 Updating existing ${businessNameKey} setting...`);
      await prisma.appSetting.update({
        where: { key: businessNameKey },
        data: { value: 'Pizza Restaurant' }
      });
      console.log(`✅ Updated ${businessNameKey} to "Pizza Restaurant"`);
    } else {
      console.log(`\n🔄 Creating new ${businessNameKey} setting...`);
      await prisma.appSetting.create({
        data: {
          key: businessNameKey,
          value: 'Pizza Restaurant',
          type: 'STRING'
        }
      });
      console.log(`✅ Created ${businessNameKey} with value "Pizza Restaurant"`);
    }
    
    // Also check and update business_name if it exists
    const businessNameUnderscoreKey = 'business_name';
    const existingUnderscoreSetting = await prisma.appSetting.findUnique({
      where: { key: businessNameUnderscoreKey }
    });
    
    if (existingUnderscoreSetting) {
      console.log(`\n🔄 Updating existing ${businessNameUnderscoreKey} setting...`);
      await prisma.appSetting.update({
        where: { key: businessNameUnderscoreKey },
        data: { value: 'Pizza Restaurant' }
      });
      console.log(`✅ Updated ${businessNameUnderscoreKey} to "Pizza Restaurant"`);
    }
    
    // Verify the changes
    console.log('\n✅ Verifying changes...');
    const updatedSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['businessName', 'business_name', 'app_name']
        }
      }
    });
    
    console.log('Updated business name settings:');
    updatedSettings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
    console.log('\n🎉 Business name update completed successfully!');
    console.log('Please refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('❌ Error updating business name:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBusinessName();
