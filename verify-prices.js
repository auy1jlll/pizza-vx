const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUpdatedPrices() {
  console.log('Verifying updated prices...');

  try {
    // Check base sizes
    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n=== BASE SIZES ===');
    allSizes.forEach(size => {
      console.log(`- ${size.name}: $${size.basePrice.toFixed(2)} (${size.productType})`);
    });

    // Check specialty pizzas
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n=== SPECIALTY PIZZAS ===');
    for (const pizza of specialtyPizzas) {
      console.log(`\n${pizza.name}:`);
      for (const size of pizza.sizes) {
        if (size.pizzaSize) {
          console.log(`  - ${size.pizzaSize.name}: $${size.price.toFixed(2)}`);
        }
      }
    }

    // Check specialty calzones
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n=== SPECIALTY CALZONES ===');
    for (const calzone of specialtyCalzones) {
      console.log(`\n${calzone.calzoneName}:`);
      for (const size of calzone.sizes) {
        if (size.pizzaSize) {
          console.log(`  - ${size.pizzaSize.name}: $${size.price.toFixed(2)}`);
        }
      }
    }

    console.log('\nPrice verification completed!');

  } catch (error) {
    console.error('Error verifying prices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification script
verifyUpdatedPrices()
  .then(() => {
    console.log('Verification script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Verification script failed:', error);
    process.exit(1);
  });
