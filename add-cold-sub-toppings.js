const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addColdSubToppings() {
  try {
    console.log('🥬 Creating Cold Sub Toppings customization group...');

    // Create the toppings group
    const toppingsGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Cold Sub Toppings',
        description: 'Fresh vegetables and toppings for cold subs',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 5, // Maximum 5 toppings per sub
        sortOrder: 10,
        isActive: true
      }
    });

    console.log(`✅ Created group: ${toppingsGroup.name} (ID: ${toppingsGroup.id})`);

    // Define the toppings with their sort order
    const toppings = [
      { name: 'Lettuce', sortOrder: 1 },
      { name: 'Tomatoes', sortOrder: 2 },
      { name: 'Onions', sortOrder: 3 },
      { name: 'Pickles', sortOrder: 4 },
      { name: 'Hot Relish', sortOrder: 5 },
      { name: 'Banana Peppers', sortOrder: 6 },
      { name: 'Black Olives', sortOrder: 7 },
      { name: 'Cucumbers', sortOrder: 8 },
      { name: 'Fresh Mushrooms', sortOrder: 9 },
      { name: 'Green Peppers', sortOrder: 10 },
      { name: 'Red Onions', sortOrder: 11 },
      { name: 'Jalapeños', sortOrder: 12 } // Fixed spelling
    ];

    console.log('\n📝 Adding topping options...');

    // Create each topping option
    for (const topping of toppings) {
      const option = await prisma.customizationOption.create({
        data: {
          groupId: toppingsGroup.id,
          name: topping.name,
          description: `Fresh ${topping.name.toLowerCase()} for your sub`,
          priceModifier: 0, // Free toppings
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: topping.sortOrder,
          maxQuantity: 1 // Each topping can only be selected once (not like condiments)
        }
      });

      console.log(`  ✅ ${option.name}: $${option.priceModifier} (FREE)`);
    }

    console.log('\n🎯 Next step: Apply this group to cold subs...');
    
    // Get all cold subs
    const coldSubsCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'cold-subs' }
    });

    if (!coldSubsCategory) {
      console.log('❌ Cold subs category not found');
      return;
    }

    const coldSubs = await prisma.menuItem.findMany({
      where: { categoryId: coldSubsCategory.id }
    });

    console.log(`\n📋 Found ${coldSubs.length} cold subs to update:`);

    // Add toppings group to each cold sub
    for (const sub of coldSubs) {
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: sub.id,
          customizationGroupId: toppingsGroup.id,
          isRequired: false,
          sortOrder: 4 // After bread, condiments, and cheese
        }
      });

      console.log(`  ✅ Added toppings to: ${sub.name}`);
    }

    console.log('\n🎉 Cold Sub Toppings group created successfully!');
    console.log('\n📋 Summary:');
    console.log(`• Group: Cold Sub Toppings`);
    console.log(`• Toppings: ${toppings.length} options (all FREE)`);
    console.log(`• Max selections: 5 per sub`);
    console.log(`• Applied to: ${coldSubs.length} cold subs`);
    console.log(`• Customers can select up to 5 different vegetables/toppings`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

addColdSubToppings();
