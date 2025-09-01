const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllBusinessSettings() {
  try {
    console.log('🔍 Checking ALL settings related to business name...');
    
    // Get all settings that might contain business name info
    const allSettings = await prisma.appSetting.findMany({
      where: {
        OR: [
          { key: { contains: 'business' } },
          { key: { contains: 'Business' } },
          { key: { contains: 'name' } },
          { key: { contains: 'Name' } },
          { key: { contains: 'app' } },
          { key: { contains: 'App' } },
          { value: { contains: 'Local Pizza House' } },
          { value: { contains: 'Pizza' } }
        ]
      },
      orderBy: {
        key: 'asc'
      }
    });
    
    console.log(`Found ${allSettings.length} settings that might contain business info:`);
    console.log('');
    
    allSettings.forEach(setting => {
      console.log(`📝 ${setting.key}: "${setting.value}"`);
    });
    
    // Look specifically for Local Pizza House
    const localPizzaSettings = await prisma.appSetting.findMany({
      where: {
        value: {
          contains: 'Local Pizza House'
        }
      }
    });
    
    if (localPizzaSettings.length > 0) {
      console.log('\n🚨 Found settings still containing "Local Pizza House":');
      localPizzaSettings.forEach(setting => {
        console.log(`  ⚠️  ${setting.key}: "${setting.value}"`);
      });
    } else {
      console.log('\n✅ No settings found containing "Local Pizza House"');
    }
    
  } catch (error) {
    console.error('❌ Error checking settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllBusinessSettings();
