const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSeafoodRollsDuplicateSides() {
  console.log('🔧 Fixing Seafood Rolls Duplicate Side Selection Groups...\n');

  try {
    await prisma.$transaction(async (tx) => {
      
      // Get the two conflicting groups
      const chooseYourSideGroup = await tx.customizationGroup.findUnique({
        where: { id: 'cmf0l31z80000vk0s10ywj3zp' },
        include: { options: true, _count: { select: { menuItemCustomizations: true } } }
      });

      const seafoodRollSidesGroup = await tx.customizationGroup.findUnique({
        where: { id: 'cmf0lfe6w0001vkqgiubwi9uz' },
        include: { options: true, _count: { select: { menuItemCustomizations: true } } }
      });

      if (!chooseYourSideGroup || !seafoodRollSidesGroup) {
        console.log('❌ Could not find the conflicting groups');
        return;
      }

      console.log(`📋 Found conflicting groups:`);
      console.log(`   1. "${chooseYourSideGroup.name}" - ${chooseYourSideGroup._count.menuItemCustomizations} connections`);
      console.log(`      Options: ${chooseYourSideGroup.options.map(o => o.name).join(', ')}`);
      console.log(`   2. "${seafoodRollSidesGroup.name}" - ${seafoodRollSidesGroup._count.menuItemCustomizations} connections`);
      console.log(`      Options: ${seafoodRollSidesGroup.options.map(o => o.name).join(', ')}\n`);

      // We'll keep "Seafood Roll Sides" as it's more specific and required
      const keepGroup = seafoodRollSidesGroup;
      const removeGroup = chooseYourSideGroup;

      console.log(`✅ Decision: Keep "${keepGroup.name}" (more specific)`);
      console.log(`🗑️  Remove: "${removeGroup.name}" connections\n`);

      // Get all seafood roll items that have the group we're removing
      const seafoodCategory = await tx.menuCategory.findFirst({
        where: { name: { contains: 'Seafood Rolls', mode: 'insensitive' } }
      });

      const seafoodItems = await tx.menuItem.findMany({
        where: { categoryId: seafoodCategory.id },
        include: {
          customizationGroups: {
            where: { customizationGroupId: removeGroup.id }
          }
        }
      });

      console.log(`🔍 Found ${seafoodItems.length} seafood items with "${removeGroup.name}" group\n`);

      // Remove the duplicate connections from seafood items
      let removedConnections = 0;
      for (const item of seafoodItems) {
        for (const connection of item.customizationGroups) {
          console.log(`   🗑️  Removing "${removeGroup.name}" from ${item.name}`);
          await tx.menuItemCustomization.delete({
            where: { id: connection.id }
          });
          removedConnections++;
        }
      }

      // Check if the removeGroup has any other connections (non-seafood items)
      const remainingConnections = await tx.menuItemCustomization.findMany({
        where: { customizationGroupId: removeGroup.id },
        include: { menuItem: { include: { category: true } } }
      });

      if (remainingConnections.length > 0) {
        console.log(`\n⚠️  "${removeGroup.name}" is still connected to ${remainingConnections.length} other items:`);
        remainingConnections.forEach(conn => {
          console.log(`   - ${conn.menuItem.category.name} → ${conn.menuItem.name}`);
        });
        console.log(`   These connections will be kept as they're not seafood rolls.\n`);
      } else {
        console.log(`\n✅ "${removeGroup.name}" has no other connections.\n`);
      }

      console.log(`📊 Summary:`);
      console.log(`   Removed connections: ${removedConnections}`);
      console.log(`   Remaining connections for "${removeGroup.name}": ${remainingConnections.length}`);
      console.log(`   Kept group: "${keepGroup.name}" (ID: ${keepGroup.id})`);

    });

    // Verify the fix
    console.log('\n🔍 Verification - Checking seafood rolls after fix...\n');
    
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { name: { contains: 'Seafood Rolls', mode: 'insensitive' } }
    });

    const verifyItems = await prisma.menuItem.findMany({
      where: { categoryId: seafoodCategory.id },
      include: {
        customizationGroups: {
          include: { customizationGroup: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    verifyItems.forEach(item => {
      const sideGroups = item.customizationGroups.filter(cg => 
        cg.customizationGroup.name.toLowerCase().includes('side') ||
        cg.customizationGroup.name.toLowerCase().includes('fries') ||
        cg.customizationGroup.name.toLowerCase().includes('onion')
      );

      if (sideGroups.length === 1) {
        console.log(`✅ ${item.name}: 1 side group (${sideGroups[0].customizationGroup.name})`);
      } else if (sideGroups.length === 0) {
        console.log(`⚠️  ${item.name}: No side groups`);
      } else {
        console.log(`❌ ${item.name}: ${sideGroups.length} side groups (STILL DUPLICATED)`);
        sideGroups.forEach((sg, index) => {
          console.log(`   ${index + 1}. ${sg.customizationGroup.name}`);
        });
      }
    });

    console.log('\n✅ Seafood rolls side duplication fix completed!');

  } catch (error) {
    console.error('❌ Error fixing seafood rolls duplicates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixSeafoodRollsDuplicateSides();
