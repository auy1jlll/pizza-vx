const { PrismaClient } = require('@prisma/client');

async function checkAndUpdateSettings() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking current app settings...');
    
    // Check all current settings
    const allSettings = await prisma.appSetting.findMany();
    
    console.log('\n📋 Current Settings in Database:');
    allSettings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
    // Check specifically for app_name
    const currentAppName = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    console.log(`\n🏪 Current App Name: "${currentAppName?.value || 'NOT SET'}"`);
    
    // If the current name is "Greenland Famous", let's clear it so you can set it properly
    if (currentAppName?.value === 'Greenland Famous') {
      console.log('\n⚠️  Found "Greenland Famous" - this was incorrectly hardcoded!');
      console.log('🔄 Removing this to allow you to set your preferred name...');
      
      await prisma.appSetting.delete({
        where: { key: 'app_name' }
      });
      
      console.log('✅ Cleared the hardcoded name. You can now set "Omar Pizza" in admin settings.');
    }
    
    // Check if Omar Pizza is already set
    const afterCheck = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    console.log(`\n🏪 App Name after cleanup: "${afterCheck?.value || 'NOT SET - Ready for your input'}"`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateSettings();
