const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSortOrders() {
  try {
    console.log('🔍 Updating customization group sort orders...\n');

    // Find the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: { slug: 'sandwiches-burgers' }
    });

    if (!category) {
      console.log('❌ Sandwiches & Burgers category not found');
      return;
    }

    // Get a menu item to check current groups
    const menuItem = await prisma.menuItem.findFirst({
      where: { categoryId: category.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    if (!menuItem) {
      console.log('❌ No menu items found');
      return;
    }

    console.log(`📋 Current groups for ${menuItem.name}:`);
    
    // Update sort orders to proper sequence
    const updates = [
      { name: 'Sandwich Size', newSortOrder: 0 },
      { name: 'Sandwich Preparation', newSortOrder: 1 },
      { name: 'Sandwich Toppings', newSortOrder: 2 },
      { name: 'Sandwich Condiments', newSortOrder: 3 }
    ];

    for (const update of updates) {
      const group = await prisma.customizationGroup.findFirst({
        where: { 
          name: update.name,
          categoryId: category.id
        }
      });

      if (group) {
        await prisma.menuItemCustomization.updateMany({
          where: { 
            customizationGroupId: group.id 
          },
          data: { 
            sortOrder: update.newSortOrder 
          }
        });
        console.log(`   ✅ ${update.name}: sortOrder = ${update.newSortOrder}`);
      } else {
        console.log(`   ⚠️  ${update.name}: not found`);
      }
    }

    console.log('\n🎉 Sort orders updated successfully!');

  } catch (error) {
    console.error('❌ Error updating sort orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSortOrders();
