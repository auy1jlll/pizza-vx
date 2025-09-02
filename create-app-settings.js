const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAppSettings() {
  try {
    // Check and create app_name setting
    let appName = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });

    if (!appName) {
      appName = await prisma.appSetting.create({
        data: {
          key: 'app_name',
          value: 'Gland Famous Pizza',
          type: 'STRING'
        }
      });
      console.log('✅ Created app_name setting:', appName);
    } else {
      console.log('📋 app_name already exists:', appName);
    }

    // Check and create app_tagline setting
    let appTagline = await prisma.appSetting.findUnique({
      where: { key: 'app_tagline' }
    });

    if (!appTagline) {
      appTagline = await prisma.appSetting.create({
        data: {
          key: 'app_tagline',
          value: 'Fresh • Authentic • Delicious',
          type: 'STRING'
        }
      });
      console.log('✅ Created app_tagline setting:', appTagline);
    } else {
      console.log('📋 app_tagline already exists:', appTagline);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAppSettings();
