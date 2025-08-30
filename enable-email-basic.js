const { PrismaClient } = require('@prisma/client');

async function enableEmailNotifications() {
  const prisma = new PrismaClient();

  try {
    // Enable email notifications
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'true' },
      create: {
        key: 'emailNotifications',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    console.log('✅ Email notifications enabled');

    // Verify the settings
    const settings = await prisma.appSetting.findMany({
      where: {
        key: 'emailNotifications'
      }
    });

    console.log('\n📧 Email Settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableEmailNotifications();
