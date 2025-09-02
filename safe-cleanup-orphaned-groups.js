const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function safeCleanupOrphanedGroups() {
  console.log('🧹 Safe Cleanup of Truly Orphaned Customization Groups...\n');

  try {
    // Find groups that are truly orphaned (no menu items AND no order references)
    console.log('🔍 Checking for customization groups with no references...\n');

    const allGroups = await prisma.customizationGroup.findMany({
      include: {
        _count: {
          select: { 
            menuItemCustomizations: true,
            options: true
          }
        }
      }
    });

    console.log(`📊 Total customization groups in database: ${allGroups.length}\n`);

    // Check each group for any references in orders
    let safeToDelete = [];
    let hasOrderReferences = [];
    let hasMenuItemReferences = [];

    for (const group of allGroups) {
      // Check if group has menu item connections
      if (group._count.menuItemCustomizations > 0) {
        hasMenuItemReferences.push(group);
        continue;
      }

      // Check if any of the group's options are referenced in orders
      const options = await prisma.customizationOption.findMany({
        where: { groupId: group.id },
        include: {
          _count: {
            select: { orderItemCustomizations: true }
          }
        }
      });

      const hasOrderRefs = options.some(option => option._count.orderItemCustomizations > 0);

      if (hasOrderRefs) {
        hasOrderReferences.push({
          group,
          orderRefCount: options.reduce((sum, opt) => sum + opt._count.orderItemCustomizations, 0)
        });
      } else {
        safeToDelete.push(group);
      }
    }

    // Report findings
    console.log(`📋 Analysis Results:`);
    console.log(`   ✅ Groups with menu item connections: ${hasMenuItemReferences.length}`);
    console.log(`   📦 Groups with order references: ${hasOrderReferences.length}`);
    console.log(`   🗑️  Groups safe to delete: ${safeToDelete.length}\n`);

    if (hasOrderReferences.length > 0) {
      console.log(`📦 Groups with order history (KEEP these):`);
      hasOrderReferences.forEach(item => {
        console.log(`   - ${item.group.name} (${item.group.type}): ${item.orderRefCount} order references`);
      });
      console.log('');
    }

    if (safeToDelete.length === 0) {
      console.log('✅ No orphaned groups found that are safe to delete.');
      console.log('   All remaining groups either have menu item connections or order history.\n');
      return;
    }

    console.log(`🗑️  Groups safe to delete (no menu items, no order history):`);
    safeToDelete.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.name} (${group.type}) - ID: ${group.id}`);
    });

    // Actually delete the safe ones
    console.log(`\n🔧 Deleting ${safeToDelete.length} truly orphaned groups...\n`);

    let deletedCount = 0;
    for (const group of safeToDelete) {
      try {
        await prisma.customizationGroup.delete({
          where: { id: group.id }
        });
        console.log(`   ✅ Deleted: ${group.name} (${group.type})`);
        deletedCount++;
      } catch (error) {
        console.log(`   ❌ Failed to delete ${group.name}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Successfully deleted ${deletedCount} truly orphaned customization groups!`);

    // Final summary
    console.log('\n📊 Final Summary:');
    const finalGroups = await prisma.customizationGroup.findMany({
      include: {
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    const activeGroups = finalGroups.filter(g => g._count.menuItemCustomizations > 0);
    const inactiveGroups = finalGroups.filter(g => g._count.menuItemCustomizations === 0);

    console.log(`   ✅ Active groups (connected to menu items): ${activeGroups.length}`);
    console.log(`   📦 Inactive groups (kept for order history): ${inactiveGroups.length}`);
    console.log(`   📋 Total groups: ${finalGroups.length}`);

  } catch (error) {
    console.error('❌ Error during safe cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

safeCleanupOrphanedGroups();
