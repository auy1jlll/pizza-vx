const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHotSubCustomizations() {
  try {
    console.log('🔍 Checking customization groups for Hot Subs...\n');

    // Get Hot Subs category
    const hotSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Hot Subs' }
    });

    if (!hotSubsCategory) {
      console.log('❌ Hot Subs category not found');
      return;
    }

    // Get a sample hot sub item to see its customizations
    const hotSubItem = await prisma.menuItem.findFirst({
      where: { categoryId: hotSubsCategory.id },
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

    if (!hotSubItem) {
      console.log('❌ No hot sub items found');
      return;
    }

    console.log(`📋 Sample Hot Sub Item: ${hotSubItem.name}`);
    console.log(`Number of customization groups: ${hotSubItem.customizationGroups.length}\n`);

    // Show all customization groups
    hotSubItem.customizationGroups.forEach((mcg, index) => {
      const group = mcg.customizationGroup;
      console.log(`${index + 1}. ${group.name} (${group.type})`);
      console.log(`   Description: ${group.description || 'N/A'}`);
      console.log(`   Required: ${mcg.isRequired}`);
      console.log(`   Max Selections: ${group.maxSelections || 'N/A'}`);
      console.log(`   Options: ${group.options.length}`);
      
      // Show first few options
      group.options.slice(0, 3).forEach(option => {
        console.log(`     • ${option.name} (+$${option.priceModifier})`);
      });
      if (group.options.length > 3) {
        console.log(`     ... and ${group.options.length - 3} more options`);
      }
      console.log('');
    });

    // Now check Sandwiches category
    console.log('🥪 Checking Sandwiches category...\n');
    
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found');
      return;
    }

    const sandwichItem = await prisma.menuItem.findFirst({
      where: { categoryId: sandwichesCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    if (sandwichItem) {
      console.log(`📋 Sample Sandwich Item: ${sandwichItem.name}`);
      console.log(`Number of customization groups: ${sandwichItem.customizationGroups.length}`);
      
      if (sandwichItem.customizationGroups.length === 0) {
        console.log('⚠️ No customization groups found for sandwiches');
      } else {
        sandwichItem.customizationGroups.forEach((mcg, index) => {
          console.log(`${index + 1}. ${mcg.customizationGroup.name}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHotSubCustomizations();
