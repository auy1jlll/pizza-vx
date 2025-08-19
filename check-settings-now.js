const { PrismaClient } = require('@prisma/client');

async function checkSettings() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking current app settings...\n');
    
    const settings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });
    
    if (settings.length === 0) {
      console.log('❌ No settings found in database!');
    } else {
      console.log('✅ Found settings:');
      settings.forEach(setting => {
        console.log(`   ${setting.key}: "${setting.value}"`);
      });
      
      const appName = settings.find(s => s.key === 'app_name');
      if (appName) {
        console.log(`\n🏷️  App Name: "${appName.value}"`);
      } else {
        console.log('\n❌ No app_name setting found!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
