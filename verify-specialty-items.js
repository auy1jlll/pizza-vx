const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifySpecialtyItems() {
  console.log('Verifying specialty pizzas and calzones...');

  try {
    // Verify specialty pizzas
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

    console.log(`\n=== SPECIALTY PIZZAS (${specialtyPizzas.length}) ===`);
    for (const pizza of specialtyPizzas) {
      console.log(`\n${pizza.name} (${pizza.category}) - Base: $${pizza.basePrice}`);
      console.log(`Description: ${pizza.description}`);
      console.log(`Ingredients: ${pizza.ingredients}`);
      console.log('Sizes:');
      for (const size of pizza.sizes) {
        console.log(`  - ${size.pizzaSize.name}: $${size.price}`);
      }
    }

    // Verify specialty calzones
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

    console.log(`\n=== SPECIALTY CALZONES (${specialtyCalzones.length}) ===`);
    for (const calzone of specialtyCalzones) {
      console.log(`\n${calzone.calzoneName} - Base: $${calzone.basePrice}`);
      console.log(`Description: ${calzone.calzoneDescription}`);
      console.log(`Fillings: ${calzone.fillings}`);
      console.log('Sizes:');
      for (const size of calzone.sizes) {
        console.log(`  - ${size.pizzaSize.name}: $${size.price}`);
      }
    }

    // Verify pizza sizes
    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n=== ALL PIZZA SIZES (${allSizes.length}) ===`);
    for (const size of allSizes) {
      console.log(`- ${size.name}: $${size.basePrice} (${size.productType})`);
    }

    console.log('\nVerification completed successfully!');

  } catch (error) {
    console.error('Error verifying specialty items:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification script
verifySpecialtyItems()
  .then(() => {
    console.log('Verification script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Verification script failed:', error);
    process.exit(1);
  });
