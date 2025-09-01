const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateOperatingHours() {
  try {
    console.log('🕒 Updating operating hours to 10:30 AM - 8:00 PM...');
    
    // Update the main operating_hours setting (24-hour format: 10:30-20:00)
    const newHours = {
      monday: "10:30-20:00",
      tuesday: "10:30-20:00", 
      wednesday: "10:30-20:00",
      thursday: "10:30-20:00",
      friday: "10:30-20:00",
      saturday: "10:30-20:00",
      sunday: "10:30-20:00"
    };
    
    await prisma.appSetting.upsert({
      where: { key: 'operating_hours' },
      update: { 
        value: JSON.stringify(newHours),
        type: 'JSON'
      },
      create: { 
        key: 'operating_hours',
        value: JSON.stringify(newHours),
        type: 'JSON'
      }
    });
    
    console.log('✅ Main operating_hours setting updated');
    
    // Also update individual day settings if they exist
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    for (const day of days) {
      // Update open time
      await prisma.appSetting.upsert({
        where: { key: `${day}Open` },
        update: { value: '10:30', type: 'STRING' },
        create: { key: `${day}Open`, value: '10:30', type: 'STRING' }
      });
      
      // Update close time  
      await prisma.appSetting.upsert({
        where: { key: `${day}Close` },
        update: { value: '20:00', type: 'STRING' },
        create: { key: `${day}Close`, value: '20:00', type: 'STRING' }
      });
      
      // Ensure not closed
      await prisma.appSetting.upsert({
        where: { key: `${day}Closed` },
        update: { value: 'false', type: 'BOOLEAN' },
        create: { key: `${day}Closed`, value: 'false', type: 'BOOLEAN' }
      });
    }
    
    console.log('✅ Individual day settings updated');
    
    // Verify the update
    const updatedSetting = await prisma.appSetting.findUnique({
      where: { key: 'operating_hours' }
    });
    
    console.log('📋 Updated operating hours:');
    console.log(JSON.parse(updatedSetting.value));
    
  } catch (error) {
    console.error('❌ Error updating operating hours:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateOperatingHours();
