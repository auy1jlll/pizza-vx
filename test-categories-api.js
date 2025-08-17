const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCategoriesAPI() {
  try {
    console.log('Testing categories API...');
    
    // Test the API directly (simulating what the frontend does)
    const categories = await prisma.menuCategory.findMany({
      include: {
        _count: {
          select: {
            menuItems: true,
            customizationGroups: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    console.log('Categories from database:', categories.length);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
    });

    // Also test an individual menu item
    console.log('\nTesting individual menu item:');
    const item = await prisma.menuItem.findFirst({
      include: {
        category: true
      }
    });

    if (item) {
      console.log(`Item: ${item.name}`);
      console.log(`Category: ${item.category?.name || 'NONE'} (ID: ${item.categoryId})`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testCategoriesAPI();
