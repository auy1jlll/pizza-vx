const { PrismaClient } = require('@prisma/client');

async function populateMenuData() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting menu data population...');

    // 1. Get existing categories
    console.log('Fetching existing categories...');
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`Found ${categories.length} existing categories:`);
    categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));

    if (categories.length === 0) {
      console.log('No categories found. Please create categories first.');
      return;
    }

    // Map categories by name for easier reference
    const saladsCategory = categories.find(c => c.name === 'Salads');
    const pizzasCategory = categories.find(c => c.name === 'Pizzas');
    const calzonesCategory = categories.find(c => c.name === 'Calzones');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');

    if (!saladsCategory || !pizzasCategory || !calzonesCategory || !beveragesCategory) {
      console.log('Some required categories are missing. Please ensure all categories exist.');
      return;
    }

    // 2. Create Customization Groups
    console.log('Creating customization groups...');
    const customizationGroups = await Promise.all([
      // Salad Dressings
      prisma.customizationGroup.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Dressing',
          description: 'Choose your preferred dressing',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 1
        }
      }),
      // Salad Add-ons
      prisma.customizationGroup.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Add-ons',
          description: 'Extra toppings and proteins',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 5,
          sortOrder: 2
        }
      }),
      // Pizza Toppings
      prisma.customizationGroup.create({
        data: {
          categoryId: pizzasCategory.id,
          name: 'Toppings',
          description: 'Choose your pizza toppings',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 10,
          sortOrder: 1
        }
      }),
      // Calzone Fillings
      prisma.customizationGroup.create({
        data: {
          categoryId: calzonesCategory.id,
          name: 'Fillings',
          description: 'Choose your calzone fillings',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 8,
          sortOrder: 1
        }
      })
    ]);

    console.log(`Created ${customizationGroups.length} customization groups`);

    // 3. Create Customization Options
    console.log('Creating customization options...');
    const customizationOptions = await Promise.all([
      // Salad Dressings
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[0].id,
          name: 'Ranch',
          description: 'Creamy ranch dressing',
          priceModifier: 0,
          isDefault: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[0].id,
          name: 'Caesar',
          description: 'Tangy Caesar dressing',
          priceModifier: 0,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[0].id,
          name: 'Italian',
          description: 'Classic Italian dressing',
          priceModifier: 0,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[0].id,
          name: 'Balsamic Vinaigrette',
          description: 'Sweet and tangy balsamic dressing',
          priceModifier: 0,
          sortOrder: 4
        }
      }),

      // Salad Add-ons
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[1].id,
          name: 'Grilled Chicken',
          description: 'Tender grilled chicken breast',
          priceModifier: 4.99,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[1].id,
          name: 'Feta Cheese',
          description: 'Crumbled feta cheese',
          priceModifier: 1.99,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[1].id,
          name: 'Avocado',
          description: 'Fresh avocado slices',
          priceModifier: 2.49,
          sortOrder: 3
        }
      }),

      // Pizza Toppings
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[2].id,
          name: 'Pepperoni',
          description: 'Classic pepperoni slices',
          priceModifier: 2.49,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[2].id,
          name: 'Mushrooms',
          description: 'Fresh sliced mushrooms',
          priceModifier: 1.99,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[2].id,
          name: 'Green Peppers',
          description: 'Crisp green bell peppers',
          priceModifier: 1.99,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[2].id,
          name: 'Extra Cheese',
          description: 'Additional mozzarella cheese',
          priceModifier: 2.49,
          sortOrder: 4
        }
      }),

      // Calzone Fillings
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[3].id,
          name: 'Ricotta Cheese',
          description: 'Creamy ricotta filling',
          priceModifier: 1.99,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[3].id,
          name: 'Meatballs',
          description: 'Homemade meatballs',
          priceModifier: 3.49,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: customizationGroups[3].id,
          name: 'Sausage',
          description: 'Italian sausage',
          priceModifier: 2.99,
          sortOrder: 3
        }
      })
    ]);

    console.log(`Created ${customizationOptions.length} customization options`);

    // 4. Create Menu Items
    console.log('Creating menu items...');
    const menuItems = await Promise.all([
      // Salads
      prisma.menuItem.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Greek Salad',
          description: 'Fresh romaine lettuce, tomatoes, cucumbers, red onions, Kalamata olives, and feta cheese',
          basePrice: 11.75,
          sortOrder: 1
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
          basePrice: 10.50,
          sortOrder: 2
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'California Salad',
          description: 'Mixed greens, avocado, tomatoes, cucumbers, and balsamic vinaigrette',
          basePrice: 12.25,
          sortOrder: 3
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Chef Salad',
          description: 'Ham, turkey, cheese, eggs, tomatoes, and cucumbers on mixed greens',
          basePrice: 13.50,
          sortOrder: 4
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Build Your Own Salad',
          description: 'Choose your greens and customize with your favorite toppings',
          basePrice: 9.99,
          sortOrder: 5
        }
      }),

      // Pizzas
      prisma.menuItem.create({
        data: {
          categoryId: pizzasCategory.id,
          name: 'Margherita Pizza',
          description: 'Fresh mozzarella, tomato sauce, basil, and olive oil',
          basePrice: 14.99,
          sortOrder: 1
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: pizzasCategory.id,
          name: 'Pepperoni Pizza',
          description: 'Classic pepperoni with mozzarella and tomato sauce',
          basePrice: 16.99,
          sortOrder: 2
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: pizzasCategory.id,
          name: 'Vegetarian Pizza',
          description: 'Mushrooms, peppers, onions, olives, and tomatoes',
          basePrice: 15.99,
          sortOrder: 3
        }
      }),

      // Calzones
      prisma.menuItem.create({
        data: {
          categoryId: calzonesCategory.id,
          name: 'Classic Calzone',
          description: 'Ricotta, mozzarella, and your choice of fillings',
          basePrice: 16.99,
          sortOrder: 1
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: calzonesCategory.id,
          name: 'Meat Lovers Calzone',
          description: 'Pepperoni, sausage, meatballs, and cheese',
          basePrice: 19.99,
          sortOrder: 2
        }
      }),

      // Beverages
      prisma.menuItem.create({
        data: {
          categoryId: beveragesCategory.id,
          name: 'Coca-Cola',
          description: 'Classic Coca-Cola soda',
          basePrice: 2.49,
          sortOrder: 1
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: beveragesCategory.id,
          name: 'Sprite',
          description: 'Lemon-lime soda',
          basePrice: 2.49,
          sortOrder: 2
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: beveragesCategory.id,
          name: 'Iced Tea',
          description: 'Fresh brewed iced tea',
          basePrice: 2.99,
          sortOrder: 3
        }
      })
    ]);

    console.log(`Created ${menuItems.length} menu items`);

    // 5. Create Menu Item Customizations (link items to customization groups)
    console.log('Creating menu item customizations...');
    const menuItemCustomizations = await Promise.all([
      // Greek Salad - Dressing
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[0].id,
          customizationGroupId: customizationGroups[0].id,
          isRequired: true,
          sortOrder: 1
        }
      }),
      // Greek Salad - Add-ons
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[0].id,
          customizationGroupId: customizationGroups[1].id,
          isRequired: false,
          sortOrder: 2
        }
      }),

      // Caesar Salad - Dressing
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[1].id,
          customizationGroupId: customizationGroups[0].id,
          isRequired: true,
          sortOrder: 1
        }
      }),

      // California Salad - Dressing
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[2].id,
          customizationGroupId: customizationGroups[0].id,
          isRequired: true,
          sortOrder: 1
        }
      }),

      // Chef Salad - Dressing
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[3].id,
          customizationGroupId: customizationGroups[0].id,
          isRequired: true,
          sortOrder: 1
        }
      }),

      // Build Your Own Salad - Dressing
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[4].id,
          customizationGroupId: customizationGroups[0].id,
          isRequired: true,
          sortOrder: 1
        }
      }),
      // Build Your Own Salad - Add-ons
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[4].id,
          customizationGroupId: customizationGroups[1].id,
          isRequired: false,
          sortOrder: 2
        }
      }),

      // Margherita Pizza - Toppings
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[5].id,
          customizationGroupId: customizationGroups[2].id,
          isRequired: false,
          sortOrder: 1
        }
      }),

      // Pepperoni Pizza - Toppings
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[6].id,
          customizationGroupId: customizationGroups[2].id,
          isRequired: false,
          sortOrder: 1
        }
      }),

      // Vegetarian Pizza - Toppings
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[7].id,
          customizationGroupId: customizationGroups[2].id,
          isRequired: false,
          sortOrder: 1
        }
      }),

      // Classic Calzone - Fillings
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[8].id,
          customizationGroupId: customizationGroups[3].id,
          isRequired: false,
          sortOrder: 1
        }
      }),

      // Meat Lovers Calzone - Fillings
      prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItems[9].id,
          customizationGroupId: customizationGroups[3].id,
          isRequired: false,
          sortOrder: 1
        }
      })
    ]);

    console.log(`Created ${menuItemCustomizations.length} menu item customizations`);

    console.log('✅ Menu data population completed successfully!');
    console.log('\nSummary:');
    console.log(`- ${categories.length} categories`);
    console.log(`- ${menuItems.length} menu items`);
    console.log(`- ${customizationGroups.length} customization groups`);
    console.log(`- ${customizationOptions.length} customization options`);
    console.log(`- ${menuItemCustomizations.length} menu item customizations`);

  } catch (error) {
    console.error('❌ Error populating menu data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateMenuData();
