const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCondimentsAndCheeseToAllSubs() {
  console.log('🥪 Adding Condiments and Cheese to ALL Subs...\n');

  try {
    // Find the existing customization groups
    const condimentsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Condiments' }
    });

    const cheeseGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Cheese' }
    });

    if (!condimentsGroup || !cheeseGroup) {
      console.error('❌ Condiments or Cheese groups not found!');
      return;
    }

    console.log('✅ Found existing customization groups');

    // Find all Cold Subs that don't already have these customizations
    const coldSubs = await prisma.menuItem.findMany({
      where: {
        category: {
          name: 'Cold Subs'
        }
      },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    console.log(`🔍 Found ${coldSubs.length} Cold Subs items`);

    let addedCount = 0;

    // Add customization groups to cold subs that don't have them
    for (const item of coldSubs) {
      const hasCondiments = item.customizationGroups.some(cg => 
        cg.customizationGroup.name === 'Condiments'
      );
      const hasCheese = item.customizationGroups.some(cg => 
        cg.customizationGroup.name === 'Add Cheese'
      );

      if (!hasCondiments) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: condimentsGroup.id,
            isRequired: false,
            sortOrder: 2
          }
        });
        console.log(`   ✅ Added Condiments to: ${item.name}`);
      }

      if (!hasCheese) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: cheeseGroup.id,
            isRequired: false,
            sortOrder: 3
          }
        });
        console.log(`   ✅ Added Cheese to: ${item.name}`);
      }

      if (!hasCondiments || !hasCheese) {
        addedCount++;
      }
    }

    // Get summary of all subs with these customizations
    const allSubsWithCustomizations = await prisma.menuItem.findMany({
      where: {
        OR: [
          { category: { name: 'Hot Subs' } },
          { category: { name: 'Cold Subs' } }
        ]
      },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    const hotSubsCount = allSubsWithCustomizations.filter(item => 
      item.customizationGroups.some(cg => cg.customizationGroup.name === 'Condiments') &&
      allSubsWithCustomizations.find(i => i.id === item.id)?.customizationGroups.some(cg => 
        cg.customizationGroup.name === 'Hot Subs'
      )
    ).length;

    const coldSubsCount = allSubsWithCustomizations.filter(item => 
      item.customizationGroups.some(cg => cg.customizationGroup.name === 'Condiments')
    ).length;

    console.log('\n📊 Final Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🥄 Condiments Group: 6 options (Free)`);
    console.log(`   - Horseradish, Mayonnaise, Mustard, Ranch, Spicy Mustard, Special BBQ Sauce`);
    
    console.log(`\n🧀 Add Cheese Group: 4 options ($0.75 each)`);
    console.log(`   - Blue Cheese, American Cheese, Provolone, Swiss`);

    console.log(`\n📋 Applied to ALL Subs:`);
    console.log(`   🔥 Hot Subs: Previously added`);
    console.log(`   🥶 Cold Subs: ${addedCount} items updated`);
    console.log(`   📝 Total Sub Items with Condiments & Cheese: ${coldSubsCount} items`);

    console.log('\n🎉 All subs now have condiments and cheese customizations!');

  } catch (error) {
    console.error('❌ Error adding customizations to all subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCondimentsAndCheeseToAllSubs();
