const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixGmailService() {
  try {
    console.log('🔧 Fixing Gmail service configuration...');
    
    // Update Gmail service settings with proper timeout configuration
    await prisma.appSetting.upsert({
      where: { key: 'gmailTimeout' },
      update: { value: '10000' },
      create: { key: 'gmailTimeout', value: '10000', type: 'NUMBER' }
    });
    
    // Enable email notifications
    await prisma.appSetting.upsert({
      where: { key: 'emailNotifications' },
      update: { value: 'true' },
      create: { key: 'emailNotifications', value: 'true', type: 'BOOLEAN' }
    });
    
    // Add connection timeout setting
    await prisma.appSetting.upsert({
      where: { key: 'gmailConnectionTimeout' },
      update: { value: '5000' },
      create: { key: 'gmailConnectionTimeout', value: '5000', type: 'NUMBER' }
    });
    
    // Add socket timeout setting
    await prisma.appSetting.upsert({
      where: { key: 'gmailSocketTimeout' },
      update: { value: '10000' },
      create: { key: 'gmailSocketTimeout', value: '10000', type: 'NUMBER' }
    });
    
    console.log('✅ Gmail service configuration updated');
    console.log('Email notifications: Enabled');
    console.log('Gmail timeout: 10 seconds');
    console.log('Connection timeout: 5 seconds');
    console.log('Socket timeout: 10 seconds');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixGmailService();
