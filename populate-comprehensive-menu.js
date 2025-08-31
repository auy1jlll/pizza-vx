const { PrismaClient } = require('@prisma/client');

async function populateComprehensiveMenuData() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting comprehensive menu data population...');

    // 1. Get existing categories
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`Found ${categories.length} existing categories:`);
    categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));

    // Map categories by name for easier reference
    const saladsCategory = categories.find(c => c.name === 'Salads');
    const pizzasCategory = categories.find(c => c.name === 'Pizzas');
    const calzonesCategory = categories.find(c => c.name === 'Calzones');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');

    // 2. Create Specialty Pizzas category
    console.log('Creating Specialty Pizzas category...');
    const specialtyPizzasCategory = await prisma.menuCategory.create({
      data: {
        name: 'Specialty Pizzas',
        slug: 'specialty-pizzas',
        description: 'Our signature specialty pizzas with premium toppings and unique flavor combinations',
        sortOrder: 3
      }
    });

    console.log(`Created Specialty Pizzas category (ID: ${specialtyPizzasCategory.id})`);

    // 3. Create customization groups for specialty pizzas
    console.log('Creating customization groups for specialty pizzas...');
    const specialtyToppingsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: specialtyPizzasCategory.id,
        name: 'Extra Toppings',
        description: 'Add extra toppings to your specialty pizza',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 8,
        sortOrder: 1
      }
    });

    // 4. Create specialty pizza menu items
    console.log('Creating specialty pizza menu items...');
    const specialtyPizzas = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'Chicken Alfredo Pizza',
          description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
          basePrice: 15.45,
          sortOrder: 1
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'BBQ Chicken Pizza',
          description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
          basePrice: 16.5,
          sortOrder: 2
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'House Special Pizza',
          description: 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions',
          basePrice: 16.5,
          sortOrder: 3
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'Buffalo Chicken Pizza',
          description: 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese',
          basePrice: 16.5,
          sortOrder: 4
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'Meat Lovers Pizza',
          description: 'Meatball, Sausage, Pepperoni, Bacon, Salami and Ham',
          basePrice: 16.5,
          sortOrder: 5
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'Athenian Pizza',
          description: 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese',
          basePrice: 16.5,
          sortOrder: 6
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: specialtyPizzasCategory.id,
          name: 'Veggie Pizza',
          description: 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli',
          basePrice: 16.5,
          sortOrder: 7
        }
      })
    ]);

    console.log(`Created ${specialtyPizzas.length} specialty pizza items`);

    // 5. Create specialty pizza customization options
    console.log('Creating specialty pizza customization options...');
    const specialtyToppings = await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: specialtyToppingsGroup.id,
          name: 'Extra Chicken',
          description: 'Additional grilled chicken',
          priceModifier: 3.99,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: specialtyToppingsGroup.id,
          name: 'Extra Cheese',
          description: 'Additional mozzarella cheese',
          priceModifier: 2.49,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: specialtyToppingsGroup.id,
          name: 'Extra Bacon',
          description: 'Additional crispy bacon',
          priceModifier: 2.99,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: specialtyToppingsGroup.id,
          name: 'Extra Pepperoni',
          description: 'Additional pepperoni slices',
          priceModifier: 2.49,
          sortOrder: 4
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: specialtyToppingsGroup.id,
          name: 'Extra Mushrooms',
          description: 'Additional fresh mushrooms',
          priceModifier: 1.99,
          sortOrder: 5
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: specialtyToppingsGroup.id,
          name: 'Extra Onions',
          description: 'Additional grilled onions',
          priceModifier: 1.49,
          sortOrder: 6
        }
      })
    ]);

    console.log(`Created ${specialtyToppings.length} specialty topping options`);

    // 6. Link specialty pizzas to their customization groups
    console.log('Creating menu item customizations for specialty pizzas...');
    const specialtyPizzaCustomizations = await Promise.all(
      specialtyPizzas.map(pizza =>
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: pizza.id,
            customizationGroupId: specialtyToppingsGroup.id,
            isRequired: false,
            sortOrder: 1
          }
        })
      )
    );

    console.log(`Created ${specialtyPizzaCustomizations.length} specialty pizza customizations`);

    // 7. Create additional menu items from the backup
    console.log('Creating additional menu items from backup...');

    // Additional salads
    const additionalSalads = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: saladsCategory.id,
          name: 'Salad with Lobster',
          description: 'Fresh mixed greens, with our local lobster',
          basePrice: 38.0,
          sortOrder: 7
        }
      })
    ]);

    // Additional appetizers/side orders
    const sideOrdersCategory = await prisma.menuCategory.create({
      data: {
        name: 'Side Orders',
        slug: 'side-orders',
        description: 'Delicious appetizers and side dishes to complement your meal',
        sortOrder: 5
      }
    });

    const sideOrders = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: sideOrdersCategory.id,
          name: 'BBQ Chicken Fingers',
          description: 'Crispy chicken tenders with BBQ sauce',
          basePrice: 11.99,
          sortOrder: 1
        }
      })
    ]);

    // Additional beverages
    const additionalBeverages = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: beveragesCategory.id,
          name: 'Diet Coke',
          description: 'Diet Coca-Cola soda',
          basePrice: 2.49,
          sortOrder: 4
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: beveragesCategory.id,
          name: 'Dr Pepper',
          description: 'Classic Dr Pepper soda',
          basePrice: 2.49,
          sortOrder: 5
        }
      })
    ]);

    console.log(`Created ${additionalSalads.length} additional salads`);
    console.log(`Created ${sideOrders.length} side orders`);
    console.log(`Created ${additionalBeverages.length} additional beverages`);

    // 8. Create additional calzone options
    console.log('Creating additional calzone options...');
    const additionalCalzones = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: calzonesCategory.id,
          name: 'Small Calzone',
          description: 'Personal size calzone with your choice of fillings',
          basePrice: 16.0,
          sortOrder: 3
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: calzonesCategory.id,
          name: 'Large Calzone',
          description: 'Family size calzone with your choice of fillings',
          basePrice: 21.0,
          sortOrder: 4
        }
      })
    ]);

    console.log(`Created ${additionalCalzones.length} additional calzone options`);

    console.log('✅ Comprehensive menu data population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- 1 new category (Specialty Pizzas)`);
    console.log(`- ${specialtyPizzas.length} specialty pizza items`);
    console.log(`- ${specialtyToppings.length} specialty topping options`);
    console.log(`- ${additionalSalads.length} additional salads`);
    console.log(`- ${sideOrders.length} side orders`);
    console.log(`- ${additionalBeverages.length} additional beverages`);
    console.log(`- 1 new side orders category`);

    console.log('\n🎯 Specialty Pizzas Available:');
    specialtyPizzas.forEach(pizza => {
      console.log(`- ${pizza.name}: $${pizza.basePrice}`);
    });

  } catch (error) {
    console.error('❌ Error populating comprehensive menu data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateComprehensiveMenuData();
