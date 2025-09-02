const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupOrphanedGroups() {
  console.log('🧹 Cleaning Up Orphaned Customization Groups...\n');

  try {
    await prisma.$transaction(async (tx) => {
      
      // Find all customization groups with no connections
      const orphanedGroups = await tx.customizationGroup.findMany({
        include: {
          _count: {
            select: { menuItemCustomizations: true }
          }
        },
        where: {
          menuItemCustomizations: {
            none: {}
          }
        }
      });

      if (orphanedGroups.length === 0) {
        console.log('✅ No orphaned groups found. Database is clean!');
        return;
      }

      console.log(`🔍 Found ${orphanedGroups.length} orphaned customization groups:\n`);

      // Group by type for better display
      const groupsByType = new Map();
      orphanedGroups.forEach(group => {
        const key = `${group.name}-${group.type}`;
        if (!groupsByType.has(key)) {
          groupsByType.set(key, []);
        }
        groupsByType.get(key).push(group);
      });

      // Show what will be deleted
      for (const [key, groups] of groupsByType) {
        const [name, type] = key.split('-');
        console.log(`🗑️  "${name}" (${type}): ${groups.length} orphaned groups`);
        groups.forEach((group, index) => {
          console.log(`   ${index + 1}. ID: ${group.id} | Active: ${group.isActive}`);
        });
      }

      console.log(`\n⚠️  About to delete ${orphanedGroups.length} orphaned customization groups.`);
      console.log(`   These groups have no menu items attached and are safe to remove.\n`);

      // Delete all orphaned groups
      let deletedCount = 0;
      for (const group of orphanedGroups) {
        await tx.customizationGroup.delete({
          where: { id: group.id }
        });
        deletedCount++;
        console.log(`   ✅ Deleted: ${group.name} (${group.type}) - ID: ${group.id}`);
      }

      console.log(`\n🎉 Successfully deleted ${deletedCount} orphaned customization groups!`);
    });

    // Verify cleanup
    console.log('\n🔍 Verification - Checking for remaining orphaned groups...');
    
    const remainingOrphaned = await prisma.customizationGroup.findMany({
      include: {
        _count: {
          select: { menuItemCustomizations: true }
        }
      },
      where: {
        menuItemCustomizations: {
          none: {}
        }
      }
    });

    if (remainingOrphaned.length === 0) {
      console.log('✅ Perfect! No orphaned groups remaining.');
    } else {
      console.log(`⚠️  ${remainingOrphaned.length} orphaned groups still remain (this shouldn't happen).`);
    }

    // Show final clean summary
    console.log('\n📊 Final Database Status:');
    const allGroups = await prisma.customizationGroup.findMany({
      include: {
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    const activeGroups = allGroups.filter(g => g._count.menuItemCustomizations > 0);
    const orphanedGroups2 = allGroups.filter(g => g._count.menuItemCustomizations === 0);

    console.log(`   ✅ Active customization groups: ${activeGroups.length}`);
    console.log(`   🗑️  Orphaned groups: ${orphanedGroups2.length}`);
    console.log(`   📋 Total groups: ${allGroups.length}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedGroups();
