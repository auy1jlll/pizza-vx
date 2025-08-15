const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTipAndPaymentSettings() {
  try {
    console.log('Adding tip and payment settings...');

    // Add tip percentage options (JSON array)
    await prisma.appSetting.upsert({
      where: { key: 'tipPercentages' },
      update: { 
        value: JSON.stringify([15, 18, 20, 25]),
        type: 'JSON'
      },
      create: {
        key: 'tipPercentages',
        value: JSON.stringify([15, 18, 20, 25]),
        type: 'JSON'
      }
    });

    // Enable custom tip option
    await prisma.appSetting.upsert({
      where: { key: 'allowCustomTip' },
      update: { 
        value: 'true',
        type: 'BOOLEAN'
      },
      create: {
        key: 'allowCustomTip',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    // Default tip percentage
    await prisma.appSetting.upsert({
      where: { key: 'defaultTipPercentage' },
      update: { 
        value: '18',
        type: 'NUMBER'
      },
      create: {
        key: 'defaultTipPercentage',
        value: '18',
        type: 'NUMBER'
      }
    });

    // Allow pay at pickup
    await prisma.appSetting.upsert({
      where: { key: 'allowPayAtPickup' },
      update: { 
        value: 'true',
        type: 'BOOLEAN'
      },
      create: {
        key: 'allowPayAtPickup',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    // Allow pay later (for delivery)
    await prisma.appSetting.upsert({
      where: { key: 'allowPayLater' },
      update: { 
        value: 'true',
        type: 'BOOLEAN'
      },
      create: {
        key: 'allowPayLater',
        value: 'true',
        type: 'BOOLEAN'
      }
    });

    // Minimum order for pay later
    await prisma.appSetting.upsert({
      where: { key: 'payLaterMinimumOrder' },
      update: { 
        value: '25.00',
        type: 'NUMBER'
      },
      create: {
        key: 'payLaterMinimumOrder',
        value: '25.00',
        type: 'NUMBER'
      }
    });

    console.log('✅ Tip and payment settings added successfully!');
    
    // Display current settings
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['tipPercentages', 'allowCustomTip', 'defaultTipPercentage', 'allowPayAtPickup', 'allowPayLater', 'payLaterMinimumOrder']
        }
      }
    });
    
    console.log('\nCurrent tip and payment settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value} (${setting.type})`);
    });

  } catch (error) {
    console.error('Error adding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTipAndPaymentSettings();
