const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSandwiches() {
  try {
    console.log('Creating Sandwiches category...');
    
    // 1. Create Sandwiches category
    const sandwichCategory = await prisma.menuCategory.create({
      data: {
        name: 'Sandwiches',
        slug: 'sandwiches',
        description: 'Fresh sandwiches made to order',
        isActive: true,
        sortOrder: 1
      }
    });

    console.log(`✓ Created category: ${sandwichCategory.name}`);

    // 2. Create customization groups for sandwiches
    
    // Bread type group
    const breadGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Bread',
        description: 'Choose your bread',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1
      }
    });

    // Size group (if sandwiches have different sizes)
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Size',
        description: 'Choose your size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2
      }
    });

    // Cheese group
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Cheese',
        description: 'Add cheese',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    // Vegetables group
    const vegetablesGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Vegetables',
        description: 'Add vegetables',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4
      }
    });

    // Condiments group
    const condimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Condiments',
        description: 'Add condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 5
      }
    });

    // Extras group
    const extrasGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Extras',
        description: 'Add extras',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 6
      }
    });

    console.log('✓ Created 6 customization groups');

    // 3. Create customization options

    // Bread options
    const breadOptions = [
      { name: 'White Bread', priceModifier: 0 },
      { name: 'Wheat Bread', priceModifier: 0 },
      { name: 'Italian Bread', priceModifier: 0 },
      { name: 'Sub Roll', priceModifier: 0 },
      { name: 'Pita Bread', priceModifier: 0.50 }
    ];

    for (const option of breadOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: breadGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'White Bread',
          isActive: true
        }
      });
    }

    // Size options
    const sizeOptions = [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 2.00 }
    ];

    for (const option of sizeOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: sizeGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isDefault: option.name === 'Regular',
          isActive: true
        }
      });
    }

    // Cheese options
    const cheeseOptions = [
      { name: 'American Cheese', priceModifier: 1.00 },
      { name: 'Provolone Cheese', priceModifier: 1.00 },
      { name: 'Swiss Cheese', priceModifier: 1.00 },
      { name: 'Cheddar Cheese', priceModifier: 1.00 },
      { name: 'Mozzarella Cheese', priceModifier: 1.00 }
    ];

    for (const option of cheeseOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: cheeseGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Vegetables options (free)
    const vegetableOptions = [
      'Lettuce', 'Tomatoes', 'Onions', 'Pickles', 'Green Peppers', 
      'Hot Peppers', 'Mushrooms', 'Black Olives', 'Cucumber'
    ];

    for (const vegetable of vegetableOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: vegetablesGroup.id,
          name: vegetable,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Condiments options (free)
    const condimentOptions = [
      'Mayonnaise', 'Mustard', 'Ketchup', 'Oil & Vinegar', 'Italian Dressing',
      'Ranch', 'Honey Mustard', 'Buffalo Sauce', 'BBQ Sauce'
    ];

    for (const condiment of condimentOptions) {
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

    // Extras options (paid)
    const extraOptions = [
      { name: 'Extra Meat', priceModifier: 3.00 },
      { name: 'Bacon', priceModifier: 2.00 },
      { name: 'Avocado', priceModifier: 1.50 },
      { name: 'Extra Cheese', priceModifier: 1.00 }
    ];

    for (const option of extraOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: extrasGroup.id,
          name: option.name,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    console.log('✓ Created customization options');

    // 4. Create placeholder menu items (you can provide specific items)
    const sandwichItems = [
      {
        name: 'Turkey Sandwich',
        description: 'Fresh sliced turkey with your choice of toppings',
        basePrice: 8.99
      },
      {
        name: 'Ham Sandwich',
        description: 'Fresh sliced ham with your choice of toppings',
        basePrice: 8.99
      },
      {
        name: 'Italian Sub',
        description: 'Ham, salami, pepperoni, and provolone with Italian dressing',
        basePrice: 10.99
      },
      {
        name: 'Roast Beef Sandwich',
        description: 'Fresh sliced roast beef with your choice of toppings',
        basePrice: 9.99
      },
      {
        name: 'Tuna Sandwich',
        description: 'House-made tuna salad with your choice of toppings',
        basePrice: 8.49
      }
    ];

    const createdItems = [];
    for (let i = 0; i < sandwichItems.length; i++) {
      const item = sandwichItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: sandwichCategory.id,
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
      // All sandwiches get all customization groups
      const groups = [breadGroup, sizeGroup, cheeseGroup, vegetablesGroup, condimentsGroup, extrasGroup];
      
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: group.id,
            isRequired: group.isRequired,
            sortOrder: i + 1
          }
        });
      }
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Sandwiches category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${sandwichCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Customization groups: 6`);
    console.log(`   - Customization options: ${5 + 2 + 5 + 9 + 9 + 4} total`);

    console.log('\n📝 Note: This creates a basic sandwich menu. Please provide your specific sandwich items and I\'ll update them!');

  } catch (error) {
    console.error('❌ Error creating sandwiches:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSandwiches();
