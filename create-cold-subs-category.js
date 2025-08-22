const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createColdSubsCategory() {
  try {
    console.log('Creating Cold Subs category...');
    
    // 1. Create Cold Subs category
    const coldSubsCategory = await prisma.menuCategory.create({
      data: {
        name: 'Cold Subs',
        slug: 'cold-subs',
        description: 'Fresh cold subs and wraps with your choice of bread and toppings',
        isActive: true,
        sortOrder: 11
      }
    });

    console.log(`✓ Created category: ${coldSubsCategory.name}`);

    // 2. Create customization groups for cold subs
    
    // Bread/Wrap/Size selection group (required)
    const breadSizeGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: coldSubsCategory.id,
        name: 'Bread & Size Selection',
        description: 'Choose your bread type and size',
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
        categoryId: coldSubsCategory.id,
        name: 'Condiments',
        description: 'Add condiments (free)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 2
      }
    });

    // Veggies group (free)
    const veggiesGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: coldSubsCategory.id,
        name: 'Vegetables',
        description: 'Add vegetables (free)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    // Cheese options group ($0.70 each)
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: coldSubsCategory.id,
        name: 'Cheese Options',
        description: 'Add cheese (+$0.70 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4
      }
    });

    // Extra condiments group ($0.70 each)
    const extraCondimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: coldSubsCategory.id,
        name: 'Extra Condiments',
        description: 'Add extra condiments (+$0.70 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 5
      }
    });

    // Extra meat group ($2.00 each)
    const extraMeatGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: coldSubsCategory.id,
        name: 'Extra Meat',
        description: 'Add extra meat (+$2.00 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 6
      }
    });

    // Free extras group
    const freeExtrasGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: coldSubsCategory.id,
        name: 'Free Extras',
        description: 'Additional free options',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 7
      }
    });

    console.log('✓ Created 7 customization groups');

    // 3. Create customization options

    // Bread and size options (all $12.99 except Small Sub which is $11.99 base)
    const breadSizeOptions = [
      { name: 'Small Sub', priceModifier: 0 }, // Base price
      { name: 'Large Sub', priceModifier: 1.00 },
      { name: 'Spinach Wrap', priceModifier: 1.00 },
      { name: 'Tomato/Basil Wrap', priceModifier: 1.00 },
      { name: 'White Wrap', priceModifier: 1.00 },
      { name: 'Wheat Wrap', priceModifier: 1.00 }
    ];

    for (const option of breadSizeOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: breadSizeGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'Small Sub',
          isActive: true
        }
      });
    }

    // Condiments (all free)
    const condiments = [
      'No Condiments (Dry)', 'Mayonaise', 'Mustard', 'Ranch', 'Spicy Mustard', 'Oil', 'Vinegar'
    ];

    for (const condiment of condiments) {
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

    // Vegetables (all free)
    const vegetables = [
      'Plain no toppings', 'Hot relish(HOTS)', 'Lettuce', 'Onions', 'Tomatoes', 'Pickles',
      'Hot Relish', 'Banana Peppers', 'Black Olives', 'Cucumbers', 'Fresh Mushrooms',
      'Green Peppers', 'Kalamata Olives', 'Red Onions'
    ];

    for (const veggie of vegetables) {
      await prisma.customizationOption.create({
        data: {
          groupId: veggiesGroup.id,
          name: veggie,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Cheese options ($0.70 each)
    const cheeseOptions = [
      'No Cheese please!', 'American Cheese', 'Provolone Cheese', 'Swiss Cheese',
      'Mozzarella Cheese', 'Bleu cheese', 'Parmesan Cheese'
    ];

    for (const cheese of cheeseOptions) {
      const priceModifier = cheese === 'No Cheese please!' ? 0 : 0.70;
      await prisma.customizationOption.create({
        data: {
          groupId: cheeseGroup.id,
          name: cheese,
          priceModifier: priceModifier,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Extra condiments ($0.70 each)
    const extraCondiments = [
      'Extra Horseradish', 'Extra Mayonnaise', 'Extra Special BBQ Sauce', 'Extra Spicy Mustard'
    ];

    for (const extra of extraCondiments) {
      await prisma.customizationOption.create({
        data: {
          groupId: extraCondimentsGroup.id,
          name: extra,
          priceModifier: 0.70,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Extra meat ($2.00 each)
    const extraMeat = [
      'Bacon', 'Salami'
    ];

    for (const meat of extraMeat) {
      await prisma.customizationOption.create({
        data: {
          groupId: extraMeatGroup.id,
          name: meat,
          priceModifier: 2.00,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Free extras
    const freeExtras = [
      'Horseradish', 'No Bread', 'Special BBQ Sauce', 'Grilled Mushrooms'
    ];

    for (const extra of freeExtras) {
      await prisma.customizationOption.create({
        data: {
          groupId: freeExtrasGroup.id,
          name: extra,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    console.log('✓ Created customization options');

    // 4. Create menu items
    const coldSubItems = [
      {
        name: 'Italian Sub',
        description: 'Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots',
        basePrice: 11.99
      },
      {
        name: 'American Sub',
        description: 'American Sub with Ham, Mortadella and American cheese.',
        basePrice: 11.99
      },
      {
        name: 'Imported Ham',
        description: 'Imported Ham add cheese and veggies to make it your way',
        basePrice: 11.99
      },
      {
        name: 'Genoa Salami Sub',
        description: 'Imported Genoa Salami with many options to customize',
        basePrice: 11.99
      },
      {
        name: 'Tuna Salad',
        description: 'Homemade tuna salad no additives and no crazy things it is basic but add condiments, cheese and veggies and spice it up',
        basePrice: 11.99
      },
      {
        name: 'Chicken Salad',
        description: 'Roasted chicken salad, all we add is mayonnaise so you can taste the chicken. add to it as you need from a variety of condiments or toppings',
        basePrice: 11.99
      },
      {
        name: 'Crab Meat',
        description: 'Crab meat salad, select your size and your type of bread',
        basePrice: 11.99
      },
      {
        name: 'Veggie Sub',
        description: 'Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions',
        basePrice: 11.99
      },
      {
        name: 'Turkey Sub',
        description: 'Turkey sub with or without cheese but you can add veggies',
        basePrice: 11.99
      },
      {
        name: 'BLT Sub',
        description: 'We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well.',
        basePrice: 11.99
      }
    ];

    const createdItems = [];
    for (let i = 0; i < coldSubItems.length; i++) {
      const item = coldSubItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: coldSubsCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isActive: true,
          isAvailable: true,
          sortOrder: i + 1
        }
      });
      createdItems.push(menuItem);
      console.log(`✓ Created item: ${item.name} - $${item.basePrice} (Small), $${(item.basePrice + 1.00).toFixed(2)} (Large/Wraps)`);
    }

    // 5. Link items to customization groups
    const customizationGroups = [
      { group: breadSizeGroup, required: true, order: 1 },
      { group: condimentsGroup, required: false, order: 2 },
      { group: veggiesGroup, required: false, order: 3 },
      { group: cheeseGroup, required: false, order: 4 },
      { group: extraCondimentsGroup, required: false, order: 5 },
      { group: extraMeatGroup, required: false, order: 6 },
      { group: freeExtrasGroup, required: false, order: 7 }
    ];

    for (const item of createdItems) {
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

    console.log('\n🎉 Successfully created Cold Subs category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${coldSubsCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - All items start at $11.99 for Small Sub`);
    console.log(`   - Large Sub and all Wraps are +$1.00 ($12.99)`);
    console.log(`   - Comprehensive customization with free veggies/condiments and paid cheese/extras`);

  } catch (error) {
    console.error('❌ Error creating cold subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createColdSubsCategory();
