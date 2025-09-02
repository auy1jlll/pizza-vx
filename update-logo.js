const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateLogo() {
  try {
    // Update the appLogoUrl setting to use the Gland Famous logo
    const updated = await prisma.appSetting.upsert({
      where: { key: 'appLogoUrl' },
      update: { value: '/images/logo-Gland-famous.png' },
      create: {
        key: 'appLogoUrl',
        value: '/images/logo-Gland-famous.png',
        type: 'STRING'
      }
    });
    console.log('✅ Updated logo setting:', updated);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLogo();
