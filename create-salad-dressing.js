const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSaladDressingGroup() {
  try {
    console.log('Creating Salad-Dressing customization group...');

    // Find the Salads category
    const saladsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Salads' }
    });

    if (!saladsCategory) {
      console.log('❌ Salads category not found. Please create it first.');
      return;
    }

    console.log(`✓ Found Salads category: ${saladsCategory.id}`);

    // Create the Salad-Dressing customization group
    const dressingGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Salad-Dressing',
        type: 'SINGLE_SELECT',
        isRequired: false,
        categoryId: saladsCategory.id,
        sortOrder: 2,
        options: {
          create: [
            {
              name: 'Honey Mustard',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 1
            },
            {
              name: 'Balsamic Dressing',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Bleu Cheese',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 3
            },
            {
              name: 'Oil & Vinegar',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 4
            },
            {
              name: 'Caesar Dressing',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 5
            },
            {
              name: 'House Dressing',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 6
            },
            {
              name: 'Italian Dressing',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 7
            },
            {
              name: 'Ranch Dressing',
              priceModifier: 0, // $0.00 - free
              priceType: 'FLAT',
              sortOrder: 8
            }
          ]
        }
      }
    });

    console.log(`✓ Created Salad-Dressing customization group: ${dressingGroup.id}`);

    // Get all salad menu items to link the customization group
    const saladItems = await prisma.menuItem.findMany({
      where: { categoryId: saladsCategory.id }
    });

    console.log(`Found ${saladItems.length} salad items to link customization group to`);

    // Link the customization group to all salad items
    for (const item of saladItems) {
      // Check if this customization group is already linked
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: item.id,
          customizationGroupId: dressingGroup.id
        }
      });

      if (!existingLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: dressingGroup.id,
            isRequired: false,
            sortOrder: 2
          }
        });
        console.log(`  ✓ Linked to: ${item.name}`);
      } else {
        console.log(`  - Already linked to: ${item.name}`);
      }
    }

    console.log('\n🎉 Salad-Dressing customization group created successfully!');
    console.log('Dressing Options (Single-Select, Optional, All Free):');
    console.log('  - Honey Mustard');
    console.log('  - Balsamic Dressing');
    console.log('  - Bleu Cheese');
    console.log('  - Oil & Vinegar');
    console.log('  - Caesar Dressing');
    console.log('  - House Dressing');
    console.log('  - Italian Dressing');
    console.log('  - Ranch Dressing');
    console.log('\nAll dressing options are free of charge ($0.00).');
    console.log('Customers can choose one dressing per salad.');

  } catch (error) {
    console.error('Error creating Salad-Dressing group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSaladDressingGroup();
