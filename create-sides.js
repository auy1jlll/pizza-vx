const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSidesCategory() {
  try {
    console.log('Creating Sides category and menu items with size options...');

    // Check if Sides category already exists
    let sidesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sides' }
    });

    if (!sidesCategory) {
      console.log('Creating Sides category...');
      sidesCategory = await prisma.menuCategory.create({
        data: {
          name: 'Sides',
          slug: 'sides',
          description: 'Classic accompaniments to any meal',
          isActive: true,
          sortOrder: 16
        }
      });
      console.log(`✓ Created Sides category: ${sidesCategory.id}`);
    } else {
      console.log(`✓ Found existing Sides category: ${sidesCategory.id}`);
    }

    // Create a Size customization group for sides
    let sizeGroup = await prisma.customizationGroup.findFirst({
      where: { 
        name: 'Side Size',
        categoryId: sidesCategory.id 
      }
    });

    if (!sizeGroup) {
      console.log('Creating Side Size customization group...');
      sizeGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Side Size',
          type: 'SINGLE_SELECT',
          isRequired: true,
          categoryId: sidesCategory.id,
          sortOrder: 1,
          options: {
            create: [
              {
                name: 'Small',
                priceModifier: 0, // Base price will be the small price
                priceType: 'FLAT',
                sortOrder: 1
              },
              {
                name: 'Large',
                priceModifier: 100, // Add $1.00 to base price (except pasta salad & cole slaw which add $4.00)
                priceType: 'FLAT',
                sortOrder: 2
              }
            ]
          }
        }
      });
      console.log(`✓ Created Side Size customization group: ${sizeGroup.id}`);
    } else {
      console.log(`✓ Found existing Side Size customization group: ${sizeGroup.id}`);
    }

    // Define the sides menu items with SMALL price as base price
    const sidesItems = [
      {
        name: 'French Fries',
        description: 'Crispy golden french fries',
        basePrice: 6.00, // Small price as base
        largePriceAdd: 1.00, // Large adds $1.00
        sortOrder: 1
      },
      {
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings',
        basePrice: 6.00, // Small price as base
        largePriceAdd: 1.00, // Large adds $1.00
        sortOrder: 2
      },
      {
        name: 'Pasta Salad',
        description: 'Fresh pasta salad with vegetables',
        basePrice: 5.00, // Small price as base
        largePriceAdd: 4.00, // Large adds $4.00
        sortOrder: 3
      },
      {
        name: 'Cole Slaw',
        description: 'Creamy traditional cole slaw',
        basePrice: 5.00, // Small price as base
        largePriceAdd: 4.00, // Large adds $4.00
        sortOrder: 4
      }
    ];

    console.log(`Creating ${sidesItems.length} sides menu items...`);
    console.log('📋 Pricing structure:');
    sidesItems.forEach(item => {
      const largePrice = item.basePrice + item.largePriceAdd;
      console.log(`   ${item.name}: Small $${item.basePrice.toFixed(2)} | Large $${largePrice.toFixed(2)}`);
    });
    console.log('');

    for (const item of sidesItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: sidesCategory.id
        }
      });

      if (existingItem) {
        console.log(`  - ${item.name} already exists, skipping...`);
        continue;
      }

      // Create the menu item with small price as base
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice, // Small price
          categoryId: sidesCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} - Small $${item.basePrice.toFixed(2)}`);

      // Link the size customization group to this item
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: menuItem.id,
          customizationGroupId: sizeGroup.id
        }
      });

      if (!existingLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: sizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`    ✓ Linked Size customization group`);
      }
    }

    // We need to create item-specific customization groups for proper pricing
    console.log('\nCreating item-specific size pricing...');
    
    for (const item of sidesItems) {
      const menuItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: sidesCategory.id
        }
      });

      if (!menuItem) continue;

      // Create item-specific size group
      const itemSizeGroupName = `${item.name} Size`;
      let itemSizeGroup = await prisma.customizationGroup.findFirst({
        where: { name: itemSizeGroupName }
      });

      if (!itemSizeGroup) {
        itemSizeGroup = await prisma.customizationGroup.create({
          data: {
            name: itemSizeGroupName,
            type: 'SINGLE_SELECT',
            isRequired: true,
            categoryId: sidesCategory.id,
            sortOrder: 1,
            options: {
              create: [
                {
                  name: 'Small',
                  priceModifier: 0, // No additional cost (base price)
                  priceType: 'FLAT',
                  sortOrder: 1
                },
                {
                  name: 'Large',
                  priceModifier: item.largePriceAdd * 100, // Convert to cents for storage
                  priceType: 'FLAT',
                  sortOrder: 2
                }
              ]
            }
          }
        });

        // Link this specific size group to the menu item
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: itemSizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });

        const largePrice = item.basePrice + item.largePriceAdd;
        console.log(`  ✓ Created ${itemSizeGroupName}: Small $${item.basePrice.toFixed(2)} | Large $${largePrice.toFixed(2)}`);
      }
    }

    console.log('\n🎉 Sides category and menu items created successfully!');
    console.log('\n🍟 Sides - Classic accompaniments to any meal:');
    console.log('');
    console.log('Item                Small Price    Large Price');
    console.log('─────────────────   ───────────    ───────────');
    sidesItems.forEach(item => {
      const largePrice = item.basePrice + item.largePriceAdd;
      console.log(`${item.name.padEnd(18)} $${item.basePrice.toFixed(2).padEnd(12)} $${largePrice.toFixed(2)}`);
    });

  } catch (error) {
    console.error('Error creating Sides category and items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSidesCategory();
