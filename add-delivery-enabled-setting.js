const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDeliveryEnabledSetting() {
  try {
    console.log('🚀 Adding deliveryEnabled setting...');

    // Check if the setting already exists
    const existingSetting = await prisma.appSetting.findUnique({
      where: { key: 'deliveryEnabled' }
    });

    if (existingSetting) {
      console.log('✅ deliveryEnabled setting already exists:', existingSetting);
      return existingSetting;
    }

    // Create the new setting
    const newSetting = await prisma.appSetting.create({
      data: {
        key: 'deliveryEnabled',
        value: 'true', // Default to enabled
        type: 'BOOLEAN'
      }
    });

    console.log('✅ Successfully added deliveryEnabled setting:', newSetting);
    return newSetting;

  } catch (error) {
    console.error('❌ Error adding deliveryEnabled setting:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  addDeliveryEnabledSetting()
    .then(() => {
      console.log('🎉 Delivery enabled setting added successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to add delivery enabled setting:', error);
      process.exit(1);
    });
}

module.exports = { addDeliveryEnabledSetting };
