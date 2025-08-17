const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateRestaurantName() {
  try {
    console.log('🏪 Updating restaurant name to "Greenland Famous Cosby MP"...');

    // Update the restaurant name setting
    const updatedSetting = await prisma.setting.upsert({
      where: { key: 'restaurant_name' },
      update: { value: 'Greenland Famous Cosby MP' },
      create: { 
        key: 'restaurant_name', 
        value: 'Greenland Famous Cosby MP',
        category: 'branding'
      }
    });

    console.log('✅ Restaurant name updated successfully!');
    console.log('📝 Setting:', updatedSetting);

    // Also check if there are any other branding-related settings
    const brandingSettings = await prisma.setting.findMany({
      where: { category: 'branding' }
    });

    console.log('\n🎨 All branding settings:');
    brandingSettings.forEach(setting => {
      console.log(`  ${setting.key}: ${setting.value}`);
    });

  } catch (error) {
    console.error('❌ Error updating restaurant name:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRestaurantName();
