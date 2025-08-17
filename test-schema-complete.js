const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSchema() {
  try {
    console.log('Testing database schema...');

    // Test 1: Check if MenuCategory table exists with slug field
    const categories = await prisma.menuCategory.findMany({
      select: { id: true, name: true, slug: true, isActive: true }
    });
    console.log('MenuCategory table exists with slug field');
    console.log('Categories found:', categories.length);
    console.log('Categories:', categories);

    // Test 2: Verify specific category exists
    const dinnerPlates = await prisma.menuCategory.findUnique({
      where: { slug: 'dinner-plates' },
      include: { menuItems: { select: { id: true, name: true } } }
    });

    if (dinnerPlates) {
      console.log('dinner-plates category found');
      console.log('Menu items in dinner-plates:', dinnerPlates.menuItems.length);
      console.log('Items:', dinnerPlates.menuItems);
    } else {
      console.log('dinner-plates category NOT found');
    }
    
    // Test 3: Test the exact query our API uses
    const apiQuery = await prisma.menuItem.findMany({
      where: {
        category: { 
          slug: 'dinner-plates'
        },
        isAvailable: true
      },
      include: { 
        category: { 
          select: { name: true, slug: true } 
        } 
      }
    });

    console.log('API query test completed');
    console.log('Items returned by API query:', apiQuery.length);
    console.log('API results:', apiQuery);

    await prisma.$disconnect();
    console.log('Database schema test completed');

  } catch (error) {
    console.error('Database schema test failed:', error.message);
    console.error('Full error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testSchema();
