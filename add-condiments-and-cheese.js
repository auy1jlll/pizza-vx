const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCondimentsAndCheeseCustomizations() {
  console.log('🧄 Adding Condiments and Cheese Customizations...\n');

  try {
    // Create Condiments customization group
    console.log('🥄 Creating Condiments customization group...');
    const condimentsGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Condiments',
        description: 'Choose your condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null, // Allow multiple selections
        sortOrder: 2,
        isActive: true
      }
    });

    // Create condiment options
    const condimentOptions = [
      { name: 'Horseradish', price: 0, sortOrder: 1 },
      { name: 'Mayonnaise', price: 0, sortOrder: 2 },
      { name: 'Mustard', price: 0, sortOrder: 3 },
      { name: 'Ranch', price: 0, sortOrder: 4 },
      { name: 'Spicy Mustard', price: 0, sortOrder: 5 },
      { name: 'Special BBQ Sauce', price: 0, sortOrder: 6 }
    ];

    for (const option of condimentOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: condimentsGroup.id,
          name: option.name,
          priceModifier: option.price,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: option.sortOrder
        }
      });
    }

    console.log(`✅ Created Condiments group with ${condimentOptions.length} options`);

    // Create Add Cheese customization group
    console.log('\n🧀 Creating Add Cheese customization group...');
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Add Cheese',
        description: 'Add cheese for $0.75',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null, // Allow multiple selections
        sortOrder: 3,
        isActive: true
      }
    });

    // Create cheese options
    const cheeseOptions = [
      { name: 'Blue Cheese', price: 0.75, sortOrder: 1 },
      { name: 'American Cheese', price: 0.75, sortOrder: 2 },
      { name: 'Provolone', price: 0.75, sortOrder: 3 },
      { name: 'Swiss', price: 0.75, sortOrder: 4 }
    ];

    for (const option of cheeseOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: cheeseGroup.id,
          name: option.name,
          priceModifier: option.price,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: option.sortOrder
        }
      });
    }

    console.log(`✅ Created Add Cheese group with ${cheeseOptions.length} options`);

    // Find all Hot Subs
    console.log('\n🔍 Finding Hot Subs and Sandwiches...');
    const hotSubs = await prisma.menuItem.findMany({
      where: {
        category: {
          name: 'Hot Subs'
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    // Find all Sandwiches (assuming they might be in a different category)
    const sandwiches = await prisma.menuItem.findMany({
      where: {
        OR: [
          {
            category: {
              name: {
                contains: 'Sandwich',
                mode: 'insensitive'
              }
            }
          },
          {
            name: {
              contains: 'Sandwich',
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true
      }
    });

    const allItems = [...hotSubs, ...sandwiches];
    console.log(`📋 Found ${hotSubs.length} Hot Subs and ${sandwiches.length} Sandwiches (${allItems.length} total)`);

    // Add customization groups to all items
    console.log('\n🔗 Adding customization groups to items...');
    
    for (const item of allItems) {
      // Add Condiments group
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: condimentsGroup.id,
          isRequired: false,
          sortOrder: 2
        }
      });

      // Add Cheese group
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: cheeseGroup.id,
          isRequired: false,
          sortOrder: 3
        }
      });

      console.log(`✅ Added customizations to: ${item.name}`);
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🥄 Condiments Group: ${condimentOptions.length} options (Free)`);
    condimentOptions.forEach((opt, i) => {
      console.log(`   ${i + 1}. ${opt.name} (Free)`);
    });
    
    console.log(`\n🧀 Add Cheese Group: ${cheeseOptions.length} options ($0.75 each)`);
    cheeseOptions.forEach((opt, i) => {
      console.log(`   ${i + 1}. ${opt.name} (+$0.75)`);
    });

    console.log(`\n📋 Applied to ${allItems.length} items:`);
    console.log(`   🔥 Hot Subs: ${hotSubs.length} items`);
    console.log(`   🥪 Sandwiches: ${sandwiches.length} items`);

    console.log('\n🎉 Condiments and Cheese customizations added successfully!');

  } catch (error) {
    console.error('❌ Error adding customizations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCondimentsAndCheeseCustomizations();
