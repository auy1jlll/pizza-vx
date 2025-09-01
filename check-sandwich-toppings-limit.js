const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSandwichToppingsLimit() {
  try {
    console.log('🔍 Checking toppings limit for Sandwiches...\n');

    // Get Sandwiches category
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found');
      return;
    }

    // Get a sample sandwich item with its customizations
    const sandwichItem = await prisma.menuItem.findFirst({
      where: { categoryId: sandwichesCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (!sandwichItem) {
      console.log('❌ No sandwich items found');
      return;
    }

    console.log(`📋 Sample Sandwich: ${sandwichItem.name}\n`);

    // Check each customization group
    sandwichItem.customizationGroups.forEach((mcg, index) => {
      const group = mcg.customizationGroup;
      console.log(`${index + 1}. ${group.name}`);
      console.log(`   Type: ${group.type}`);
      console.log(`   Max Selections: ${group.maxSelections || 'unlimited'}`);
      console.log(`   Required: ${mcg.isRequired}`);
      console.log(`   Options: ${group.options.length}`);
      
      // Special focus on Hot Sub Toppings
      if (group.name === 'Hot Sub Toppings') {
        console.log(`   🎯 TOPPINGS GROUP ANALYSIS:`);
        console.log(`      Max selections limit: ${group.maxSelections || 'NONE'}`);
        console.log(`      Should be: 5`);
        console.log(`      Status: ${group.maxSelections === 5 ? '✅ CORRECT' : '❌ NEEDS FIX'}`);
      }
      console.log('');
    });

    // Check the Hot Sub Toppings group specifically
    const toppingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Hot Sub Toppings' }
    });

    if (toppingsGroup) {
      console.log('🔍 Hot Sub Toppings Group Details:');
      console.log(`   ID: ${toppingsGroup.id}`);
      console.log(`   Name: ${toppingsGroup.name}`);
      console.log(`   Type: ${toppingsGroup.type}`);
      console.log(`   Max Selections: ${toppingsGroup.maxSelections || 'unlimited'}`);
      console.log(`   Description: ${toppingsGroup.description || 'N/A'}`);
      
      if (toppingsGroup.maxSelections !== 5) {
        console.log('\n⚠️ WARNING: Hot Sub Toppings group does not have max 5 selections limit!');
        console.log('This means sandwiches can select unlimited toppings instead of max 5.');
      } else {
        console.log('\n✅ Hot Sub Toppings correctly limited to 5 selections.');
      }
    }

  } catch (error) {
    console.error('❌ Error checking toppings limit:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSandwichToppingsLimit();
