const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicateSandwiches() {
  try {
    console.log('🧹 Cleaning up duplicate sandwich items from other categories...\n');

    // Get the Specialty Items category
    const specialtyItemsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Specialty Items' }
    });

    if (!specialtyItemsCategory) {
      console.log('❌ Specialty Items category not found');
      return;
    }

    // Define items to remove from Specialty Items (exact matches)
    const itemsToRemove = [
      'Haddock Sandwich (2pcs)',
      'Reuben on Rye',
      'Gyro',
      'Hot Dog',
      'Hot Pastrami',
      'Chicken Sandwich',
      'Hamburger'
    ];

    console.log('🔍 Looking for duplicate items to remove from Specialty Items...\n');

    let removedCount = 0;
    for (const itemName of itemsToRemove) {
      // Find the item in Specialty Items
      const duplicateItem = await prisma.menuItem.findFirst({
        where: {
          categoryId: specialtyItemsCategory.id,
          name: {
            contains: itemName,
            mode: 'insensitive'
          }
        }
      });

      if (duplicateItem) {
        console.log(`❌ Removing duplicate: ${duplicateItem.name} - $${duplicateItem.basePrice} from Specialty Items`);
        
        // Delete the duplicate item
        await prisma.menuItem.delete({
          where: { id: duplicateItem.id }
        });
        
        removedCount++;
      } else {
        console.log(`ℹ️ No duplicate found for: ${itemName}`);
      }
    }

    console.log(`\n✅ Cleanup complete! Removed ${removedCount} duplicate items from Specialty Items.`);

    // Show remaining items in Specialty Items
    console.log('\n📋 Remaining items in Specialty Items:');
    const remainingSpecialtyItems = await prisma.menuItem.findMany({
      where: { categoryId: specialtyItemsCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    if (remainingSpecialtyItems.length === 0) {
      console.log('  (No items remaining)');
    } else {
      remainingSpecialtyItems.forEach(item => {
        console.log(`  • ${item.name} - $${item.basePrice}`);
      });
    }

    // Show final Sandwiches category
    console.log('\n🥪 Final Sandwiches category:');
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    const sandwichItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichesCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    sandwichItems.forEach(item => {
      console.log(`  • ${item.name} - $${item.basePrice}`);
    });

  } catch (error) {
    console.error('❌ Error cleaning up duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateSandwiches();
