const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createHotSubToppingsGroup() {
  try {
    console.log('Creating Hot Sub Toppings customization group...');

    // Find the Hot Subs category
    const hotSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Hot Subs' }
    });

    if (!hotSubsCategory) {
      throw new Error('Hot Subs category not found');
    }

    console.log(`Found Hot Subs category: ${hotSubsCategory.id}`);

    // Create the Hot Sub Toppings customization group
    const toppingsGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Hot-Sub-Toppings',
        type: 'MULTI_SELECT',
        isRequired: false,
        categoryId: hotSubsCategory.id,
        sortOrder: 2, // After the size group
        options: {
          create: [
            {
              name: 'Provolone',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 1
            },
            {
              name: 'American Cheese',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Swiss Cheese',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 3
            },
            {
              name: 'Mozzarella Cheese',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 4
            }
          ]
        }
      }
    });

    console.log(`✓ Created Hot Sub Toppings customization group: ${toppingsGroup.id}`);

    // Get all Hot Sub menu items
    const hotSubItems = await prisma.menuItem.findMany({
      where: { categoryId: hotSubsCategory.id }
    });

    console.log(`Found ${hotSubItems.length} Hot Sub items to link customization group to`);

    // Link the customization group to all Hot Sub items
    for (const item of hotSubItems) {
      // Check if this customization group is already linked
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: item.id,
          customizationGroupId: toppingsGroup.id
        }
      });

      if (!existingLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: toppingsGroup.id,
            isRequired: false,
            sortOrder: 2 // After the size group
          }
        });
        console.log(`  ✓ Linked to: ${item.name}`);
      } else {
        console.log(`  - Already linked to: ${item.name}`);
      }
    }

    console.log('\n🎉 Hot Sub Toppings customization group created successfully!');
    console.log('Cheese Options (Multi-Select, Optional):');
    console.log('  - Provolone: +$1.00');
    console.log('  - American Cheese: +$1.00');
    console.log('  - Swiss Cheese: +$1.00');
    console.log('  - Mozzarella Cheese: +$1.00');
    console.log(`\nAll ${hotSubItems.length} Hot Sub items now have cheese topping options!`);
    console.log('Customers can select multiple cheese types for additional cost.');

  } catch (error) {
    console.error('Error creating Hot Sub Toppings group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createHotSubToppingsGroup();
