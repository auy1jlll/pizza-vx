const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyComprehensiveMenuData() {
  console.log('Verifying comprehensive menu data...');

  try {
    // Verify categories
    const categories = await prisma.menuCategory.findMany({
      where: {
        name: {
          in: [
            'Dinner Plates',
            'Seafood Plates',
            'Hot Subs',
            'Cold Subs',
            'Steak and Cheese Subs',
            'Wings',
            'Fingers',
            'Fried Appetizers',
            'Soups & Chowders',
            'Specialty Items'
          ]
        }
      },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n=== MENU CATEGORIES (${categories.length}) ===`);
    for (const category of categories) {
      console.log(`\n${category.name} (${category.menuItems.length} items):`);
      for (const item of category.menuItems) {
        console.log(`  - ${item.name}: $${item.basePrice.toFixed(2)}`);
      }
    }

    // Get total counts
    const totalCategories = await prisma.menuCategory.count();
    const totalMenuItems = await prisma.menuItem.count();

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total Categories: ${totalCategories}`);
    console.log(`Total Menu Items: ${totalMenuItems}`);

    // Verify specific high-value items
    const highValueItems = await prisma.menuItem.findMany({
      where: {
        basePrice: {
          gte: 15.00
        }
      },
      include: {
        category: true
      },
      orderBy: { basePrice: 'desc' }
    });

    console.log(`\n=== HIGH-VALUE ITEMS (≥$15) ===`);
    for (const item of highValueItems) {
      console.log(`  - ${item.name}: $${item.basePrice.toFixed(2)} (${item.category.name})`);
    }

    console.log('\nVerification completed successfully!');

  } catch (error) {
    console.error('Error verifying menu data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification script
verifyComprehensiveMenuData()
  .then(() => {
    console.log('Verification script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Verification script failed:', error);
    process.exit(1);
  });
