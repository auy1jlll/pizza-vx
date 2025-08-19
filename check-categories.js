const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        menuItems: {
          select: {
            name: true
          }
        }
      }
    });
    
    console.log('Available Categories:');
    categories.forEach(cat => {
      console.log(`  ${cat.slug} (${cat.name}) - ${cat.menuItems.length} items`);
      if (cat.menuItems.length > 0) {
        cat.menuItems.slice(0, 3).forEach(item => {
          console.log(`    - ${item.name}`);
        });
        if (cat.menuItems.length > 3) {
          console.log(`    ... and ${cat.menuItems.length - 3} more`);
        }
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
