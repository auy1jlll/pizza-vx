const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkForDuplicatedCustomizations() {
  console.log('🔍 Checking for Duplicated Customizations After Cleanup...\n');

  try {
    // 1. Check for menu items with duplicate customization groups
    console.log('🔍 Looking for menu items with duplicate customization groups...\n');

    const allItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    let totalDuplicateConnections = 0;
    let itemsWithDuplicates = 0;

    for (const item of allItems) {
      // Group customization groups by their ID to find duplicates
      const groupCounts = new Map();
      
      item.customizationGroups.forEach(cg => {
        const groupId = cg.customizationGroup.id;
        const groupName = cg.customizationGroup.name;
        const key = `${groupId}-${groupName}`;
        
        if (!groupCounts.has(key)) {
          groupCounts.set(key, []);
        }
        groupCounts.get(key).push(cg);
      });

      // Check for duplicates
      let itemHasDuplicates = false;
      for (const [key, connections] of groupCounts) {
        if (connections.length > 1) {
          if (!itemHasDuplicates) {
            console.log(`\n❌ ${item.category.name} → ${item.name}:`);
            itemHasDuplicates = true;
            itemsWithDuplicates++;
          }
          
          const groupName = connections[0].customizationGroup.name;
          console.log(`   🔄 "${groupName}" appears ${connections.length} times:`);
          connections.forEach((conn, index) => {
            console.log(`      ${index + 1}. Connection ID: ${conn.id} | Required: ${conn.isRequired} | Sort: ${conn.sortOrder}`);
          });
          
          totalDuplicateConnections += connections.length - 1;
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Items with duplicate connections: ${itemsWithDuplicates}`);
    console.log(`   Total duplicate connections: ${totalDuplicateConnections}`);

    // 2. Check for orphaned customization groups (groups with no connections)
    console.log(`\n🔍 Checking for orphaned customization groups...\n`);

    const allGroups = await prisma.customizationGroup.findMany({
      include: {
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    const orphanedGroups = allGroups.filter(group => group._count.menuItemCustomizations === 0);
    
    if (orphanedGroups.length > 0) {
      console.log(`⚠️  Found ${orphanedGroups.length} orphaned customization groups:`);
      orphanedGroups.forEach(group => {
        console.log(`   - ${group.name} (${group.type}) - ID: ${group.id}`);
      });
    } else {
      console.log(`✅ No orphaned customization groups found.`);
    }

    // 3. Show detailed breakdown by customization group type
    console.log(`\n📋 Detailed Breakdown by Group Type:\n`);

    const groupsByType = new Map();
    allGroups.forEach(group => {
      const key = `${group.name}-${group.type}`;
      if (!groupsByType.has(key)) {
        groupsByType.set(key, []);
      }
      groupsByType.get(key).push(group);
    });

    for (const [key, groups] of groupsByType) {
      const [name, type] = key.split('-');
      if (groups.length > 1) {
        console.log(`⚠️  "${name}" (${type}): ${groups.length} groups`);
        groups.forEach((group, index) => {
          console.log(`   ${index + 1}. ID: ${group.id} | Used by: ${group._count.menuItemCustomizations} items`);
        });
      } else {
        const group = groups[0];
        console.log(`✅ "${name}" (${type}): 1 group (${group._count.menuItemCustomizations} items)`);
      }
    }

    // 4. If we found duplicates, offer to fix them
    if (totalDuplicateConnections > 0) {
      console.log(`\n🚨 FOUND ${totalDuplicateConnections} DUPLICATE CONNECTIONS!`);
      console.log(`   This means some menu items have the same customization group attached multiple times.`);
      console.log(`   This was likely caused by the migration script logic.`);
      console.log(`\n💡 Recommendation: Run a cleanup script to remove duplicate connections.`);
    } else {
      console.log(`\n✅ NO DUPLICATE CONNECTIONS FOUND!`);
      console.log(`   All menu items have unique customization group connections.`);
    }

  } catch (error) {
    console.error('❌ Error checking for duplications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkForDuplicatedCustomizations();
