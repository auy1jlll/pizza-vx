const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createHotSubsCategory() {
  try {
    console.log('Creating Hot Subs category...');
    
    // 1. Create Hot Subs category
    const hotSubsCategory = await prisma.menuCategory.create({
      data: {
        name: 'Hot Subs',
        slug: 'hot-subs',
        description: 'Fresh made to order hot subs with your choice of bread and toppings',
        isActive: true,
        sortOrder: 10
      }
    });

    console.log(`✓ Created category: ${hotSubsCategory.name}`);

    // 2. Create customization groups for hot subs
    
    // Bread/Wrap selection group
    const breadGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: hotSubsCategory.id,
        name: 'Bread Selection',
        description: 'Choose your bread or wrap',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    // Free ingredients group
    const freeIngredientsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: hotSubsCategory.id,
        name: 'Free Ingredients',
        description: 'Add free ingredients and condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 2
      }
    });

    // Extra condiments $0.50 group
    const extraCondimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: hotSubsCategory.id,
        name: 'Extra Condiments',
        description: 'Add extra condiments (+$0.50 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    // Cheese $0.70 group
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: hotSubsCategory.id,
        name: 'Cheese & Olives',
        description: 'Add cheese or olives (+$0.70 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4
      }
    });

    // Meat $2.00 group
    const meatGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: hotSubsCategory.id,
        name: 'Extra Meat',
        description: 'Add extra meat (+$2.00 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 5
      }
    });

    console.log('✓ Created 5 customization groups');

    // 3. Create customization options

    // Bread options (all free)
    const breadOptions = [
      '10" Sub roll', 'Spinach Wrap', 'Tomato basil wrap', 'Wheat wrap', 'White Wrap', 'No Bread'
    ];

    for (const bread of breadOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: breadGroup.id,
          name: bread,
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: bread === '10" Sub roll',
          isActive: true
        }
      });
    }

    // Free ingredients options
    const freeIngredients = [
      'No Cheese please!', 'No Condiments (Dry)', 'Plain no toppings', 'Bleu cheese', 
      'Horseradish', 'Mayonaise', 'Mustard', 'Ranch', 'Spicy Mustard', 'Special BBQ Sauce',
      'Lettuce', 'Onions', 'Tomatoes', 'Pickles', 'Hot Relish', 'Banana Peppers',
      'Black Olives', 'Cucumbers', 'Fresh Mushrooms', 'Grilled Mushrooms', 'Green Peppers',
      'Grilled Bell Peppers', 'Red Onions'
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

    // Extra condiments options ($0.50 each)
    const extraCondiments = [
      'Extra Horseradish', 'Extra Mayonnaise', 'Extra Special BBQ Sauce', 'Extra Spicy Mustard'
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

    // Cheese and olives options ($0.70 each)
    const cheeseOptions = [
      'American Cheese', 'Provolone Cheese', 'Swiss Cheese', 'Mozzarella Cheese',
      'Parmesan Cheese', 'Kalamata Olives'
    ];

    for (const cheese of cheeseOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: cheeseGroup.id,
          name: cheese,
          priceModifier: 0.70,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Meat options ($2.00 each)
    const meatOptions = [
      'Bacon', 'Salami'
    ];

    for (const meat of meatOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: meatGroup.id,
          name: meat,
          priceModifier: 2.00,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    console.log('✓ Created customization options');

    // 4. Create menu items
    const hotSubItems = [
      {
        name: 'Build your Own Roast Beef Sub',
        description: 'Start by choosing size sub, and add toppings',
        basePrice: 11.99,
        hasLargeOption: true,
        largePriceModifier: 1.00
      },
      {
        name: 'Chicken Cutlet Sub',
        description: 'Chicken cutlet in special batter fried in a large sub roll.',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Grilled Chicken Kabob',
        description: 'Fresh made to order Grilled Chicken, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Steak Tips Kabob',
        description: 'Fresh made to order Grilled Steak tips, you can choose it in a wrap or a sub roll',
        basePrice: 15.99,
        hasLargeOption: false
      },
      {
        name: 'Cheese Burger',
        description: 'Fresh made to order 2-patty cheese burger, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Chicken Fingers/tenders',
        description: 'Fresh made to order Chicken fingers, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Chicken Caesar Wrap',
        description: 'Fresh made to order Grilled Chicken, you can choose the type of wrap.',
        basePrice: 14.50,
        hasLargeOption: false
      },
      {
        name: 'Meat Ball Sub',
        description: 'Meatballs in marinara sauce with your choice of no cheese or one of many options we have to offer',
        basePrice: 11.99,
        hasLargeOption: false
      },
      {
        name: 'Hot Pastrami',
        description: 'Pastrami in a warp or a 10" sub with options to make it your own',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Hot Veggies',
        description: 'Fresh made to order Grilled Veggies, (grilled Mushroom, peppers and onions)',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Eggplant',
        description: 'Fresh made to order Eggplant, you can choose it in a wrap or a sub roll',
        basePrice: 12.25,
        hasLargeOption: false
      },
      {
        name: 'Veal Cutlet',
        description: 'Fresh made to order Veal cutlet, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        hasLargeOption: false
      },
      {
        name: 'Sausage sub',
        description: 'Fresh made to order Sausage, you can choose it in a wrap or a sub roll',
        basePrice: 12.99,
        hasLargeOption: false
      }
    ];

    const createdItems = [];
    for (let i = 0; i < hotSubItems.length; i++) {
      const item = hotSubItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: hotSubsCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isActive: true,
          isAvailable: true,
          sortOrder: i + 1
        }
      });
      createdItems.push({ ...menuItem, ...item });
      
      const priceDisplay = item.hasLargeOption 
        ? `$${item.basePrice} (Reg), $${(item.basePrice + item.largePriceModifier).toFixed(2)} (Large)`
        : `$${item.basePrice}`;
      console.log(`✓ Created item: ${item.name} - ${priceDisplay}`);
    }

    // 5. Link items to customization groups
    for (const item of createdItems) {
      // Create size group only for Build Your Own Roast Beef Sub
      if (item.hasLargeOption) {
        const itemSizeGroup = await prisma.customizationGroup.create({
          data: {
            categoryId: hotSubsCategory.id,
            name: 'Size',
            description: 'Choose your size',
            type: 'SINGLE_SELECT',
            isRequired: true,
            minSelections: 1,
            maxSelections: 1,
            sortOrder: 1
          }
        });

        // Create size options
        await prisma.customizationOption.create({
          data: {
            groupId: itemSizeGroup.id,
            name: 'Regular',
            priceModifier: 0,
            priceType: 'FLAT',
            isDefault: true,
            isActive: true
          }
        });

        await prisma.customizationOption.create({
          data: {
            groupId: itemSizeGroup.id,
            name: 'Large',
            priceModifier: item.largePriceModifier,
            priceType: 'FLAT',
            isActive: true
          }
        });

        // Link to size group
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: itemSizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
      }

      // Link to other customization groups
      const customizationGroups = [
        { group: breadGroup, required: true, order: item.hasLargeOption ? 2 : 1 },
        { group: freeIngredientsGroup, required: false, order: item.hasLargeOption ? 3 : 2 },
        { group: extraCondimentsGroup, required: false, order: item.hasLargeOption ? 4 : 3 },
        { group: cheeseGroup, required: false, order: item.hasLargeOption ? 5 : 4 },
        { group: meatGroup, required: false, order: item.hasLargeOption ? 6 : 5 }
      ];

      for (const { group, required, order } of customizationGroups) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: group.id,
            isRequired: required,
            sortOrder: order
          }
        });
      }
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Hot Subs category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${hotSubsCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Build Your Own Roast Beef Sub has size options (Reg/Large)`);
    console.log(`   - All items have bread selection and extensive customization options`);
    console.log(`   - Price range: $11.99 - $15.99`);

  } catch (error) {
    console.error('❌ Error creating hot subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createHotSubsCategory();
