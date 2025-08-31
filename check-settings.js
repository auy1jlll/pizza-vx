const { PrismaClient } = require('@prisma/client');

async function checkSettings() {
  const prisma = new PrismaClient();

  try {
    // Check for Gmail-related settings
    const gmailSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['gmailUser', 'gmailAppPassword', 'GMAIL_USER', 'GMAIL_APP_PASSWORD', 'emailNotifications', 'email']
        }
      }
    });

    console.log('Gmail-related settings in database:');
    gmailSettings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value}`);
    });

    if (gmailSettings.length === 0) {
      console.log('No Gmail settings found in database');
    }

    // Check all settings to see what's available
    const allSettings = await prisma.appSetting.findMany();
    console.log(`\nAll app settings (${allSettings.length} total):`);
    if (allSettings.length === 0) {
      console.log('No settings found in database');
    } else {
      allSettings.forEach(setting => {
        console.log(`- ${setting.key}: ${setting.value}`);
      });
    }

  } catch (error) {
    console.error('Error checking settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
