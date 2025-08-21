const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ROAST_BEEF_ITEM_ID = 'cmeknoi2b000avk7stv0fw3qo';

async function createRoastBeefCustomizations() {
  try {
    console.log('Creating customization groups for Roast Beef Sandwich...');

    // Find the Signature Roast Beef category
    const category = await prisma.menuCategory.findFirst({
      where: { name: 'Signature Roast Beef' }
    });

    if (!category) {
      throw new Error('Signature Roast Beef category not found');
    }

    // 1. Size Group
    console.log('Creating Size customization group...');
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        categoryId: category.id,
        sortOrder: 1,
        options: {
          create: [
            {
              name: 'Junior',
              priceModifier: 0, // Default - no extra cost
              priceType: 'FLAT',
              isDefault: true,
              sortOrder: 1
            },
            {
              name: 'Regular',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Super',
              priceModifier: 200, // $2.00 in cents
              priceType: 'FLAT',
              sortOrder: 3
            }
          ]
        }
      }
    });

    // 2. Preparation Type Group
    console.log('Creating Preparation Type customization group...');
    const prepGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Preparation Type',
        type: 'SINGLE_SELECT',
        isRequired: true,
        categoryId: category.id,
        sortOrder: 2,
        options: {
          create: [
            {
              name: 'Normal',
              priceModifier: 0,
              priceType: 'FLAT',
              isDefault: true,
              sortOrder: 1
            },
            {
              name: 'Grilled',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 2
            }
          ]
        }
      }
    });

    // 3. Cheese/Toppings Group
    console.log('Creating Cheese & Toppings customization group...');
    const toppingsGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Cheese & Toppings',
        type: 'MULTI_SELECT',
        isRequired: false,
        categoryId: category.id,
        sortOrder: 3,
        options: {
          create: [
            // Cheese options - $1.00 each
            {
              name: 'American Cheese',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 1
            },
            {
              name: 'Swiss',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Provolone',
              priceModifier: 100, // $1.00 in cents
              priceType: 'FLAT',
              sortOrder: 3
            },
            // Free toppings - $0
            {
              name: 'Lettuce',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 4
            },
            {
              name: 'Tomatoes',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 5
            },
            {
              name: 'Onions',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 6
            },
            {
              name: 'Pickles',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 7
            },
            {
              name: 'Jalapeños',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 8
            }
          ]
        }
      }
    });

    // 4. Condiments Group
    console.log('Creating Condiments customization group...');
    const condimentsGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        categoryId: category.id,
        sortOrder: 4,
        options: {
          create: [
            {
              name: 'House BBQ',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 1
            },
            {
              name: 'Regular BBQ',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Mayo',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 3
            },
            {
              name: 'Mustard',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 4
            },
            {
              name: 'Horse Radish',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 5
            },
            {
              name: 'Spicy Mustard',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 6
            },
            {
              name: 'Sweet Mustard',
              priceModifier: 0,
              priceType: 'FLAT',
              sortOrder: 7
            }
          ]
        }
      }
    });

    // 5. Link all customization groups to the Roast Beef Sandwich
    console.log('Linking customization groups to Roast Beef Sandwich...');
    await prisma.menuItemCustomization.createMany({
      data: [
        {
          menuItemId: ROAST_BEEF_ITEM_ID,
          customizationGroupId: sizeGroup.id,
          isRequired: true,
          sortOrder: 1
        },
        {
          menuItemId: ROAST_BEEF_ITEM_ID,
          customizationGroupId: prepGroup.id,
          isRequired: true,
          sortOrder: 2
        },
        {
          menuItemId: ROAST_BEEF_ITEM_ID,
          customizationGroupId: toppingsGroup.id,
          isRequired: false,
          sortOrder: 3
        },
        {
          menuItemId: ROAST_BEEF_ITEM_ID,
          customizationGroupId: condimentsGroup.id,
          isRequired: false,
          sortOrder: 4
        }
      ]
    });

    console.log('✅ Successfully created all customization groups:');
    console.log(`   - Size (${sizeGroup.id}): Junior (free), Regular (+$1), Super (+$2)`);
    console.log(`   - Preparation Type (${prepGroup.id}): Normal, Grilled`);
    console.log(`   - Cheese & Toppings (${toppingsGroup.id}): 3 cheese options (+$1 each), 5 free toppings`);
    console.log(`   - Condiments (${condimentsGroup.id}): 7 condiment options (all free)`);
    console.log(`   - All groups linked to Roast Beef Sandwich (${ROAST_BEEF_ITEM_ID})`);

  } catch (error) {
    console.error('Error creating customization groups:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRoastBeefCustomizations();
