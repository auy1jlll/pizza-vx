const { PrismaClient } = require('@prisma/client');

async function populateAdditionalMenuData() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting additional menu data population...');

    // 1. Get existing categories
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`Found ${categories.length} existing categories:`);
    categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));

    // Map categories by name for easier reference
    const pizzasCategory = categories.find(c => c.name === 'Pizzas');
    const calzonesCategory = categories.find(c => c.name === 'Calzones');
    const specialtyPizzasCategory = categories.find(c => c.name === 'Specialty Pizzas');

    // 2. Create additional specialty pizzas with size variations
    console.log('Creating additional specialty pizzas with size variations...');

    // First, let's create some pizza sizes if they don't exist
    const existingSizes = await prisma.pizzaSize.findMany();
    console.log(`Found ${existingSizes.length} existing pizza sizes`);

    let smallPizzaSize = existingSizes.find(s => s.name === 'Small Pizza');
    let largePizzaSize = existingSizes.find(s => s.name === 'Large Pizza');

    if (!smallPizzaSize) {
      smallPizzaSize = await prisma.pizzaSize.create({
        data: {
          name: 'Small Pizza',
          diameter: '12"',
          basePrice: 11.25,
          isActive: true,
          sortOrder: 1,
          description: 'Perfect for 1-2 people',
          productType: 'PIZZA'
        }
      });
      console.log('Created Small Pizza size');
    }

    if (!largePizzaSize) {
      largePizzaSize = await prisma.pizzaSize.create({
        data: {
          name: 'Large Pizza',
          diameter: '16"',
          basePrice: 16.5,
          isActive: true,
          sortOrder: 2,
          description: 'Great for families and sharing',
          productType: 'PIZZA'
        }
      });
      console.log('Created Large Pizza size');
    }

    // 3. Create pizza sauces if they don't exist
    console.log('Creating pizza sauces...');
    const existingSauces = await prisma.pizzaSauce.findMany();
    console.log(`Found ${existingSauces.length} existing pizza sauces`);

    const sauces = [
      { name: 'Pizza Sauce', description: 'Classic tomato pizza sauce', color: '#e53e3e', spiceLevel: 0 },
      { name: 'Alfredo Sauce', description: 'Creamy white alfredo sauce', color: '#f7fafc', spiceLevel: 0 },
      { name: 'Garlic Butter Sauce', description: 'Rich garlic butter sauce', color: '#fefcbf', spiceLevel: 0 },
      { name: 'White (No Sauce)', description: 'No sauce - just cheese and toppings', color: '#ffffff', spiceLevel: 0 },
      { name: 'Marinara sauce', description: 'Marinara sauce', color: '#ff0000', spiceLevel: 1 }
    ];

    for (const sauce of sauces) {
      const existingSauce = existingSauces.find(s => s.name === sauce.name);
      if (!existingSauce) {
        await prisma.pizzaSauce.create({
          data: {
            name: sauce.name,
            description: sauce.description,
            color: sauce.color,
            spiceLevel: sauce.spiceLevel,
            priceModifier: 0,
            isActive: true,
            sortOrder: existingSauces.length + 1
          }
        });
        console.log(`Created ${sauce.name}`);
      }
    }

    // 4. Create pizza crusts if they don't exist
    console.log('Creating pizza crusts...');
    const existingCrusts = await prisma.pizzaCrust.findMany();
    console.log(`Found ${existingCrusts.length} existing pizza crusts`);

    if (existingCrusts.length === 0) {
      await prisma.pizzaCrust.create({
        data: {
          name: 'Regular',
          description: 'Our classic hand-tossed crust',
          priceModifier: 0,
          isActive: true,
          sortOrder: 1
        }
      });
      console.log('Created Regular crust');
    }

    // 5. Create comprehensive pizza toppings
    console.log('Creating comprehensive pizza toppings...');
    const existingToppings = await prisma.pizzaTopping.findMany();
    console.log(`Found ${existingToppings.length} existing pizza toppings`);

    const toppings = [
      // Vegetables
      { name: 'Black Olives', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Broccoli', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Eggplant', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Fresh Mushrooms', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Fresh Onions', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Fresh Garlic', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Green Bell Peppers', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Grilled Onions', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Hot Pepper Rings', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Jalapeños', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Roasted Bell Peppers', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Spinach', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },
      { name: 'Tomatoes', category: 'VEGETABLE', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false },

      // Cheeses
      { name: 'Extra Cheese', category: 'CHEESE', price: 2, isVegetarian: true, isVegan: false, isGlutenFree: false },
      { name: 'Feta', category: 'CHEESE', price: 2, isVegetarian: true, isVegan: false, isGlutenFree: false },
      { name: 'Ricotta Cheese', category: 'CHEESE', price: 2, isVegetarian: true, isVegan: false, isGlutenFree: false },

      // Meats
      { name: 'Ham', category: 'MEAT', price: 2, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Meatballs', category: 'MEAT', price: 2, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Pepperoni', category: 'MEAT', price: 2, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Salami', category: 'MEAT', price: 2, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Sausage', category: 'MEAT', price: 2, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Bacon', category: 'MEAT', price: 5, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Chicken Fingers', category: 'MEAT', price: 5, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Grilled Chicken', category: 'MEAT', price: 5, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Roasted Chicken', category: 'MEAT', price: 5, isVegetarian: false, isVegan: false, isGlutenFree: false },

      // Specialty
      { name: 'Pineapple', category: 'SPECIALTY', price: 2, isVegetarian: true, isVegan: true, isGlutenFree: false }
    ];

    let createdToppingsCount = 0;
    for (let i = 0; i < toppings.length; i++) {
      const topping = toppings[i];
      const existingTopping = existingToppings.find(t => t.name === topping.name);
      if (!existingTopping) {
        await prisma.pizzaTopping.create({
          data: {
            name: topping.name,
            description: null,
            category: topping.category,
            price: topping.price,
            isActive: true,
            sortOrder: existingToppings.length + i + 1,
            isVegetarian: topping.isVegetarian,
            isVegan: topping.isVegan,
            isGlutenFree: topping.isGlutenFree
          }
        });
        createdToppingsCount++;
      }
    }
    console.log(`Created ${createdToppingsCount} new pizza toppings`);

    // 6. Create additional specialty calzones
    console.log('Creating additional specialty calzones...');

    // Get calzone sizes
    const calzoneSizes = await prisma.pizzaSize.findMany({
      where: { productType: 'CALZONE' }
    });

    const smallCalzoneSize = calzoneSizes.find(s => s.name === 'Small Calzone');
    const largeCalzoneSize = calzoneSizes.find(s => s.name === 'Large Calzone');

    if (smallCalzoneSize && largeCalzoneSize) {
      const additionalCalzones = [
        {
          name: 'Veggie Calzone',
          description: 'Fresh vegetable calzone',
          basePrice: 21.5,
          fillings: 'Roasted peppers, roasted onions, grilled tomatoes, mushrooms and broccoli',
          smallPrice: 21.5,
          largePrice: 29.95
        },
        {
          name: 'Traditional Calzone',
          description: 'Classic pepperoni calzone',
          basePrice: 21.5,
          fillings: 'Pepperoni, ricotta cheese, sauce and our blends of mozzarella cheese',
          smallPrice: 21.5,
          largePrice: 29.95
        },
        {
          name: 'Ham & Cheese Calzone',
          description: 'Ham and cheese calzone',
          basePrice: 21.5,
          fillings: 'Sauce, a blend of our cheese and ham and american cheese',
          smallPrice: 21.5,
          largePrice: 29.95
        },
        {
          name: 'Chicken Parmesan Calzone',
          description: 'Chicken parmesan calzone with marinara',
          basePrice: 21.5,
          fillings: 'Chicken parmesan, ricotta cheese with marinara sauce',
          smallPrice: 21.5,
          largePrice: 29.95
        },
        {
          name: 'Chicken Broccoli Alfredo Calzone',
          description: 'Chicken and broccoli with alfredo sauce',
          basePrice: 21.5,
          fillings: 'Chicken, broccoli and onions with white alfredo sauce',
          smallPrice: 21.5,
          largePrice: 29.95
        },
        {
          name: 'Greek Calzone',
          description: 'Mediterranean style calzone',
          basePrice: 21.5,
          fillings: 'Feta, spinach and tomatoes',
          smallPrice: 21.5,
          largePrice: 29.95
        },
        {
          name: 'Meatball Calzone',
          description: 'Hearty meatball calzone',
          basePrice: 21.5,
          fillings: 'Meatballs with marinara sauce and mozzarella cheese',
          smallPrice: 21.5,
          largePrice: 29.95
        }
      ];

      for (const calzone of additionalCalzones) {
        // Check if calzone already exists
        const existingCalzone = await prisma.menuItem.findFirst({
          where: {
            categoryId: calzonesCategory.id,
            name: calzone.name
          }
        });

        if (!existingCalzone) {
          await prisma.menuItem.create({
            data: {
              categoryId: calzonesCategory.id,
              name: calzone.name,
              description: calzone.description,
              basePrice: calzone.basePrice,
              sortOrder: 10 + additionalCalzones.indexOf(calzone)
            }
          });
          console.log(`Created ${calzone.name}`);
        }
      }
    }

    console.log('✅ Additional menu data population completed successfully!');

    // Get final statistics
    const finalCategories = await prisma.menuCategory.count();
    const finalItems = await prisma.menuItem.count();
    const finalToppings = await prisma.pizzaTopping.count();
    const finalSauces = await prisma.pizzaSauce.count();
    const finalCrusts = await prisma.pizzaCrust.count();

    console.log('\n📊 Final Database Statistics:');
    console.log(`  • Menu Categories: ${finalCategories}`);
    console.log(`  • Menu Items: ${finalItems}`);
    console.log(`  • Pizza Toppings: ${finalToppings}`);
    console.log(`  • Pizza Sauces: ${finalSauces}`);
    console.log(`  • Pizza Crusts: ${finalCrusts}`);

  } catch (error) {
    console.error('❌ Error populating additional menu data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateAdditionalMenuData();
