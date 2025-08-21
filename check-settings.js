const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
  try {
    console.log('Checking app settings in database...');
    
    const settings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });
    
    console.log(`Found ${settings.length} settings in database:`);
    
    if (settings.length === 0) {
      console.log('❌ No settings found! This is the problem.');
      console.log('The database is empty of app settings.');
    } else {
      console.log('✅ Settings found:');
      settings.slice(0, 10).forEach(setting => {
        console.log(`  - ${setting.key}: ${setting.value} (${setting.type})`);
      });
      
      if (settings.length > 10) {
        console.log(`  ... and ${settings.length - 10} more settings`);
      }
    }
    
    // Check specifically for business settings
    const businessSettings = settings.filter(s => s.key.startsWith('business'));
    console.log(`\nBusiness settings: ${businessSettings.length}`);
    businessSettings.forEach(setting => {
      console.log(`  - ${setting.key}: ${setting.value}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
