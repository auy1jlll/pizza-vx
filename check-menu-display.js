const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMenuDisplay() {
  console.log('🍕 Checking Menu Display Categories...');
  console.log('=====================================');

  try {
    // Get all active categories sorted by sortOrder
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 10
    });

    console.log(`\n📊 Total Active Categories: ${categories.length}`);
    console.log('\n📋 First 10 Categories (by sortOrder):');
    categories.forEach((cat, i) => {
      console.log(`${i+1}. ${cat.name} (sortOrder: ${cat.sortOrder})`);
    });

    // Check for pizza-related categories specifically
    const pizzaCategories = await prisma.menuCategory.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: 'Pizza' } },
          { name: { contains: 'Calzone' } },
          { name: { contains: 'Appetizer' } },
          { name: { contains: 'Salad' } },
          { name: { contains: 'Pasta' } },
          { name: { contains: 'Sandwich' } },
          { name: { contains: 'Wing' } },
          { name: { contains: 'Beverage' } }
        ]
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n🍕 Main Categories Found: ${pizzaCategories.length}`);
    pizzaCategories.forEach((cat, i) => {
      console.log(`${i+1}. ${cat.name} (sortOrder: ${cat.sortOrder})`);
    });

    // Check what the menu page might be filtering
    const lowSortOrder = await prisma.menuCategory.findMany({
      where: { 
        isActive: true,
        sortOrder: { lte: 10 }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n🔍 Categories with sortOrder <= 10: ${lowSortOrder.length}`);
    lowSortOrder.forEach((cat, i) => {
      console.log(`${i+1}. ${cat.name} (sortOrder: ${cat.sortOrder})`);
    });

  } catch (error) {
    console.error('❌ Error checking menu display:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuDisplay().catch(console.error);
