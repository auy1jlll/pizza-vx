const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSteakCheeseSubs() {
  try {
    console.log('Creating Steak and Cheese Subs category...');
    
    // 1. Create Steak and Cheese Subs category
    const steakSubsCategory = await prisma.menuCategory.create({
      data: {
        name: 'Steak and Cheese Subs',
        slug: 'steak-and-cheese-subs',
        description: 'Fresh steak and cheese subs with your choice of size and toppings',
        isActive: true,
        sortOrder: 9
      }
    });

    console.log(`✓ Created category: ${steakSubsCategory.name}`);

    // 2. Create customization groups for steak subs
    
    // Size group
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: steakSubsCategory.id,
        name: 'Size',
        description: 'Choose your size',
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
        categoryId: steakSubsCategory.id,
        name: 'Free Ingredients',
        description: 'Add free ingredients',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 2
      }
    });

    // Cheese $0.70 group
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: steakSubsCategory.id,
        name: 'Cheese',
        description: 'Add cheese (+$0.70 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3
      }
    });

    // Extra cheese $1.00 group
    const extraCheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: steakSubsCategory.id,
        name: 'Extra Cheese',
        description: 'Add extra cheese (+$1.00 each)',
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
        categoryId: steakSubsCategory.id,
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

    // Size options - will be created per item with different pricing
    const sizeOptions = [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 1.00 } // Most items are +$1
    ];

    // Free ingredients options
    const freeIngredients = [
      'No Cheese', 'Black Olives', 'Cucumbers', 'Fresh Mushrooms', 'Grilled Mushrooms',
      'Fresh Green Peppers', 'Grilled Bell Peppers', 'Banana Peppers', 'Hot Relish',
      'Kalamata Olives', 'Lettuce', 'Mayonnaise', 'Fresh Onions', 'Grilled Onions',
      'Pickles', 'Red Onions', 'Horseradish', 'Ketchup', 'Mustard', 'Spicy Mustard', 'Tomatoes'
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

    // Cheese options ($0.70 each)
    const cheeseOptions = [
      'American Cheese', 'Mozzarella Cheese', 'Provolone Cheese', 'Swiss Cheese'
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

    // Extra cheese options ($1.00 each)
    const extraCheeseOptions = [
      'Extra American Cheese', 'Extra Provolone', 'Extra Swiss', 'Parmesan Cheese'
    ];

    for (const extraCheese of extraCheeseOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: extraCheeseGroup.id,
          name: extraCheese,
          priceModifier: 1.00,
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
    const steakSubItems = [
      {
        name: 'Steak Bomb',
        description: 'Steak and Cheese with Grilled peppers, Onions, mushrooms and american cheese',
        basePrice: 11.99, // Small price
        largePriceModifier: 1.00 // Large is +$1
      },
      {
        name: 'Pepper Cheese Steak',
        description: 'Steak and Cheese with Grilled peppers',
        basePrice: 11.50, // Small price
        largePriceModifier: 1.00 // Large is +$1
      },
      {
        name: 'Onion Cheese Steak',
        description: 'Steak and Cheese with Grilled onions',
        basePrice: 11.50, // Small price
        largePriceModifier: 1.00 // Large is +$1
      },
      {
        name: 'Mushroom Cheese Steak',
        description: 'Steak and Cheese with Mushroom',
        basePrice: 11.50, // Small price
        largePriceModifier: 1.00 // Large is +$1
      },
      {
        name: 'Steak Sub Build Your Own',
        description: 'Select the size of your sub starts with the shaved steaks and add your cheese, toppings and condiments',
        basePrice: 11.50, // Small price
        largePriceModifier: 1.00 // Large is +$1
      }
    ];

    const createdItems = [];
    for (let i = 0; i < steakSubItems.length; i++) {
      const item = steakSubItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: steakSubsCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isActive: true,
          isAvailable: true,
          sortOrder: i + 1
        }
      });
      createdItems.push({ ...menuItem, largePriceModifier: item.largePriceModifier });
      console.log(`✓ Created item: ${item.name} - $${item.basePrice} (SM), $${(item.basePrice + item.largePriceModifier).toFixed(2)} (LG)`);
    }

    // 5. Create item-specific size groups and link to customization groups
    for (const item of createdItems) {
      // Create item-specific size group with correct pricing
      const itemSizeGroup = await prisma.customizationGroup.create({
        data: {
          categoryId: steakSubsCategory.id,
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

      // Link item to other customization groups
      const customizationGroups = [
        { group: freeIngredientsGroup, required: false, order: 2 },
        { group: cheeseGroup, required: false, order: 3 },
        { group: extraCheeseGroup, required: false, order: 4 },
        { group: meatGroup, required: false, order: 5 }
      ];

      // Build Your Own gets all customizations, others get limited
      const isCustomizable = item.name === 'Steak Sub Build Your Own';
      
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

    console.log('\n🎉 Successfully created Steak and Cheese Subs category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${steakSubsCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - All items have Small/Large size options with $1.00 upcharge`);
    console.log(`   - Extensive customization options: Free ingredients, Cheese, Extra cheese, Extra meat`);

  } catch (error) {
    console.error('❌ Error creating steak and cheese subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSteakCheeseSubs();
