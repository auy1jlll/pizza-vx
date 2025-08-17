const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteDinnerPlates() {
  try {
    console.log('🔍 Checking current dinner plates data...');
    
    // First, let's see what we have
    const dinnerPlatesCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'dinner-plates' },
      include: {
        menuItems: {
          include: {
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
        }
      }
    });

    if (!dinnerPlatesCategory) {
      console.log('❌ No dinner plates category found');
      return;
    }

    console.log(`📋 Found dinner plates category with ${dinnerPlatesCategory.menuItems.length} items:`);
    dinnerPlatesCategory.menuItems.forEach(item => {
      console.log(`  - ${item.name} (${item.customizationGroups.length} customization groups)`);
    });

    console.log('\n🗑️ Starting deletion process...');

    // Delete in the correct order to avoid foreign key constraints
    for (const menuItem of dinnerPlatesCategory.menuItems) {
      console.log(`\n🔧 Processing menu item: ${menuItem.name}`);
      
      // Delete customization options first
      for (const customizationGroup of menuItem.customizationGroups) {
        const group = customizationGroup.customizationGroup;
        console.log(`  - Deleting ${group.options.length} options from group: ${group.name}`);
        
        await prisma.customizationOption.deleteMany({
          where: { groupId: group.id }
        });
        
        console.log(`  - Deleting customization group: ${group.name}`);
        await prisma.customizationGroup.delete({
          where: { id: group.id }
        });
      }
      
      // Delete menu item customizations
      console.log(`  - Deleting menu item customization links`);
      await prisma.menuItemCustomization.deleteMany({
        where: { menuItemId: menuItem.id }
      });
      
      // Delete the menu item
      console.log(`  - Deleting menu item: ${menuItem.name}`);
      await prisma.menuItem.delete({
        where: { id: menuItem.id }
      });
    }

    // Finally delete the category
    console.log(`\n🗑️ Deleting dinner plates category`);
    await prisma.menuCategory.delete({
      where: { id: dinnerPlatesCategory.id }
    });

    console.log('\n✅ Successfully deleted all dinner plates data!');
    
    // Verify deletion
    const remainingCategories = await prisma.menuCategory.findMany({
      select: { name: true, slug: true }
    });
    
    console.log('\n📋 Remaining categories:');
    remainingCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

  } catch (error) {
    console.error('❌ Error deleting dinner plates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDinnerPlates();
