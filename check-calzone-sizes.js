const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndUpdateCalzonePricing() {
  try {
    console.log('🔍 Checking current calzone sizes...');

    // Check current calzone sizes
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
      console.log(`   ${size.name}: $${size.basePrice} (ID: ${size.id})`);
    });

    if (calzoneSizes.length === 0) {
      console.log('❌ No calzone sizes found. Creating them...');
      
      // Create calzone sizes if they don't exist
      const smallCalzone = await prisma.pizzaSize.create({
        data: {
          name: 'Small Calzone',
          diameter: '10"',
          basePrice: 21.50,
          description: 'Small calzone',
          productType: 'CALZONE',
          isAvailable: true
        }
      });

      const largeCalzone = await prisma.pizzaSize.create({
        data: {
          name: 'Large Calzone',
          diameter: '14"',
          basePrice: 29.95,
          description: 'Large calzone',
          productType: 'CALZONE',
          isAvailable: true
        }
      });

      console.log('✅ Created calzone sizes:');
      console.log(`   Small Calzone: $21.50 (ID: ${smallCalzone.id})`);
      console.log(`   Large Calzone: $29.95 (ID: ${largeCalzone.id})`);
    } else {
      // Update existing calzone prices
      console.log('\n🔄 Updating calzone pricing...');

      for (const size of calzoneSizes) {
        let newPrice;
        if (size.name.toLowerCase().includes('small')) {
          newPrice = 21.50;
        } else if (size.name.toLowerCase().includes('large')) {
          newPrice = 29.95;
        }

        if (newPrice && size.basePrice !== newPrice) {
          await prisma.pizzaSize.update({
            where: { id: size.id },
            data: { basePrice: newPrice }
          });
          console.log(`   Updated ${size.name}: $${size.basePrice} → $${newPrice}`);
        }
      }
    }

    // Final verification
    const updatedSizes = await prisma.pizzaSize.findMany({
      where: {
        productType: 'CALZONE'
      },
      orderBy: {
        basePrice: 'asc'
      }
    });

    console.log('\n✅ Final calzone sizes:');
    updatedSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateCalzonePricing();
