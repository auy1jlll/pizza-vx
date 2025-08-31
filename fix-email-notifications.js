const { PrismaClient } = require('@prisma/client');

async function enableEmailNotifications() {
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Enabling email notifications...\n');

    // Enable main email notifications
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: {
        value: 'true',
        type: 'BOOLEAN',
        updatedAt: new Date()
      },
      create: {
        key: 'emailNotifications',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    // Enable order notifications
    await prisma.appSetting.upsert({
      where: { key: 'orderNotifications' },
      update: {
        value: 'true',
        type: 'BOOLEAN',
        updatedAt: new Date()
      },
      create: {
        key: 'orderNotifications',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    // Enable customer notifications
    await prisma.appSetting.upsert({
      where: { key: 'customerNotifications' },
      update: {
        value: 'true',
        type: 'BOOLEAN',
        updatedAt: new Date()
      },
      create: {
        key: 'customerNotifications',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    console.log('✅ Email notifications enabled successfully!\n');

    // Verify the changes
    const updatedSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['emailNotifications', 'orderNotifications', 'customerNotifications']
        }
      }
    });

    console.log('📧 Updated Email Settings:');
    updatedSettings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value} (${setting.type})`);
    });

    console.log('\n🎉 Email notifications are now ENABLED!');
    console.log('Customers will now receive order confirmation emails.');

  } catch (error) {
    console.error('❌ Error enabling email notifications:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

enableEmailNotifications();
