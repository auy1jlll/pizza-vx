const { PrismaClient } = require('@prisma/client');

async function updateAppName() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Updating app_name to "Greenland Famous"...\n');
    
    // First, check if the setting exists
    const existing = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    if (existing) {
      console.log(`📝 Current value: "${existing.value}"`);
      
      // Update the existing setting
      const updated = await prisma.appSetting.update({
        where: { key: 'app_name' },
        data: { value: 'Greenland Famous' }
      });
      
      console.log(`✅ Updated to: "${updated.value}"`);
    } else {
      // Create new setting if it doesn't exist
      const created = await prisma.appSetting.create({
        data: {
          key: 'app_name',
          value: 'Greenland Famous',
          type: 'STRING',
          description: 'Main application name'
        }
      });
      
      console.log(`✅ Created new setting: "${created.value}"`);
    }
    
    // Verify the change
    const verified = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    console.log(`\n🔍 Verification: app_name = "${verified?.value}"`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAppName();
