const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySandwichCustomizations() {
  try {
    console.log('🔍 Verifying Sandwich customizations...\n');

    // Get Sandwiches category
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found');
      return;
    }

    // Get all sandwich items with their customizations
    const sandwichItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichesCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`📋 Found ${sandwichItems.length} sandwich items\n`);

    // Check each item
    sandwichItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.basePrice}`);
      console.log(`   Customization Groups: ${item.customizationGroups.length}`);
      
      item.customizationGroups.forEach((mcg, groupIndex) => {
        const group = mcg.customizationGroup;
        console.log(`   ${groupIndex + 1}. ${group.name} (${group.type})`);
        console.log(`      Required: ${mcg.isRequired}`);
        console.log(`      Max Selections: ${group.maxSelections || 'unlimited'}`);
        console.log(`      Options: ${group.options.length}`);
        
        // Show a few options as examples
        const sampleOptions = group.options.slice(0, 3);
        sampleOptions.forEach(option => {
          console.log(`        • ${option.name} (+$${option.priceModifier})`);
        });
        if (group.options.length > 3) {
          console.log(`        ... and ${group.options.length - 3} more options`);
        }
      });
      console.log('');
    });

    // Summary
    console.log('📊 Summary:');
    const totalCustomizations = sandwichItems.reduce((sum, item) => sum + item.customizationGroups.length, 0);
    console.log(`   ✅ ${sandwichItems.length} sandwich items processed`);
    console.log(`   ✅ ${totalCustomizations} total customization connections`);
    console.log(`   ✅ Average ${(totalCustomizations / sandwichItems.length).toFixed(1)} customizations per item`);

    // Check that no Bread Type customizations exist
    const breadTypeGroups = sandwichItems.flatMap(item => 
      item.customizationGroups.filter(mcg => mcg.customizationGroup.name === 'Bread Type')
    );
    
    if (breadTypeGroups.length === 0) {
      console.log('   ✅ Confirmed: No Bread Type customizations (as requested)');
    } else {
      console.log(`   ⚠️ Found ${breadTypeGroups.length} Bread Type customizations (unexpected)`);
    }

    // Verify expected customization groups
    const expectedGroups = ['Hot Sub Toppings', 'Condiments', 'Add Cheese'];
    console.log('\n🔍 Checking for expected customization groups:');
    
    expectedGroups.forEach(groupName => {
      const itemsWithGroup = sandwichItems.filter(item =>
        item.customizationGroups.some(mcg => mcg.customizationGroup.name === groupName)
      );
      console.log(`   ${groupName}: ${itemsWithGroup.length}/${sandwichItems.length} items`);
    });

  } catch (error) {
    console.error('❌ Error verifying customizations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySandwichCustomizations();
