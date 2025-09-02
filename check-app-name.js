const { PrismaClient } = require('@prisma/client');

async function checkAppName() {
  const prisma = new PrismaClient();
  
  try {
    // Check for app_name setting
    const appName = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    console.log('App Name setting:', appName);
    
    // Check for app_tagline setting
    const appTagline = await prisma.appSetting.findUnique({
      where: { key: 'app_tagline' }
    });
    
    console.log('App Tagline setting:', appTagline);
    
    // Count total settings
    const totalSettings = await prisma.appSetting.count();
    console.log('Total settings count:', totalSettings);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAppName();
