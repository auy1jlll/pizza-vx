const { PrismaClient } = require('@prisma/client');

async function checkDeliverySettings() {
  const prisma = new PrismaClient();
  
  try {
    const settings = await prisma.appSetting.findMany();
    
    console.log('All Settings:');
    settings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value} (${setting.type})`);
    });
    
    // Check specifically for deliveryEnabled
    const deliveryEnabled = settings.find(s => s.key === 'deliveryEnabled');
    console.log('\nDelivery Enabled Setting:');
    console.log(deliveryEnabled ? `Found: ${deliveryEnabled.value}` : 'NOT FOUND');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDeliverySettings();
