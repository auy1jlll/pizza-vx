const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
  try {
    console.log('Checking for business name related settings...\n');
    
    // Check for any settings containing business or name
    const businessSettings = await prisma.appSetting.findMany({
      where: {
        OR: [
          { key: { contains: 'business' } },
          { key: { contains: 'name' } },
          { key: { contains: 'Business' } },
          { key: { contains: 'Name' } }
        ]
      }
    });
    
    console.log('Business/Name related settings:');
    businessSettings.forEach(setting => {
      console.log(`- ${setting.key}: "${setting.value}"`);
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check for settings containing "Pizza Restaurant" or "Local Pizza House"
    const pizzaSettings = await prisma.appSetting.findMany({
      where: {
        OR: [
          { value: { contains: 'Pizza Restaurant' } },
          { value: { contains: 'Local Pizza House' } },
          { value: { contains: 'pizza' } },
          { value: { contains: 'Pizza' } }
        ]
      }
    });
    
    console.log('Settings containing pizza-related values:');
    pizzaSettings.forEach(setting => {
      console.log(`- ${setting.key}: "${setting.value}"`);
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check specific keys we care about
    const specificKeys = ['businessName', 'business_name', 'app_name', 'business-name'];
    for (const key of specificKeys) {
      const setting = await prisma.appSetting.findUnique({
        where: { key }
      });
      if (setting) {
        console.log(`${key}: "${setting.value}"`);
      } else {
        console.log(`${key}: NOT FOUND`);
      }
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkSettings();
