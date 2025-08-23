const { PrismaClient } = require('@prisma/client');

async function checkSettings() {
  const prisma = new PrismaClient();
  
  try {
    const settings = await prisma.settings.findMany();
    
    console.log('📋 Current Settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value}`);
    });
    
  } catch (error) {
    console.error('Error checking settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
