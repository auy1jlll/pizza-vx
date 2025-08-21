const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDinnerCustomizationGroup() {
  try {
    console.log('Creating Dinner Customization group for Dinner Plate category...');

    // Find the Dinner Plate category
    const dinnerPlateCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Dinner Plate' }
    });

    if (!dinnerPlateCategory) {
      console.log('❌ Dinner Plate category not found. Please create it first.');
      return;
    }

    console.log(`✓ Found Dinner Plate category: ${dinnerPlateCategory.id}`);

    // Create the Dinner Customization group
    const dinnerCustomizationGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Dinner Customization',
        type: 'SINGLE_SELECT',
        isRequired: true,
        categoryId: dinnerPlateCategory.id,
        sortOrder: 1,
        options: {
          create: [
            {
              name: 'All Fries',
              priceModifier: 0, // No additional cost
              priceType: 'FLAT',
              sortOrder: 1
            },
            {
              name: 'All Onion Rings',
              priceModifier: 0, // No additional cost
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Fries & Rings',
              priceModifier: 0, // No additional cost (this is the default combination)
              priceType: 'FLAT',
              sortOrder: 3
            },
            {
              name: 'Pasta Salad or Coleslaw',
              priceModifier: 0, // No additional cost
              priceType: 'FLAT',
              sortOrder: 4
            }
          ]
        }
      }
    });

    console.log(`✓ Created Dinner Customization group: ${dinnerCustomizationGroup.id}`);

    // Get all dinner plate menu items to link the customization group
    const dinnerPlateItems = await prisma.menuItem.findMany({
      where: { categoryId: dinnerPlateCategory.id }
    });

    console.log(`Found ${dinnerPlateItems.length} dinner plate items to link customization group to`);

    // Link the customization group to all dinner plate items (except Fish 'n Chips which has its own setup)
    for (const item of dinnerPlateItems) {
      // Skip Fish 'n Chips as it has a different side setup
      if (item.name === 'Fish \'n Chips') {
        console.log(`  - Skipping ${item.name} (has its own side setup)`);
        continue;
      }

      // Check if this customization group is already linked
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: item.id,
          customizationGroupId: dinnerCustomizationGroup.id
        }
      });

      if (!existingLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: dinnerCustomizationGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`  ✓ Linked to: ${item.name}`);
      } else {
        console.log(`  - Already linked to: ${item.name}`);
      }
    }

    console.log('\n🎉 Dinner Customization group created successfully!');
    console.log('Side Options (Single-Select, Required, All Free):');
    console.log('  1. All Fries - Replace fries & rings with extra fries');
    console.log('  2. All Onion Rings - Replace fries & rings with extra onion rings');
    console.log('  3. Fries & Rings - Standard combination (default)');
    console.log('  4. Pasta Salad or Coleslaw - Choose one as your side');
    console.log('\nAll customization options are free of charge.');
    console.log('Note: Fish \'n Chips is not included as it has its own unique setup.');

  } catch (error) {
    console.error('Error creating Dinner Customization group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDinnerCustomizationGroup();
