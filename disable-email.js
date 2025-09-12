const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function disableEmailNotifications() {
  try {
    console.log('🔧 Disabling email notifications to fix checkout...');
    
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'false' },
      create: { key: 'emailNotifications', value: 'false', type: 'BOOLEAN' }
    });
    
    console.log('✅ Email notifications disabled');
    console.log('Checkout should now work without email timeouts');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

disableEmailNotifications();
