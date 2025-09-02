const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ensureOneSizePerMenuItem() {
  console.log('🔧 Ensuring Each Menu Item Has ≤ 1 Size Customization Group...\n');

  try {
    await prisma.$transaction(async (tx) => {
      
      // 1. Find all menu items with multiple size groups
      console.log('🔍 Finding menu items with multiple size groups...');
      
      const allItems = await tx.menuItem.findMany({
        include: {
          category: true,
          customizationGroups: {
            include: {
              customizationGroup: true
            }
          }
        }
      });

      let itemsFixed = 0;
      let duplicatesRemoved = 0;

      for (const item of allItems) {
        const sizeGroups = item.customizationGroups.filter(cg => 
          cg.customizationGroup.name.toLowerCase().includes('size')
        );

        if (sizeGroups.length > 1) {
          console.log(`\n⚠️  ${item.category.name} → ${item.name}: Has ${sizeGroups.length} size groups`);
          
          // Keep the first one (or the most commonly used one)
          const keepGroup = sizeGroups[0];
          const removeGroups = sizeGroups.slice(1);
          
          console.log(`   ✅ Keeping: ${keepGroup.customizationGroup.name} (ID: ${keepGroup.customizationGroup.id})`);
          console.log(`   🗑️  Removing: ${removeGroups.length} duplicate connections`);

          // Remove the duplicate connections
          for (const removeGroup of removeGroups) {
            await tx.menuItemCustomization.delete({
              where: { id: removeGroup.id }
            });
            duplicatesRemoved++;
          }

          itemsFixed++;
        } else if (sizeGroups.length === 1) {
          // This is good - exactly 1 size group
          console.log(`✅ ${item.category.name} → ${item.name}: Has 1 size group (correct)`);
        } else {
          // No size groups - this might be intentional for some items
          console.log(`ℹ️  ${item.category.name} → ${item.name}: No size groups`);
        }
      }

      console.log(`\n📊 Summary:`);
      console.log(`   Items fixed: ${itemsFixed}`);
      console.log(`   Duplicate connections removed: ${duplicatesRemoved}`);
    });

    // 2. Verification - check the results
    console.log('\n🔍 Verification - Checking all menu items after cleanup:');
    
    const allItemsAfter = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    let itemsWithMultipleSizes = 0;
    let itemsWithOneSize = 0;
    let itemsWithNoSize = 0;

    for (const item of allItemsAfter) {
      const sizeGroups = item.customizationGroups.filter(cg => 
        cg.customizationGroup.name.toLowerCase().includes('size')
      );

      if (sizeGroups.length > 1) {
        console.log(`❌ ${item.category.name} → ${item.name}: Still has ${sizeGroups.length} size groups!`);
        itemsWithMultipleSizes++;
      } else if (sizeGroups.length === 1) {
        itemsWithOneSize++;
      } else {
        itemsWithNoSize++;
      }
    }

    console.log(`\n✅ Final Results:`);
    console.log(`   Items with 1 size group: ${itemsWithOneSize}`);
    console.log(`   Items with 0 size groups: ${itemsWithNoSize}`);
    console.log(`   Items with multiple size groups: ${itemsWithMultipleSizes}`);

    if (itemsWithMultipleSizes === 0) {
      console.log(`\n🎉 SUCCESS! All menu items now have ≤ 1 size customization group!`);
    } else {
      console.log(`\n⚠️  WARNING: ${itemsWithMultipleSizes} items still have multiple size groups.`);
    }

    // 3. Show specific seafood items status
    console.log('\n🦞 Seafood Items Final Status:');
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
        
        if (sizeGroups.length === 1) {
          console.log(`   ✅ ${item.name}: 1 size group (${sizeGroups[0].customizationGroup.name})`);
        } else if (sizeGroups.length === 0) {
          console.log(`   ℹ️  ${item.name}: No size groups`);
        } else {
          console.log(`   ❌ ${item.name}: ${sizeGroups.length} size groups (STILL BROKEN)`);
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

ensureOneSizePerMenuItem();
