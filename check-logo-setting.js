const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndSetLogo() {
  try {
    // Check if appLogoUrl setting exists
    let logoSetting = await prisma.appSetting.findUnique({
      where: { key: 'appLogoUrl' }
    });

    if (!logoSetting) {
      // Create the setting with the uploaded logo
      logoSetting = await prisma.appSetting.create({
        data: {
          key: 'appLogoUrl',
          value: '/uploads/logo-1756777827328.png',
          type: 'STRING'
        }
      });
      console.log('✅ Created appLogoUrl setting:', logoSetting);
    } else {
      console.log('📋 Current appLogoUrl setting:', logoSetting);
      
      // Update it to use the uploaded logo if it's empty
      if (!logoSetting.value || logoSetting.value === '') {
        const updated = await prisma.appSetting.update({
          where: { key: 'appLogoUrl' },
          data: { value: '/uploads/logo-1756777827328.png' }
        });
        console.log('✅ Updated appLogoUrl setting:', updated);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSetLogo();
