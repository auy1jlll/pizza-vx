const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createHotSubSizeGroup() {
  try {
    console.log('Creating Hot Sub Size customization group...');

    // Find the Hot Subs category
    const hotSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Hot Subs' }
    });

    if (!hotSubsCategory) {
      throw new Error('Hot Subs category not found');
    }

    console.log(`Found Hot Subs category: ${hotSubsCategory.id}`);

    // Create the Hot Sub Size customization group
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Hot Sub Size & Style',
        type: 'SINGLE_SELECT',
        isRequired: true,
        categoryId: hotSubsCategory.id,
        sortOrder: 1,
        options: {
          create: [
            {
              name: 'SM-10"',
              priceModifier: 0, // No extra cost
              priceType: 'FLAT',
              isDefault: true,
              sortOrder: 1
            },
            {
              name: 'LG 12"',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'White Wrap',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 3
            },
            {
              name: 'Wheat Wrap',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 4
            },
            {
              name: 'Spinach Wrap',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 5
            },
            {
              name: 'Tomato-Basil Wrap',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 6
            }
          ]
        }
      }
    });

    console.log(`✓ Created Hot Sub Size customization group: ${sizeGroup.id}`);

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
          customizationGroupId: sizeGroup.id
        }
      });

      if (!existingLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`  ✓ Linked to: ${item.name}`);
      } else {
        console.log(`  - Already linked to: ${item.name}`);
      }
    }

    console.log('\n🎉 Hot Sub Size customization group created successfully!');
    console.log('Pricing:');
    console.log('  - SM-10": Base price (no extra cost)');
    console.log('  - LG 12": +$1.00');
    console.log('  - White Wrap: +$1.00');
    console.log('  - Wheat Wrap: +$1.00');
    console.log('  - Spinach Wrap: +$1.00');
    console.log('  - Tomato-Basil Wrap: +$1.00');
    console.log(`\nAll ${hotSubItems.length} Hot Sub items now have size/style options!`);

  } catch (error) {
    console.error('Error creating Hot Sub Size group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createHotSubSizeGroup();
