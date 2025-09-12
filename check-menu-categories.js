const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMenuCategories() {
  try {
    console.log('🍕 Checking Menu Categories...');
    console.log('==============================');
    
    // Get all menu categories
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { menuItems: true }
        }
      }
    });
    
    console.log(`\n📊 Total Categories: ${categories.length}`);
    console.log('\n📋 Category Details:');
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   ID: ${category.id}`);
      console.log(`   Description: ${category.description || 'No description'}`);
      console.log(`   Sort Order: ${category.sortOrder}`);
      console.log(`   Menu Items: ${category._count.menuItems}`);
      console.log(`   Active: ${category.isActive}`);
      console.log('');
    });
    
    // Check if we have the expected categories
    const expectedCategories = [
      'Pizza', 'Specialty Pizzas', 'Calzones', 'Specialty Calzones',
      'Appetizers', 'Salads', 'Pasta', 'Sandwiches', 'Wings',
      'Beverages', 'Desserts', 'Sides', 'Soups', 'Kids Menu',
      'Vegetarian', 'Gluten Free', 'Combo Meals', 'Family Deals'
    ];
    
    console.log('\n🔍 Checking for Expected Categories:');
    expectedCategories.forEach(expected => {
      const found = categories.find(cat => 
        cat.name.toLowerCase().includes(expected.toLowerCase()) ||
        expected.toLowerCase().includes(cat.name.toLowerCase())
      );
      console.log(`${found ? '✅' : '❌'} ${expected}: ${found ? found.name : 'NOT FOUND'}`);
    });
    
    // Check menu items per category
    console.log('\n📊 Menu Items Distribution:');
    const categoryStats = await prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        menuItems: {
          where: { isActive: true },
          select: { id: true, name: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    categoryStats.forEach(category => {
      console.log(`${category.name}: ${category.menuItems.length} items`);
      if (category.menuItems.length > 0) {
        console.log(`  Sample items: ${category.menuItems.slice(0, 3).map(item => item.name).join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuCategories();
