const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteDinnerPlatesSimple() {
  try {
    console.log('🗑️ Starting dinner plates deletion...');
    
    // Find the dinner plates category
    const dinnerPlatesCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'dinner-plates' }
    });

    if (!dinnerPlatesCategory) {
      console.log('❌ No dinner plates category found - nothing to delete');
      return;
    }

    console.log(`📋 Found dinner plates category: ${dinnerPlatesCategory.name}`);

    // Delete all customization options for dinner plate groups
    console.log('🔧 Deleting customization options...');
    await prisma.customizationOption.deleteMany({
      where: {
        group: {
          categoryId: dinnerPlatesCategory.id
        }
      }
    });

    // Delete all customization groups for dinner plates
    console.log('🔧 Deleting customization groups...');
    await prisma.customizationGroup.deleteMany({
      where: {
        categoryId: dinnerPlatesCategory.id
      }
    });

    // Delete all menu item customizations for dinner plate items
    console.log('🔧 Deleting menu item customizations...');
    await prisma.menuItemCustomization.deleteMany({
      where: {
        menuItem: {
          categoryId: dinnerPlatesCategory.id
        }
      }
    });

    // Delete all menu items in dinner plates category
    console.log('🔧 Deleting menu items...');
    const deletedItems = await prisma.menuItem.deleteMany({
      where: {
        categoryId: dinnerPlatesCategory.id
      }
    });
    console.log(`  - Deleted ${deletedItems.count} menu items`);

    // Finally delete the category itself
    console.log('🔧 Deleting dinner plates category...');
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

deleteDinnerPlatesSimple();
