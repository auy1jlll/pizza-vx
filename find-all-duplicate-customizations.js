const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findAllDuplicateCustomizations() {
  console.log('🔍 Finding ALL Duplicate Customization Connections...\n');

  try {
    // Get all menu items with their customization groups
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

    console.log(`📊 Checking ${allItems.length} menu items for duplicate customizations...\n`);

    let totalItemsWithDuplicates = 0;
    let totalDuplicateConnections = 0;
    let duplicateDetails = [];

    for (const item of allItems) {
      // Group customization connections by group ID to find duplicates
      const groupCounts = new Map();
      
      item.customizationGroups.forEach(cg => {
        const groupId = cg.customizationGroup.id;
        const groupName = cg.customizationGroup.name;
        const key = groupId; // Use just group ID as key
        
        if (!groupCounts.has(key)) {
          groupCounts.set(key, {
            groupName,
            groupType: cg.customizationGroup.type,
            connections: []
          });
        }
        groupCounts.get(key).connections.push(cg);
      });

      // Check for duplicates in this item
      let itemHasDuplicates = false;
      for (const [groupId, data] of groupCounts) {
        if (data.connections.length > 1) {
          if (!itemHasDuplicates) {
            console.log(`\n❌ ${item.category.name} → ${item.name}:`);
            itemHasDuplicates = true;
            totalItemsWithDuplicates++;
          }
          
          console.log(`   🔄 "${data.groupName}" (${data.groupType}) appears ${data.connections.length} times:`);
          data.connections.forEach((conn, index) => {
            console.log(`      ${index + 1}. Connection ID: ${conn.id} | Required: ${conn.isRequired} | Sort: ${conn.sortOrder} | Created: ${conn.createdAt?.toISOString()?.substring(0, 19)}`);
          });
          
          totalDuplicateConnections += data.connections.length - 1;
          
          // Store for fixing
          duplicateDetails.push({
            itemId: item.id,
            itemName: item.name,
            categoryName: item.category.name,
            groupId,
            groupName: data.groupName,
            groupType: data.groupType,
            connections: data.connections
          });
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Items with duplicate connections: ${totalItemsWithDuplicates}`);
    console.log(`   Total duplicate connections to remove: ${totalDuplicateConnections}`);

    if (totalDuplicateConnections === 0) {
      console.log(`\n✅ NO DUPLICATES FOUND! All menu items have unique customization connections.`);
      return;
    }

    // Group duplicates by customization group type for analysis
    console.log(`\n📋 Breakdown by Customization Group Type:`);
    const dupesByType = new Map();
    duplicateDetails.forEach(dupe => {
      const key = `${dupe.groupName} (${dupe.groupType})`;
      if (!dupesByType.has(key)) {
        dupesByType.set(key, []);
      }
      dupesByType.get(key).push(dupe);
    });

    for (const [groupTypeKey, dupes] of dupesByType) {
      console.log(`   🔄 ${groupTypeKey}: ${dupes.length} items affected`);
      dupes.forEach(dupe => {
        console.log(`      - ${dupe.categoryName} → ${dupe.itemName} (${dupe.connections.length} duplicates)`);
      });
    }

    console.log(`\n🚨 FOUND ${totalDuplicateConnections} DUPLICATE CONNECTIONS that need to be removed!`);
    console.log(`   Run the fix script to clean these up.`);

    return duplicateDetails;

  } catch (error) {
    console.error('❌ Error finding duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findAllDuplicateCustomizations();
