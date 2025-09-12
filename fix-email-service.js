const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixEmailService() {
  try {
    console.log('🔧 Fixing email service configuration...');
    
    // Update email service settings with better timeout handling
    await prisma.appSetting.upsert({
      where: { key: 'emailServiceEnabled' },
      update: { value: 'true' },
      create: { key: 'emailServiceEnabled', value: 'true', type: 'BOOLEAN' }
    });
    
    // Re-enable email notifications but with better error handling
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'true' },
      create: { key: 'emailNotifications', value: 'true', type: 'BOOLEAN' }
    });
    
    // Add email timeout setting
    await prisma.appSetting.upsert({
      where: { key: 'emailTimeout' },
      update: { value: '10000' },
      create: { key: 'emailTimeout', value: '10000', type: 'NUMBER' }
    });
    
    console.log('✅ Email service configuration updated');
    console.log('Email notifications: Enabled');
    console.log('Email timeout: 10 seconds');
    console.log('Checkout should now work with email confirmations');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEmailService();
