const { PrismaClient } = require('@prisma/client');

async function addDeliSubsCategory() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🥪 ADDING DELI SUBS CATEGORY AND MENU ITEMS...\n');

    // First, check existing categories to get the next sort order
    const existingCategories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'desc' },
      take: 1
    });
    
    const nextSortOrder = existingCategories.length > 0 ? existingCategories[0].sortOrder + 1 : 1;
    console.log(`📊 Next sort order: ${nextSortOrder}`);

    // Check if Deli Subs category already exists
    const existingCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'deli-subs' }
    });

    let categoryId;
    
    if (existingCategory) {
      console.log('✅ Deli Subs category already exists');
      categoryId = existingCategory.id;
    } else {
      // Create Deli Subs category
      const category = await prisma.menuCategory.create({
        data: {
          name: 'Deli Subs',
          slug: 'deli-subs',
          description: 'Fresh deli subs with choice of bread type, available in small sub and large sizes including wraps',
          sortOrder: nextSortOrder,
          isActive: true,
        }
      });
      categoryId = category.id;
      console.log('✅ Created Deli Subs category');
    }

    // Check for existing customization groups for bread types and condiments
    let breadGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Bread Type' }
    });
    
    if (!breadGroup) {
      breadGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Bread Type',
          description: 'Choose your bread type',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 1
        }
      });
      console.log('✅ Created Bread Type customization group');
    }

    let condimentsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Condiments' }
    });
    
    if (!condimentsGroup) {
      condimentsGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Condiments',
          description: 'Add condiments to your sub',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: null,
          sortOrder: 2
        }
      });
      console.log('✅ Created Condiments customization group');
    }

    let toppingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Toppings' }
    });
    
    if (!toppingsGroup) {
      toppingsGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Toppings',
          description: 'Add extra toppings to your sub',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: null,
          sortOrder: 3
        }
      });
      console.log('✅ Created Toppings customization group');
    }

    // Create bread type options
    const breadOptions = [
      { name: 'Small Sub Roll', priceModifier: 0.00, isDefault: true, description: 'Traditional small sub roll' },
      { name: 'Large Sub Roll (12")', priceModifier: 1.00, description: 'Large 12-inch sub roll' },
      { name: 'Spinach Wrap', priceModifier: 1.00, description: 'Spinach tortilla wrap' },
      { name: 'Tomato Basil Wrap', priceModifier: 1.00, description: 'Tomato basil tortilla wrap' },
      { name: 'White Wrap', priceModifier: 1.00, description: 'White flour tortilla wrap' },
      { name: 'Wheat Wrap', priceModifier: 1.00, description: 'Whole wheat tortilla wrap' }
    ];

    for (const option of breadOptions) {
      const existing = await prisma.customizationOption.findFirst({
        where: { 
          name: option.name,
          groupId: breadGroup.id 
        }
      });
      
      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            ...option,
            groupId: breadGroup.id,
            isActive: true
          }
        });
      }
    }
    console.log('✅ Created bread type options');

    // Create condiment options
    const condimentOptions = [
      { name: 'Oil & Vinegar', priceModifier: 0.00, description: 'Classic oil and vinegar dressing' },
      { name: 'Mayonnaise', priceModifier: 0.00, description: 'Creamy mayonnaise' },
      { name: 'Mustard', priceModifier: 0.00, description: 'Yellow mustard' },
      { name: 'Pickles', priceModifier: 0.00, description: 'Dill pickle slices' },
      { name: 'Hot Peppers', priceModifier: 0.00, description: 'Spicy hot peppers' },
      { name: 'Italian Dressing', priceModifier: 0.00, description: 'Zesty Italian dressing' }
    ];

    for (const option of condimentOptions) {
      const existing = await prisma.customizationOption.findFirst({
        where: { 
          name: option.name,
          groupId: condimentsGroup.id 
        }
      });
      
      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            ...option,
            groupId: condimentsGroup.id,
            isActive: true
          }
        });
      }
    }
    console.log('✅ Created condiment options');

    // Create topping options
    const toppingOptions = [
      { name: 'Lettuce', priceModifier: 0.00, description: 'Fresh lettuce' },
      { name: 'Tomatoes', priceModifier: 0.00, description: 'Fresh tomato slices' },
      { name: 'Onions', priceModifier: 0.00, description: 'Fresh onion slices' },
      { name: 'Green Peppers', priceModifier: 0.00, description: 'Fresh green bell peppers' },
      { name: 'Cucumbers', priceModifier: 0.00, description: 'Fresh cucumber slices' },
      { name: 'Black Olives', priceModifier: 0.00, description: 'Black olive slices' },
      { name: 'Provolone Cheese', priceModifier: 0.50, description: 'Provolone cheese slice' },
      { name: 'American Cheese', priceModifier: 0.50, description: 'American cheese slice' },
      { name: 'Extra Meat', priceModifier: 2.00, description: 'Double the meat portion' }
    ];

    for (const option of toppingOptions) {
      const existing = await prisma.customizationOption.findFirst({
        where: { 
          name: option.name,
          groupId: toppingsGroup.id 
        }
      });
      
      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            ...option,
            groupId: toppingsGroup.id,
            isActive: true
          }
        });
      }
    }
    console.log('✅ Created topping options');

    // Define the deli sub menu items from Greenland Famous
    const deliSubItems = [
      {
        name: 'Italian Sub',
        description: 'Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots',
        basePrice: 11.99,
        sortOrder: 1
      },
      {
        name: 'American Sub',
        description: 'American Sub with Ham, Mortadella and American cheese',
        basePrice: 11.99,
        sortOrder: 2
      },
      {
        name: 'Imported Ham',
        description: 'Imported Ham add cheese and veggies to make it your way',
        basePrice: 11.99,
        sortOrder: 3
      },
      {
        name: 'Genoa Salami Sub',
        description: 'Imported Genoa Salami with many options to customize',
        basePrice: 11.99,
        sortOrder: 4
      },
      {
        name: 'Turkey Sub',
        description: 'Turkey sub with or without cheese but you can add veggies',
        basePrice: 11.99,
        sortOrder: 5
      },
      {
        name: 'Tuna Salad',
        description: 'Homemade tuna salad no additives and no crazy things it is basic but add condiments, cheese and veggies and spice it up',
        basePrice: 11.99,
        sortOrder: 6
      },
      {
        name: 'Chicken Salad',
        description: 'Roasted chicken salad, all we add is mayonnaise so you can taste the chicken. add to it as you need from a variety of condiments or toppings',
        basePrice: 11.99,
        sortOrder: 7
      },
      {
        name: 'Crab Meat Salad',
        description: 'Crab meat salad, select your size and your type of bread',
        basePrice: 11.99,
        sortOrder: 8
      },
      {
        name: 'Veggie Sub',
        description: 'Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions',
        basePrice: 11.99,
        sortOrder: 9
      },
      {
        name: 'BLT Sub',
        description: 'We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well',
        basePrice: 11.99,
        sortOrder: 10
      }
    ];

    // Create menu items
    for (const item of deliSubItems) {
      const existing = await prisma.menuItem.findFirst({
        where: { 
          name: item.name,
          categoryId: categoryId 
        }
      });
      
      if (!existing) {
        const menuItem = await prisma.menuItem.create({
          data: {
            ...item,
            categoryId: categoryId,
            isActive: true,
            isAvailable: true,
            preparationTime: 10 // 10 minutes preparation time
          }
        });

        // Connect customization groups to the menu item
        await prisma.menuItemCustomization.createMany({
          data: [
            {
              menuItemId: menuItem.id,
              customizationGroupId: breadGroup.id,
              isRequired: true,
              sortOrder: 1
            },
            {
              menuItemId: menuItem.id,
              customizationGroupId: condimentsGroup.id,
              isRequired: false,
              sortOrder: 2
            },
            {
              menuItemId: menuItem.id,
              customizationGroupId: toppingsGroup.id,
              isRequired: false,
              sortOrder: 3
            }
          ]
        });
        
        console.log(`✅ Created menu item: ${item.name}`);
      } else {
        console.log(`⚠️  Menu item already exists: ${item.name}`);
      }
    }

    console.log('\n🎉 DELI SUBS SETUP COMPLETE!');
    console.log('\n📋 Summary:');
    console.log('- Category: Deli Subs');
    console.log('- Items: 10 authentic deli subs from Greenland Famous');
    console.log('- Base Price: $11.99 (Small Sub Roll)');
    console.log('- Large/Wrap Upgrade: +$1.00');
    console.log('- Bread Options: 6 choices (Small Sub, Large Sub, 4 Wrap types)');
    console.log('- Condiments: 6 free options');
    console.log('- Toppings: 9 options (some with extra charges)');
    console.log('- All items fully customizable');

  } catch (error) {
    console.error('❌ Error setting up Deli Subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
addDeliSubsCategory().catch(console.error);
