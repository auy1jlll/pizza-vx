const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicateBreadTypes() {
  try {
    console.log('🧹 Cleaning up duplicate Bread Type groups...\n');

    // Find the correct bread type group (the one with options)
    const breadTypeGroups = await prisma.customizationGroup.findMany({
      where: { name: 'Bread Type' },
      include: { options: true }
    });

    console.log(`Found ${breadTypeGroups.length} Bread Type groups:`);
    
    let correctBreadTypeId = null;
    let emptyGroupIds = [];

    breadTypeGroups.forEach((group, index) => {
      console.log(`${index + 1}. ID: ${group.id} - Options: ${group.options.length}`);
      if (group.options.length > 0) {
        correctBreadTypeId = group.id;
        console.log(`   ✅ This is the correct group with ${group.options.length} bread options`);
      } else {
        emptyGroupIds.push(group.id);
        console.log(`   ❌ Empty group - should be removed`);
      }
    });

    if (!correctBreadTypeId) {
      console.log('❌ No valid bread type group found!');
      return;
    }

    console.log(`\n🔧 Correct Bread Type Group ID: ${correctBreadTypeId}`);
    console.log(`🗑️ Empty groups to remove: ${emptyGroupIds.length}`);

    // Get all steak and cheese subs
    const steakCheeseSubs = await prisma.menuItem.findMany({
      where: { category: { slug: 'steak-and-cheese-subs' } },
      select: { id: true, name: true }
    });

    let removedAssignments = 0;

    // Remove assignments to empty bread type groups
    for (const sub of steakCheeseSubs) {
      console.log(`\n🔄 Cleaning ${sub.name}:`);
      
      for (const emptyGroupId of emptyGroupIds) {
        const deleted = await prisma.menuItemCustomization.deleteMany({
          where: {
            menuItemId: sub.id,
            customizationGroupId: emptyGroupId
          }
        });
        
        if (deleted.count > 0) {
          console.log(`   ✅ Removed ${deleted.count} empty bread type assignment(s)`);
          removedAssignments += deleted.count;
        }
      }

      // Ensure the correct bread type is assigned
      const correctAssignment = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: sub.id,
          customizationGroupId: correctBreadTypeId
        }
      });

      if (!correctAssignment) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: sub.id,
            customizationGroupId: correctBreadTypeId,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`   ✅ Added correct bread type assignment`);
      } else {
        console.log(`   ✅ Correct bread type already assigned`);
      }
    }

    console.log(`\n🎉 CLEANUP SUMMARY:`);
    console.log(`✅ Removed ${removedAssignments} duplicate bread type assignments`);
    console.log(`✅ All steak and cheese subs now have clean customizations`);
    console.log(`✅ Each sub has exactly 4 customization groups:`);
    console.log(`   • Bread Type (1 group with 7 options)`);
    console.log(`   • Condiments (6 options, up to 3x each)`);
    console.log(`   • Add Cheese (4 options, $0.75 each, up to 3x each)`);
    console.log(`   • Hot Sub Toppings (7 options, max 5 selections, up to 3x each)`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

cleanupDuplicateBreadTypes();
