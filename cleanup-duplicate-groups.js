// Clean up duplicate customization groups
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDuplicateGroups() {
  try {
    console.log('🧹 Starting cleanup of duplicate customization groups...\n');

    // Get all menu item customizations with their groups and options
    const allCustomizations = await prisma.menuItemCustomization.findMany({
      include: {
        menuItem: true,
        customizationGroup: {
          include: {
            options: true
          }
        }
      }
    });

    console.log(`Found ${allCustomizations.length} total menu item customizations`);

    // Group by menu item + customization group name
    const grouped = {};
    allCustomizations.forEach(item => {
      const key = `${item.menuItem.name}|${item.customizationGroup.name}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    let deletedMenuItemCustomizations = 0;
    let deletedCustomizationGroups = 0;

    // Process each group of duplicates
    for (const [key, items] of Object.entries(grouped)) {
      if (items.length > 1) {
        const [menuItemName, groupName] = key.split('|');
        console.log(`\n🔍 Processing: ${menuItemName} - ${groupName} (${items.length} instances)`);

        // Sort by: has options first, then by number of options descending
        items.sort((a, b) => {
          const aHasOptions = a.customizationGroup.options.length > 0;
          const bHasOptions = b.customizationGroup.options.length > 0;
          
          if (aHasOptions && !bHasOptions) return -1;
          if (!aHasOptions && bHasOptions) return 1;
          
          return b.customizationGroup.options.length - a.customizationGroup.options.length;
        });

        // Keep the first one (best one), delete the rest
        const toKeep = items[0];
        const toDelete = items.slice(1);

        console.log(`   ✅ Keeping: Group ${toKeep.customizationGroup.id} (${toKeep.customizationGroup.options.length} options)`);
        
        for (const item of toDelete) {
          console.log(`   ❌ Deleting: Group ${item.customizationGroup.id} (${item.customizationGroup.options.length} options)`);
          
          // Delete the menu item customization link
          await prisma.menuItemCustomization.delete({
            where: { id: item.id }
          });
          deletedMenuItemCustomizations++;

          // Check if this customization group is used elsewhere
          const otherUsages = await prisma.menuItemCustomization.count({
            where: { 
              customizationGroupId: item.customizationGroup.id,
              id: { not: item.id }
            }
          });

          // If not used elsewhere, delete the customization group and its options
          if (otherUsages === 0) {
            // Delete options first
            await prisma.customizationOption.deleteMany({
              where: { groupId: item.customizationGroup.id }
            });

            // Delete the group
            await prisma.customizationGroup.delete({
              where: { id: item.customizationGroup.id }
            });
            deletedCustomizationGroups++;
          }
        }
      }
    }

    console.log('\n📊 Cleanup Summary:');
    console.log(`   Deleted Menu Item Customizations: ${deletedMenuItemCustomizations}`);
    console.log(`   Deleted Customization Groups: ${deletedCustomizationGroups}`);

    // Final verification
    const finalCustomizations = await prisma.menuItemCustomization.findMany({
      include: {
        menuItem: true,
        customizationGroup: {
          include: {
            options: true
          }
        }
      }
    });

    console.log(`\n✅ Final state: ${finalCustomizations.length} menu item customizations remaining`);

    // Check for remaining issues
    const remainingIssues = finalCustomizations.filter(item => 
      item.customizationGroup.options.length === 0 && item.isRequired
    );

    if (remainingIssues.length > 0) {
      console.log(`\n⚠️  Still ${remainingIssues.length} required groups with no options`);
      remainingIssues.slice(0, 5).forEach(item => {
        console.log(`   - ${item.menuItem.name}: ${item.customizationGroup.name}`);
      });
    } else {
      console.log('\n🎉 All required groups now have options!');
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateGroups();
