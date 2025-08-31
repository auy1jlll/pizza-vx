const { PrismaClient } = require('@prisma/client');

async function checkAllSettings() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking all settings in database...\n');

    // Get all settings
    const allSettings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });

    console.log(`📊 Total settings in database: ${allSettings.length}\n`);

    // Group by type
    const settingsByType = allSettings.reduce((acc, setting) => {
      acc[setting.type] = (acc[setting.type] || 0) + 1;
      return acc;
    }, {});

    console.log('📋 Settings by type:');
    Object.entries(settingsByType).forEach(([type, count]) => {
      console.log(`- ${type}: ${count}`);
    });

    console.log('\n📝 All settings:');
    allSettings.forEach((setting, index) => {
      console.log(`${index + 1}. ${setting.key}: ${setting.value} (${setting.type})`);
    });

    // Check for Gmail settings specifically
    const gmailSettings = allSettings.filter(s =>
      s.key.toLowerCase().includes('gmail') ||
      s.key.toLowerCase().includes('email') ||
      s.key.toLowerCase().includes('mail')
    );

    console.log(`\n📧 Email-related settings: ${gmailSettings.length}`);
    gmailSettings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value}`);
    });

  } catch (error) {
    console.error('❌ Error checking settings:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllSettings();
