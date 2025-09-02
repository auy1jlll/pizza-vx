const { PrismaClient } = require('@prisma/client');

async function updateAppName() {
  const prisma = new PrismaClient();
  
  try {
    // Update app_name
    const updatedAppName = await prisma.appSetting.upsert({
      where: { key: 'app_name' },
      update: {
        value: 'My New Restaurant Name',
        updatedAt: new Date()
      },
      create: {
        key: 'app_name',
        value: 'My New Restaurant Name',
        type: 'STRING'
      }
    });
    
    console.log('✅ Updated app_name:', updatedAppName);
    
    // Test fetching it back
    const fetchedAppName = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    console.log('✅ Fetched app_name:', fetchedAppName);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAppName();
