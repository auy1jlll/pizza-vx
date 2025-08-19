const { PrismaClient } = require('@prisma/client');

async function addDeliveryEnabled() {
  const prisma = new PrismaClient();
  try {
    console.log('Checking for existing deliveryEnabled setting...');
    
    const existing = await prisma.appSetting.findUnique({
      where: { key: 'deliveryEnabled' }
    });
    
    if (existing) {
      console.log('✅ Setting already exists:', existing);
      return existing;
    }
    
    console.log('Creating deliveryEnabled setting...');
    const newSetting = await prisma.appSetting.create({
      data: {
        key: 'deliveryEnabled',
        value: 'true',
        type: 'BOOLEAN'
      }
    });
    
    console.log('✅ Created setting:', newSetting);
    return newSetting;
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDeliveryEnabled();
