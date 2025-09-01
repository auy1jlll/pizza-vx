const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOperatingHours() {
  try {
    const operatingHours = await prisma.appSetting.findUnique({
      where: { key: 'operating_hours' }
    });
    console.log('Operating hours setting:', operatingHours);
    
    if (operatingHours && operatingHours.value) {
      console.log('Parsed value:', JSON.parse(operatingHours.value));
    }
    
    // Also check for individual day settings
    const daySettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['mondayOpen', 'mondayClose', 'mondayClosed', 'tuesdayOpen', 'tuesdayClose', 'tuesdayClosed', 'wednesdayOpen', 'wednesdayClose', 'wednesdayClosed', 'thursdayOpen', 'thursdayClose', 'thursdayClosed', 'fridayOpen', 'fridayClose', 'fridayClosed', 'saturdayOpen', 'saturdayClose', 'saturdayClosed', 'sundayOpen', 'sundayClose', 'sundayClosed']
        }
      }
    });
    console.log('Individual day settings found:', daySettings.length);
    daySettings.forEach(setting => {
      console.log(setting.key + ':', setting.value);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOperatingHours();
