const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMenuItems() {
  console.log('📋 Checking Menu Items in Database...\n');
  
  try {
    // Check menu categories
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: true
      }
    });
    
    console.log('🏷️ MENU CATEGORIES:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.menuItems.length} items`);
    });
    
    console.log('\n🍽️ ALL MENU ITEMS:');
    const allItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });
    
    if (allItems.length === 0) {
      console.log('❌ NO MENU ITEMS FOUND IN DATABASE!');
      console.log('\n🔧 Need to seed menu data...');
    } else {
      allItems.forEach(item => {
        console.log(`  📄 ${item.name} (${item.category.name}) - $${item.basePrice}`);
        if (item.customizationGroups.length > 0) {
          console.log(`     Customizations: ${item.customizationGroups.length}`);
        }
      });
    }
    
    console.log(`\n📊 Total: ${allItems.length} menu items`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuItems();
