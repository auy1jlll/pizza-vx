const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addHotSubToppings() {
  try {
    console.log('🔥 Creating Hot Sub Toppings customization group...');

    // Create the hot toppings group
    const hotToppingsGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Hot Sub Toppings',
        description: 'Grilled and fresh toppings for hot subs',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 5, // Maximum 5 toppings per sub
        sortOrder: 10,
        isActive: true
      }
    });

    console.log(`✅ Created group: ${hotToppingsGroup.name} (ID: ${hotToppingsGroup.id})`);

    // Define the hot sub toppings with their sort order
    const hotToppings = [
      { name: 'Grilled Onions', sortOrder: 1 },
      { name: 'Grilled Mushrooms', sortOrder: 2 },
      { name: 'Grilled Bell Peppers', sortOrder: 3 },
      { name: 'Lettuce', sortOrder: 4 },
      { name: 'Tomatoes', sortOrder: 5 },
      { name: 'Fresh Onions', sortOrder: 6 },
      { name: 'Jalapeños', sortOrder: 7 } // Fixed spelling
    ];

    console.log('\n📝 Adding hot topping options...');

    // Create each hot topping option
    for (const topping of hotToppings) {
      const option = await prisma.customizationOption.create({
        data: {
          groupId: hotToppingsGroup.id,
          name: topping.name,
          description: `${topping.name.toLowerCase()} for your hot sub`,
          priceModifier: 0, // Free toppings
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: topping.sortOrder,
          maxQuantity: 1 // Each topping can only be selected once
        }
      });

      console.log(`  ✅ ${option.name}: $${option.priceModifier} (FREE)`);
    }

    console.log('\n🎯 Next step: Apply this group to hot subs...');
    
    // Get all hot subs
    const hotSubsCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'hot-subs' }
    });

    if (!hotSubsCategory) {
      console.log('❌ Hot subs category not found');
      return;
    }

    const hotSubs = await prisma.menuItem.findMany({
      where: { categoryId: hotSubsCategory.id }
    });

    console.log(`\n📋 Found ${hotSubs.length} hot subs to update:`);

    // Add hot toppings group to each hot sub
    for (const sub of hotSubs) {
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: sub.id,
          customizationGroupId: hotToppingsGroup.id,
          isRequired: false,
          sortOrder: 4 // After bread, condiments, and cheese
        }
      });

      console.log(`  ✅ Added toppings to: ${sub.name}`);
    }

    console.log('\n🎉 Hot Sub Toppings group created successfully!');
    console.log('\n📋 Summary:');
    console.log(`• Group: Hot Sub Toppings`);
    console.log(`• Toppings: ${hotToppings.length} options (all FREE)`);
    console.log(`• Max selections: 5 per sub`);
    console.log(`• Applied to: ${hotSubs.length} hot subs`);
    console.log(`• Mix of grilled and fresh toppings for hot subs`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

addHotSubToppings();
