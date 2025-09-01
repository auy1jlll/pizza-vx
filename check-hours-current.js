const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOperatingHours() {
  try {
    console.log('🔍 Checking operating hours data...');
    
    // Get the operating_hours setting
    const operatingHoursSetting = await prisma.appSetting.findUnique({
      where: { key: 'operating_hours' }
    });
    
    console.log('Operating hours setting:', operatingHoursSetting);
    
    if (operatingHoursSetting) {
      console.log('Parsed value:', JSON.parse(operatingHoursSetting.value));
    }
    
    // Check if there are individual day settings
    const daySettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'mondayOpen', 'mondayClose', 'mondayClosed',
            'tuesdayOpen', 'tuesdayClose', 'tuesdayClosed',
            'wednesdayOpen', 'wednesdayClose', 'wednesdayClosed',
            'thursdayOpen', 'thursdayClose', 'thursdayClosed',
            'fridayOpen', 'fridayClose', 'fridayClosed',
            'saturdayOpen', 'saturdayClose', 'saturdayClosed',
            'sundayOpen', 'sundayClose', 'sundayClosed'
          ]
        }
      }
    });
    
    console.log('\nIndividual day settings:', daySettings.length);
    for (const setting of daySettings) {
      console.log(`${setting.key}: ${setting.value}`);
    }
    
  } catch (error) {
    console.error('Error checking operating hours:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOperatingHours();
