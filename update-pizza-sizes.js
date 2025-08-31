const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndUpdatePizzaSizes() {
  console.log('Checking current pizza sizes...');

  try {
    // Get current pizza sizes
    const currentSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('Current pizza sizes:');
    currentSizes.forEach(size => {
      console.log(`- ${size.name}: $${size.basePrice} (${size.productType})`);
    });

    // Update pizza sizes according to user specifications
    const sizeUpdates = [
      {
        id: currentSizes.find(s => s.name === 'Small Pizza')?.id,
        name: 'Small Pizza',
        basePrice: 11.55, // Updated from 11.25
        productType: 'PIZZA'
      },
      {
        id: currentSizes.find(s => s.name === 'Large Pizza')?.id,
        name: 'Large Pizza',
        basePrice: 16.5, // Already correct
        productType: 'PIZZA'
      },
      {
        id: currentSizes.find(s => s.name === 'Small Calzone')?.id,
        name: 'Small Calzone',
        basePrice: 16.5, // Updated from 16
        productType: 'CALZONE'
      },
      {
        id: currentSizes.find(s => s.name === 'Large Calzone')?.id,
        name: 'Large Calzone',
        basePrice: 22, // Updated from 21
        productType: 'CALZONE'
      }
    ];

    console.log('\nUpdating pizza sizes...');
    for (const update of sizeUpdates) {
      if (update.id) {
        await prisma.pizzaSize.update({
          where: { id: update.id },
          data: {
            basePrice: update.basePrice
          }
        });
        console.log(`Updated ${update.name}: $${update.basePrice}`);
      }
    }

    console.log('\nPizza sizes updated successfully!');

  } catch (error) {
    console.error('Error updating pizza sizes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkAndUpdatePizzaSizes()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
