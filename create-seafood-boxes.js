const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSeafoodBoxes() {
  try {
    console.log('Creating Seafood Boxes category...');
    
    // 1. Create Seafood Boxes category
    const seafoodCategory = await prisma.menuCategory.create({
      data: {
        name: 'Seafood Boxes',
        slug: 'seafood-boxes',
        description: 'Fresh seafood boxes and platters',
        isActive: true,
        sortOrder: 6
      }
    });

    console.log(`✓ Created category: ${seafoodCategory.name}`);

    // 2. Create customization groups for seafood boxes
    
    // Size group for items that have small/large options
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodCategory.id,
        name: 'Size',
        description: 'Choose your size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    console.log('✓ Created size customization group');

    // 3. Create size options (we'll link them per item with different pricing)
    
    // Native Clams size options
    const clamSmallOption = await prisma.customizationOption.create({
      data: {
        groupId: sizeGroup.id,
        name: 'Small',
        priceModifier: 0, // Base price is for small
        priceType: 'FLAT',
        isDefault: true,
        isActive: true
      }
    });

    const clamLargeOption = await prisma.customizationOption.create({
      data: {
        groupId: sizeGroup.id,
        name: 'Large',
        priceModifier: 3.00, // +$3 for clams (32-29=3)
        priceType: 'FLAT',
        isActive: true
      }
    });

    console.log('✓ Created size options');

    // 4. Create menu items
    const seafoodItems = [
      {
        name: 'Native Clams',
        description: 'Select from a small or a large box of fresh clams',
        basePrice: 29.00, // Small price
        hasSize: true,
        largePriceModifier: 3.00 // Large is +$3
      },
      {
        name: 'Scallops',
        description: 'Fresh local scallops so yummy',
        basePrice: 27.00, // Small price
        hasSize: true,
        largePriceModifier: 3.00 // Large is +$3 (30-27=3)
      },
      {
        name: 'Strip Clams',
        description: 'Strip clams fried to perfection',
        basePrice: 16.00, // Small price
        hasSize: true,
        largePriceModifier: 5.00 // Large is +$5 (21-16=5)
      },
      {
        name: 'Shrimps',
        description: 'Select your size, small or large box of fresh shrimps',
        basePrice: 18.50, // Small price
        hasSize: true,
        largePriceModifier: 3.00 // Large is +$3 (21.50-18.50=3)
      },
      {
        name: 'Fish \'n Chips',
        description: 'A big plate of haddock fish on a bed of french fries',
        basePrice: 27.50,
        hasSize: false // No size options for this item
      }
    ];

    const createdItems = [];
    for (let i = 0; i < seafoodItems.length; i++) {
      const item = seafoodItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: seafoodCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isActive: true,
          isAvailable: true,
          sortOrder: i + 1
        }
      });
      createdItems.push({ ...menuItem, hasSize: item.hasSize, largePriceModifier: item.largePriceModifier });
      console.log(`✓ Created item: ${item.name} - $${item.basePrice}${item.hasSize ? ' (SM), $' + (item.basePrice + item.largePriceModifier) + ' (LG)' : ''}`);
    }

    // 5. Create item-specific customization groups and options for proper pricing
    for (const item of createdItems) {
      if (item.hasSize) {
        // Create item-specific size group
        const itemSizeGroup = await prisma.customizationGroup.create({
          data: {
            categoryId: seafoodCategory.id,
            name: 'Size',
            description: 'Choose your size',
            type: 'SINGLE_SELECT',
            isRequired: true,
            minSelections: 1,
            maxSelections: 1,
            sortOrder: 1
          }
        });

        // Create small option (base price)
        await prisma.customizationOption.create({
          data: {
            groupId: itemSizeGroup.id,
            name: 'Small',
            priceModifier: 0,
            priceType: 'FLAT',
            isDefault: true,
            isActive: true
          }
        });

        // Create large option with item-specific price modifier
        await prisma.customizationOption.create({
          data: {
            groupId: itemSizeGroup.id,
            name: 'Large',
            priceModifier: item.largePriceModifier,
            priceType: 'FLAT',
            isActive: true
          }
        });

        // Link item to its size group
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: itemSizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
      }
      // Fish 'n Chips doesn't get size customization
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Seafood Boxes category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${seafoodCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Items with size options: ${createdItems.filter(i => i.hasSize).length}`);
    console.log(`   - Items without size options: ${createdItems.filter(i => !i.hasSize).length}`);

  } catch (error) {
    console.error('❌ Error creating seafood boxes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeafoodBoxes();
