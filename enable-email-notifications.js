const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enableEmailNotifications() {
  try {
    console.log('🔧 Re-enabling email notifications...');
    
    // Re-enable email notifications
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'true' },
      create: { key: 'emailNotifications', value: 'true', type: 'BOOLEAN' }
    });
    
    // Ensure email service is enabled
    await prisma.appSetting.upsert({
      where: { key: 'emailServiceEnabled' },
      update: { value: 'true' },
      create: { key: 'emailServiceEnabled', value: 'true', type: 'BOOLEAN' }
    });
    
    // Add timeout settings to prevent hanging
    await prisma.appSetting.upsert({
      where: { key: 'emailTimeout' },
      update: { value: '10000' },
      create: { key: 'emailTimeout', value: '10000', type: 'NUMBER' }
    });
    
    console.log('✅ Email notifications enabled');
    console.log('✅ Email service enabled');
    console.log('✅ Email timeout set to 10 seconds');
    
    // Verify settings
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['emailNotifications', 'emailServiceEnabled', 'gmailUser', 'gmailAppPassword']
        }
      }
    });
    
    console.log('\n📧 Current Email Settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableEmailNotifications();