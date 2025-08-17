// Check menu categories data
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMenuCategories() {
  try {
    console.log('Checking menu categories...');
    
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
    
    console.log('Found categories:', categories.length);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}) - ${cat._count.menuItems} items, ${cat._count.customizationGroups} groups`);
    });
    
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      }
    });
    
    console.log('\nFound menu items:', menuItems.length);
    menuItems.forEach(item => {
      console.log(`- ${item.name} in ${item.category.name} - $${item.basePrice}`);
    });
    
    const customizationGroups = await prisma.customizationGroup.findMany({
      include: {
        category: true,
        _count: {
          select: {
            options: true
          }
        }
      }
    });
    
    console.log('\nFound customization groups:', customizationGroups.length);
    customizationGroups.forEach(group => {
      console.log(`- ${group.name} (${group.type}) - ${group._count.options} options - Category: ${group.category?.name || 'Global'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuCategories();
