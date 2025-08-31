const { PrismaClient } = require('@prisma/client');

async function checkMenuItems() {
  const prisma = new PrismaClient();

  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      }
    });

    console.log('Menu items in database:');
    menuItems.forEach(item => {
      console.log(`- ${item.name} (ID: ${item.id}) - Category: ${item.category?.name || 'No category'}`);
    });

    console.log(`\nTotal menu items: ${menuItems.length}`);

    // Check for Scallops specifically
    const scallops = menuItems.find(item => item.name.toLowerCase().includes('scallop'));
    if (scallops) {
      console.log('\nFound Scallops:', scallops);
    } else {
      console.log('\nScallops not found in database');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuItems();
