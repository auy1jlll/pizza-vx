const { PrismaClient } = require('@prisma/client');

async function setOmarPizza() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Current database settings...');
    
    // Check current settings
    const currentSettings = await prisma.appSetting.findMany();
    console.log('Current settings:', currentSettings);
    
    // Remove any hardcoded names
    console.log('🧹 Removing any hardcoded values...');
    await prisma.appSetting.deleteMany({
      where: {
        OR: [
          { value: 'Pizza Builder Pro' },
          { value: 'Greenland Famous' }
        ]
      }
    });
    
    // Set Omar Pizza as the app name
    console.log('🍕 Setting "Omar Pizza" as the app name...');
    await prisma.appSetting.upsert({
      where: { key: 'app_name' },
      update: { value: 'Omar Pizza' },
      create: {
        key: 'app_name',
        value: 'Omar Pizza',
        type: 'STRING'
      }
    });
    
    // Verify the change
    const finalSettings = await prisma.appSetting.findMany();
    console.log('\n✅ Final database settings:');
    finalSettings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
    console.log('\n🎉 Successfully set Omar Pizza as your restaurant name!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setOmarPizza();
