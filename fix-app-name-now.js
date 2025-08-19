const { PrismaClient } = require('@prisma/client');

async function fixAppName() {
  const prisma = new PrismaClient();
  
  try {
    // Force update or create the app_name setting
    await prisma.appSetting.upsert({
      where: { key: 'app_name' },
      update: { value: 'Greenland Famous' },
      create: {
        key: 'app_name',
        value: 'Greenland Famous',
        type: 'STRING',
        description: 'Main application name'
      }
    });
    
    console.log('✅ App name updated to "Greenland Famous"');
    
    // Verify the change
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    console.log(`✅ Verified: app_name = "${setting?.value}"`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAppName();
