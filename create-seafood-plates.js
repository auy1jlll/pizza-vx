const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSeafoodPlates() {
  try {
    console.log('Creating Seafood Plates category...');
    
    // 1. Create Seafood Plates category
    const seafoodPlatesCategory = await prisma.menuCategory.create({
      data: {
        name: 'Seafood Plates',
        slug: 'seafood-plates',
        description: 'Fresh seafood plates served with fries, onion rings, and choice of side salad',
        isActive: true,
        sortOrder: 8
      }
    });

    console.log(`✓ Created category: ${seafoodPlatesCategory.name}`);

    // 2. Create customization groups for seafood plates
    
    // Fries or Rings group
    const friesRingsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodPlatesCategory.id,
        name: 'Fries or Rings',
        description: 'Select fries, rings or both',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    // Coleslaw or Pasta group
    const sideSaladGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodPlatesCategory.id,
        name: 'Coleslaw or Pasta',
        description: 'ColeSlaw or Pasta Salad',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2
      }
    });

    // Free condiments group
    const freeCondimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodPlatesCategory.id,
        name: 'Free Condiments',
        description: 'Choose your free condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    // Additional toppings group (paid)
    const additionalToppingsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodPlatesCategory.id,
        name: 'Additional Toppings',
        description: 'Add extra toppings (prices vary)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4
      }
    });

    console.log('✓ Created 4 customization groups');

    // 3. Create customization options

    // Fries or Rings options (all free)
    const friesRingsOptions = [
      { name: 'Fries + Onion Rings', priceModifier: 0 },
      { name: 'Onion Rings', priceModifier: 0 },
      { name: 'French Fries', priceModifier: 0 }
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

    // Side salad options (both free)
    const sideSaladOptions = [
      { name: 'ColeSlaw', priceModifier: 0 },
      { name: 'Pasta Salad', priceModifier: 0 }
    ];

    for (const option of sideSaladOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: sideSaladGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'ColeSlaw',
          isActive: true
        }
      });
    }

    // Free condiments options
    const freeCondiments = [
      'Tartar Sauce', 'Cocktail Sauce', 'Ketchup'
    ];

    for (const condiment of freeCondiments) {
      await prisma.customizationOption.create({
        data: {
          groupId: freeCondimentsGroup.id,
          name: condiment,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Additional toppings options (paid)
    const additionalToppings = [
      { name: 'Extra Tartar Sauce', priceModifier: 0.50 },
      { name: 'Extra Cocktail Sauce', priceModifier: 0.50 },
      { name: 'Extra ColeSlaw', priceModifier: 3.70 },
      { name: 'Extra Pasta Salad', priceModifier: 3.50 }
    ];

    for (const topping of additionalToppings) {
      await prisma.customizationOption.create({
        data: {
          groupId: additionalToppingsGroup.id,
          name: topping.name,
          priceModifier: topping.priceModifier,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    console.log('✓ Created customization options');

    // 4. Create menu items
    const seafoodPlateItems = [
      {
        name: 'Sea Monster (Scallops, Clams, Shrimps & Haddock)',
        description: 'Fresh Haddock, scallops, shrimps and clams it is HUGE good for two people, comes with french fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 46.00
      },
      {
        name: 'Scallops Plate',
        description: 'A plate of scallops fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 41.50
      },
      {
        name: 'Haddock Plate',
        description: 'A huge piece of haddock fish on a bed of french fries and onion rings and a choice of pasta or coleslaw',
        basePrice: 33.50
      },
      {
        name: '2-way Scallops & Clams Plate',
        description: 'Best of the Sea.. scallops and Native clams, piled on onion rings and french fries with a choice of coleslaw or pasta salad',
        basePrice: 37.50
      },
      {
        name: '3-way Shrimps, Scallops & Clams Plate',
        description: 'A fresh pile of shrimps, scallops and clams piled on onion rings and french fries with a side of coleslaw or pasta salad',
        basePrice: 38.95
      },
      {
        name: 'Strip Clams Plate',
        description: 'Strip clams deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 21.50
      },
      {
        name: 'Shrimps Plate',
        description: 'Fresh shrimps deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad',
        basePrice: 24.50
      },
      {
        name: 'Native Clams Plate',
        description: 'Fresh locally sourced clams with an option of pasta salad or coleslaw on a bed of french fries and onion rings',
        basePrice: 42.00
      }
    ];

    const createdItems = [];
    for (let i = 0; i < seafoodPlateItems.length; i++) {
      const item = seafoodPlateItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: seafoodPlatesCategory.id,
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
      // All seafood plates get fries/rings selection (required)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: friesRingsGroup.id,
          isRequired: true,
          sortOrder: 1
        }
      });

      // All seafood plates get side salad selection (required)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: sideSaladGroup.id,
          isRequired: true,
          sortOrder: 2
        }
      });

      // All seafood plates get free condiments (optional)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: freeCondimentsGroup.id,
          isRequired: false,
          sortOrder: 3
        }
      });

      // All seafood plates get additional toppings (optional, paid)
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: additionalToppingsGroup.id,
          isRequired: false,
          sortOrder: 4
        }
      });
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Seafood Plates category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${seafoodPlatesCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Customization groups: 4`);
    console.log(`   - All items get: Fries/Rings (required), Side salad (required), Free condiments (optional), Additional toppings (paid)`);

  } catch (error) {
    console.error('❌ Error creating seafood plates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeafoodPlates();
