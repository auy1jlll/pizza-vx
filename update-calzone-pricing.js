const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCalzonePricing() {
  try {
    console.log('🔄 Updating calzone pricing...');

    // Update Small calzone price to $21.50
    const smallCalzone = await prisma.pizzaSize.updateMany({
      where: {
        name: 'Small',
        productType: 'CALZONE'
      },
      data: {
        basePrice: 21.50
      }
    });

    // Update Large calzone price to $29.95
    const largeCalzone = await prisma.pizzaSize.updateMany({
      where: {
        name: 'Large',
        productType: 'CALZONE'
      },
      data: {
        basePrice: 29.95
      }
    });

    console.log('✅ Updated calzone pricing:');
    console.log(`   Small Calzone: $21.50`);
    console.log(`   Large Calzone: $29.95`);

    // Verify the changes
    const calzoneSizes = await prisma.pizzaSize.findMany({
      where: {
        productType: 'CALZONE'
      },
      orderBy: {
        basePrice: 'asc'
      }
    });

    console.log('\n📋 Current calzone sizes:');
    calzoneSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });

  } catch (error) {
    console.error('❌ Error updating calzone pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCalzonePricing();
