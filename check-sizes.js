const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllSizes() {
  console.log('Checking all pizza sizes in database...');

  try {
    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('All pizza sizes:');
    allSizes.forEach(size => {
      console.log(`- ${size.name}: $${size.basePrice} (${size.productType}) - ID: ${size.id}`);
    });

    // Check if calzone sizes exist
    const calzoneSizes = allSizes.filter(s => s.productType === 'CALZONE');
    console.log(`\nCalzone sizes found: ${calzoneSizes.length}`);

    if (calzoneSizes.length === 0) {
      console.log('Creating calzone sizes...');

      const newCalzoneSizes = [
        {
          name: 'Small Calzone',
          diameter: 'Personal size calzone',
          basePrice: 16.5,
          productType: 'CALZONE',
          sortOrder: 10,
          description: null
        },
        {
          name: 'Large Calzone',
          diameter: 'Family size calzone',
          basePrice: 22,
          productType: 'CALZONE',
          sortOrder: 11,
          description: null
        }
      ];

      for (const size of newCalzoneSizes) {
        await prisma.pizzaSize.create({
          data: size
        });
        console.log(`Created ${size.name}: $${size.basePrice}`);
      }
    }

  } catch (error) {
    console.error('Error checking sizes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkAllSizes()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
