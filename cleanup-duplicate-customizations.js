const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicateCustomizations() {
  console.log('🧹 Starting Duplicate Customization Groups Cleanup...\n');

  try {
    await prisma.$transaction(async (tx) => {
      
      // 1. Handle Size Groups (12 duplicates)
      console.log('📏 Cleaning up Size groups...');
      const sizeGroups = await tx.customizationGroup.findMany({
        where: { 
          name: 'Size',
          type: 'SINGLE_SELECT'
        },
        include: {
          _count: {
            select: { menuItemCustomizations: true }
          }
        },
        orderBy: { _count: { menuItemCustomizations: 'desc' } }
      });

      if (sizeGroups.length > 1) {
        const keepGroup = sizeGroups[0]; // Keep the most used one
        const duplicateGroups = sizeGroups.slice(1);
        
        console.log(`   ✅ Keeping: Size group ${keepGroup.id} (used by ${keepGroup._count.menuItemCustomizations} items)`);
        console.log(`   🗑️  Removing: ${duplicateGroups.length} duplicate groups`);

        // Move all connections to the main group
        for (const dupGroup of duplicateGroups) {
          console.log(`   🔄 Migrating ${dupGroup._count.menuItemCustomizations} connections from ${dupGroup.id}...`);
          
          // Get all menu items connected to this duplicate
          const connections = await tx.menuItemCustomization.findMany({
            where: { customizationGroupId: dupGroup.id }
          });

          // For each connection, check if the main group is already connected
          for (const connection of connections) {
            const existingConnection = await tx.menuItemCustomization.findFirst({
              where: {
                menuItemId: connection.menuItemId,
                customizationGroupId: keepGroup.id
              }
            });

            if (!existingConnection) {
              // Create connection to main group
              await tx.menuItemCustomization.create({
                data: {
                  menuItemId: connection.menuItemId,
                  customizationGroupId: keepGroup.id,
                  isRequired: connection.isRequired,
                  sortOrder: connection.sortOrder
                }
              });
            }

            // Delete the duplicate connection
            await tx.menuItemCustomization.delete({
              where: { id: connection.id }
            });
          }

          // Delete the duplicate group
          await tx.customizationGroup.delete({
            where: { id: dupGroup.id }
          });
        }
      }

      // 2. Handle Bread Type Groups (3 duplicates)
      console.log('\n🍞 Cleaning up Bread Type groups...');
      const breadGroups = await tx.customizationGroup.findMany({
        where: { 
          name: 'Bread Type',
          type: 'SINGLE_SELECT'
        },
        include: {
          _count: {
            select: { menuItemCustomizations: true }
          }
        },
        orderBy: { _count: { menuItemCustomizations: 'desc' } }
      });

      if (breadGroups.length > 1) {
        const keepGroup = breadGroups[0];
        const duplicateGroups = breadGroups.slice(1);
        
        console.log(`   ✅ Keeping: Bread Type group ${keepGroup.id} (used by ${keepGroup._count.menuItemCustomizations} items)`);
        console.log(`   🗑️  Removing: ${duplicateGroups.length} duplicate groups`);

        for (const dupGroup of duplicateGroups) {
          // Since these have 0 items, just delete them
          await tx.customizationGroup.delete({
            where: { id: dupGroup.id }
          });
        }
      }

      // 3. Handle Premium Toppings Groups (2 duplicates)
      console.log('\n🍕 Cleaning up Premium Toppings groups...');
      const toppingsGroups = await tx.customizationGroup.findMany({
        where: { 
          name: 'Premium Toppings',
          type: 'MULTI_SELECT'
        },
        include: {
          _count: {
            select: { menuItemCustomizations: true }
          }
        },
        orderBy: { _count: { menuItemCustomizations: 'desc' } }
      });

      if (toppingsGroups.length > 1) {
        const keepGroup = toppingsGroups[0];
        const duplicateGroups = toppingsGroups.slice(1);
        
        console.log(`   ✅ Keeping: Premium Toppings group ${keepGroup.id} (used by ${keepGroup._count.menuItemCustomizations} items)`);
        console.log(`   🗑️  Removing: ${duplicateGroups.length} duplicate groups`);

        for (const dupGroup of duplicateGroups) {
          // This one has 0 items, just delete it
          await tx.customizationGroup.delete({
            where: { id: dupGroup.id }
          });
        }
      }
    });

    console.log('\n✅ Cleanup completed successfully!');
    
    // 4. Verify the cleanup
    console.log('\n🔍 Verification - Checking remaining groups:');
    const finalGroups = await prisma.customizationGroup.findMany({
      where: {
        OR: [
          { name: 'Size' },
          { name: 'Bread Type' },
          { name: 'Premium Toppings' }
        ]
      },
      include: {
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    finalGroups.forEach(group => {
      console.log(`   ✅ ${group.name} (${group.type}): ID ${group.id} - ${group._count.menuItemCustomizations} items`);
    });

    // 5. Check seafood items specifically
    console.log('\n🦞 Checking Seafood Items After Cleanup:');
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { name: { contains: 'Seafood', mode: 'insensitive' } }
    });

    if (seafoodCategory) {
      const seafoodItems = await prisma.menuItem.findMany({
        where: { categoryId: seafoodCategory.id },
        include: {
          customizationGroups: {
            include: {
              customizationGroup: true
            }
          }
        }
      });

      seafoodItems.forEach(item => {
        const sizeGroups = item.customizationGroups.filter(cg => 
          cg.customizationGroup.name.toLowerCase().includes('size')
        );
        
        console.log(`   🐟 ${item.name}: ${sizeGroups.length} size group(s)`);
        if (sizeGroups.length > 1) {
          console.log(`      ⚠️  Still has multiple size groups!`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateCustomizations();
