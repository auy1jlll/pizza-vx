const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLogoSettings() {
  try {
    console.log('Checking for logo and favicon settings...');
    
    const logoSettings = await prisma.appSetting.findMany({
      where: {
        OR: [
          { key: { contains: 'logo' } },
          { key: { contains: 'favicon' } },
          { key: { contains: 'Logo' } },
          { key: { contains: 'Favicon' } }
        ]
      }
    });
    
    console.log('Found settings:', logoSettings);
    
    // If no logo settings exist, create them
    if (logoSettings.length === 0) {
      console.log('Creating default logo and favicon settings...');
      
      await prisma.appSetting.createMany({
        data: [
          {
            key: 'appLogoUrl',
            value: '',
            type: 'STRING'
          },
          {
            key: 'appFaviconUrl', 
            value: '',
            type: 'STRING'
          }
        ]
      });
      
      console.log('Created default logo and favicon settings');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogoSettings();
