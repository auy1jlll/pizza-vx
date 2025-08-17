const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyRelationships() {
  console.log('🔍 Verifying menu data relationships...\n');

  try {
    // Check categories
    const categories = await prisma.menuCategory.findMany({
      include: {
        _count: {
          select: {
            menuItems: true,
            customizationGroups: true
          }
        }
      }
    });

    console.log('📂 CATEGORIES:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}): ${cat._count.menuItems} items, ${cat._count.customizationGroups} groups`);
    });

    // Check menu items with their customizations
    const menuItems = await prisma.menuItem.findMany({
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

    console.log('\n🍽️ MENU ITEMS WITH CUSTOMIZATIONS:');
    menuItems.forEach(item => {
      console.log(`  - ${item.name} (${item.category.name}): ${item.customizationGroups.length} customization groups`);
      item.customizationGroups.forEach(cg => {
        console.log(`    * ${cg.customizationGroup.name}: ${cg.customizationGroup.options.length} options`);
      });
    });

    // Check customization groups
    const customizationGroups = await prisma.customizationGroup.findMany({
      include: {
        category: true,
        options: true,
        menuItemCustomizations: {
          include: {
            menuItem: true
          }
        },
        _count: {
          select: {
            options: true,
            menuItemCustomizations: true
          }
        }
      }
    });

    console.log('\n⚙️ CUSTOMIZATION GROUPS:');
    customizationGroups.forEach(group => {
      const categoryName = group.category ? group.category.name : 'No Category';
      console.log(`  - ${group.name} (${categoryName}): ${group._count.options} options, ${group._count.menuItemCustomizations} items`);
    });

    // Summary
    const totals = {
      categories: categories.length,
      menuItems: menuItems.length,
      customizationGroups: customizationGroups.length,
      customizationOptions: customizationGroups.reduce((sum, group) => sum + group.options.length, 0),
      menuItemCustomizations: menuItems.reduce((sum, item) => sum + item.customizationGroups.length, 0)
    };

    console.log('\n📊 SUMMARY:');
    console.log(`  Categories: ${totals.categories}`);
    console.log(`  Menu Items: ${totals.menuItems}`);
    console.log(`  Customization Groups: ${totals.customizationGroups}`);
    console.log(`  Customization Options: ${totals.customizationOptions}`);
    console.log(`  Menu Item ↔ Group Links: ${totals.menuItemCustomizations}`);

    // Check for any orphaned data
    const orphanedItems = await prisma.menuItem.findMany({
      where: {
        customizationGroups: {
          none: {}
        }
      }
    });

    const orphanedGroups = await prisma.customizationGroup.findMany({
      where: {
        menuItemCustomizations: {
          none: {}
        }
      }
    });

    if (orphanedItems.length > 0 || orphanedGroups.length > 0) {
      console.log('\n⚠️ ORPHANED DATA:');
      if (orphanedItems.length > 0) {
        console.log(`  - ${orphanedItems.length} menu items without customization groups`);
        orphanedItems.forEach(item => console.log(`    * ${item.name}`));
      }
      if (orphanedGroups.length > 0) {
        console.log(`  - ${orphanedGroups.length} customization groups not linked to any menu items`);
        orphanedGroups.forEach(group => console.log(`    * ${group.name}`));
      }
    } else {
      console.log('\n✅ No orphaned data found - all relationships are properly linked!');
    }

  } catch (error) {
    console.error('❌ Error verifying relationships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyRelationships();
