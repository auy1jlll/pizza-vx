const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCurrentSettings() {
  try {
    console.log('🔍 Checking Current App Settings:');
    console.log('================================\n');

    const appSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['app_name', 'business_name', 'meta_title']
        }
      }
    });

    console.log('📋 Current Settings:');
    appSettings.forEach(setting => {
      console.log(`   ${setting.key}: "${setting.value}"`);
    });

    if (appSettings.length === 0) {
      console.log('   ⚠️  No app name settings found in database');
    }

    console.log('\n🌐 Testing API endpoint...');
    const response = await fetch('http://localhost:3005/api/admin/settings/app');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API call failed:', response.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentSettings();
