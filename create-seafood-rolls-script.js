const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSeafoodRolls() {
  try {
    console.log('Creating Seafood Rolls category...');
    
    // 1. Create Seafood Rolls category
    const seafoodRollsCategory = await prisma.menuCategory.create({
      data: {
        name: 'Seafood Rolls',
        slug: 'seafood-rolls',
        description: 'Fresh seafood rolls served with your choice of sides',
        isActive: true,
        sortOrder: 7
      }
    });

    console.log(`✓ Created category: ${seafoodRollsCategory.name}`);

    // 2. Create customization groups for seafood rolls
    
    // Fries or Onion Rings group
    const sidesGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodRollsCategory.id,
        name: 'Select Fries or Onion Rings',
        description: 'Choose your side',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    // Condiments group (free)
    const condimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodRollsCategory.id,
        name: 'Select Condiment',
        description: 'Choose your condiments (free)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 2
      }
    });

    // Extra condiments group ($0.50 each)
    const extraCondimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodRollsCategory.id,
        name: 'Extra Condiments',
        description: 'Add extra condiments (+$0.50 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    console.log('✓ Created 3 customization groups');

    // 3. Create customization options

    // Sides options (free)
    const sidesOptions = [
      { name: 'Onion Rings', priceModifier: 0 },
      { name: 'French Fries', priceModifier: 0 }
    ];

    for (const option of sidesOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: sidesGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'French Fries',
          isActive: true
        }
      });
    }

    // Free condiments options
    const freeCondiments = [
      'Ketchup', 'Mayonnaise', 'Cocktail Sauce', 'Tartar Sauce'
    ];

    for (const condiment of freeCondiments) {
      await prisma.customizationOption.create({
        data: {
          groupId: condimentsGroup.id,
          name: condiment,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Extra condiments options ($0.50 each)
    const extraCondiments = [
      'Extra Cocktail', 'Extra Tartar'
    ];

    for (const condiment of extraCondiments) {
      await prisma.customizationOption.create({
        data: {
          groupId: extraCondimentsGroup.id,
          name: condiment,
          priceModifier: 0.50,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    console.log('✓ Created customization options');

    // 4. Create menu items
    const seafoodRollItems = [
      {
        name: 'Native Clams Roll',
        description: 'Locally sourced native clams on a bed of French fries or Onion rings',
        basePrice: 32.00
      },
      {
        name: 'Scallop Roll',
        description: 'Scallops locally sourced on a bed of French fries or Onion Rings',
        basePrice: 32.00
      },
      {
        name: 'Strip Clams Roll',
        description: 'Fresh strip clams on a roll with your choice of sides',
        basePrice: 17.50
      },
      {
        name: 'Shrimp Roll',
        description: 'Locally sourced shrimps on a bed of French fries or Onion Rings',
        basePrice: 19.50
      },
      {
        name: 'Lobster Roll',
        description: 'Fresh New England Lobster roll with an option of Onion Rings or French fries (Seasonal***)',
        basePrice: 40.00
      },
      {
        name: 'Tuna Roll',
        description: 'Tuna Salad on a roll with an option of onion rings or french fries',
        basePrice: 12.99
      },
      {
        name: 'Crab Meat Roll',
        description: 'Crab meat on a roll with option of Fries or Onion Rings',
        basePrice: 12.99
      }
    ];

    const createdItems = [];
    for (let i = 0; i < seafoodRollItems.length; i++) {
      const item = seafoodRollItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: seafoodRollsCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isActive: true,
          isAvailable: true,
          sortOrder: i + 1
        }
      });
      createdItems.push(menuItem);
      console.log(`✓ Created item: ${item.name} - $${item.basePrice}`);
    }

    // 5. Link menu items to customization groups
    for (const item of createdItems) {
      // All seafood rolls get sides selection (required)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: sidesGroup.id,
          isRequired: true,
          sortOrder: 1
        }
      });

      // All seafood rolls get free condiments (optional)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: condimentsGroup.id,
          isRequired: false,
          sortOrder: 2
        }
      });

      // All seafood rolls get extra condiments (optional, paid)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: extraCondimentsGroup.id,
          isRequired: false,
          sortOrder: 3
        }
      });
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Seafood Rolls category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${seafoodRollsCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Customization groups: 3`);
    console.log(`   - All items get: Sides (required), Free condiments (optional), Extra condiments (paid)`);

  } catch (error) {
    console.error('❌ Error creating seafood rolls:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeafoodRolls();
