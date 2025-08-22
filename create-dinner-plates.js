const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDinnerPlates() {
  try {
    console.log('Creating Dinner Plates category...');
    
    // 1. Create Dinner Plates category
    const dinnerPlatesCategory = await prisma.menuCategory.create({
      data: {
        name: 'Dinner Plates',
        slug: 'dinner-plates',
        description: 'Complete dinner plates served with fries, onion rings, and choice of side',
        isActive: true,
        sortOrder: 4
      }
    });

    console.log(`✓ Created category: ${dinnerPlatesCategory.name}`);

    // 2. Create customization groups for dinner plates
    
    // Fries or Rings group
    const friesRingsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: dinnerPlatesCategory.id,
        name: 'Fries or Rings',
        description: 'Choose your potato side',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    // Side salad group
    const sideSaladGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: dinnerPlatesCategory.id,
        name: 'Side Salad',
        description: 'Choose your side salad',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2
      }
    });

    // Condiments group
    const condimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: dinnerPlatesCategory.id,
        name: 'Condiments',
        description: 'Choose your condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    // Free ingredients group
    const freeIngredientsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: dinnerPlatesCategory.id,
        name: 'Free Ingredients',
        description: 'Add free ingredients',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4
      }
    });

    // Paid ingredients group
    const paidIngredientsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: dinnerPlatesCategory.id,
        name: 'Extra Ingredients',
        description: 'Add extra ingredients (+$0.50 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 5
      }
    });

    console.log('✓ Created 5 customization groups');

    // 3. Create customization options

    // Fries or Rings options
    const friesRingsOptions = [
      { name: 'Fries + Onion Rings', priceModifier: 0 },
      { name: 'All French Fries', priceModifier: 0 },
      { name: 'All Onion Rings', priceModifier: 0 }
    ];

    for (const option of friesRingsOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: friesRingsGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'Fries + Onion Rings',
          isActive: true
        }
      });
    }

    // Side salad options
    const sideSaladOptions = [
      { name: 'Cole Slaw', priceModifier: 0 },
      { name: 'Pasta Salad', priceModifier: 0 }
    ];

    for (const option of sideSaladOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: sideSaladGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'Cole Slaw',
          isActive: true
        }
      });
    }

    // Condiments options (all free)
    const condimentsOptions = [
      'Buffalo', 'Duck Sauce', 'Ketchup', 'Marinara Sauce', 'Mayonnaise', 
      'Mustard', 'Special BBQ Sauce', 'Ranch', 'BBQ'
    ];

    for (const condiment of condimentsOptions) {
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

    // Free ingredients options
    const freeIngredients = [
      'Blue Cheese', 'Pickles', 'Onions', 'Tomatoes', 'Lettuce'
    ];

    for (const ingredient of freeIngredients) {
      await prisma.customizationOption.create({
        data: {
          groupId: freeIngredientsGroup.id,
          name: ingredient,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Paid ingredients options ($0.50 each)
    const paidIngredients = [
      'Extra Blue Cheese', 'Extra Buffalo', 'Extra Marinara Sauce', 
      'American Cheese', 'Extra Special BBQ Sauce', 'Provolone Cheese', 
      'Swiss Cheese', 'Extra Ranch'
    ];

    for (const ingredient of paidIngredients) {
      await prisma.customizationOption.create({
        data: {
          groupId: paidIngredientsGroup.id,
          name: ingredient,
          priceModifier: 0.50,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    console.log('✓ Created customization options');

    // 4. Create menu items
    const dinnerPlateItems = [
      {
        name: 'Gyro Plate',
        description: 'A gyro filled with delicious meat, onions, tomatoes and Tzatziki sauce, served with fries, onion rings and a choice of coleslaw or pasta salad',
        basePrice: 17.25
      },
      {
        name: 'Hamburger Plate',
        description: 'Grilled burger patty on a sesame hamburger bun, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 14.99
      },
      {
        name: 'Cheeseburger Plate',
        description: 'Grilled cheeseburger on a sesame hamburger bun, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 15.50
      },
      {
        name: 'Chicken Kabob Plate',
        description: 'Grilled chicken breast served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 16.50
      },
      {
        name: 'Chicken Wings Plate',
        description: 'Chicken wings deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 16.50
      },
      {
        name: 'Chicken Fingers Plate',
        description: 'Chicken tenders deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 17.45
      },
      {
        name: 'Roast Beef Plate',
        description: 'Slow roasted beef for hours to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 17.99
      },
      {
        name: 'Steak Tip Kabob Plate',
        description: 'Grilled steak tips, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 19.99
      },
      {
        name: 'Fish \'n Chips',
        description: 'A big plate of haddock fish on a bed of french fries',
        basePrice: 27.50
      }
    ];

    const createdItems = [];
    for (let i = 0; i < dinnerPlateItems.length; i++) {
      const item = dinnerPlateItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: dinnerPlatesCategory.id,
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
      // All dinner plates get fries/rings and condiments
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: friesRingsGroup.id,
          isRequired: true,
          sortOrder: 1
        }
      });

      // Fish 'n Chips doesn't get side salad (it's just fish on fries)
      if (item.name !== 'Fish \'n Chips') {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sideSaladGroup.id,
            isRequired: true,
            sortOrder: 2
          }
        });
      }

      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: condimentsGroup.id,
          isRequired: false,
          sortOrder: 3
        }
      });

      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: freeIngredientsGroup.id,
          isRequired: false,
          sortOrder: 4
        }
      });

      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: paidIngredientsGroup.id,
          isRequired: false,
          sortOrder: 5
        }
      });
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Dinner Plates category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${dinnerPlatesCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Customization groups: 5`);
    console.log(`   - Customization options: ${3 + 2 + 9 + 5 + 8} total`);

  } catch (error) {
    console.error('❌ Error creating dinner plates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDinnerPlates();
