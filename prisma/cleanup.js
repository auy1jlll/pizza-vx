const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupSizes() {
  try {
    console.log('🧹 Cleaning up invalid pizza sizes...');

    // Find invalid size entries
    const invalidSizes = await prisma.pizzaSize.findMany({
      where: {
        OR: [
          { name: 'ddd' },
          { name: 'large Pizza' }
        ]
      }
    });

    console.log(`Found ${invalidSizes.length} invalid sizes to clean up`);

    // Delete specialty pizza size relations for invalid sizes
    for (const size of invalidSizes) {
      await prisma.specialtyPizzaSize.deleteMany({
        where: { pizzaSizeId: size.id }
      });
      console.log(`✅ Deleted specialty pizza size relations for: ${size.name}`);
    }

    // Delete the invalid sizes
    await prisma.pizzaSize.deleteMany({
      where: {
        OR: [
          { name: 'ddd' },
          { name: 'large Pizza' }
        ]
      }
    });

    console.log('🎉 Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupSizes();
