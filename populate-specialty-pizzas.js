const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateSpecialtyPizzas() {
  console.log('Populating specialty pizzas...');

  try {
    // Get pizza sizes for connecting specialty pizzas
    const pizzaSizes = await prisma.pizzaSize.findMany({
      where: { productType: 'PIZZA' }
    });

    const smallPizzaSize = pizzaSizes.find(s => s.name === 'Small Pizza');
    const largePizzaSize = pizzaSizes.find(s => s.name === 'Large Pizza');

    if (!smallPizzaSize || !largePizzaSize) {
      throw new Error('Pizza sizes not found');
    }

    // Specialty pizzas data from backup
    const specialtyPizzas = [
      {
        name: 'Chicken Alfredo',
        description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
        basePrice: 15.45,
        category: 'Premium',
        ingredients: '["Alfredo Sauce","Chicken","Broccoli","Onions","Cheese Blend"]',
        sortOrder: 1
      },
      {
        name: 'BBQ Chicken',
        description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["BBQ Sauce","Chicken","Onion","Bacon","Cheese"]',
        sortOrder: 2
      },
      {
        name: 'House Special',
        description: 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["Meatball","Sausage","Pepperoni","Mushrooms","Grilled Peppers","Grilled Onions","Cheese"]',
        sortOrder: 3
      },
      {
        name: 'Buffalo Chicken',
        description: 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["Buffalo Chicken","Grilled Onion","Grilled Peppers","Extra Cheese"]',
        sortOrder: 4
      },
      {
        name: 'Meat Lovers',
        description: 'Meatball, Sausage, Pepperoni, Bacon, Salami and Ham',
        basePrice: 16.5,
        category: 'Meat Lovers',
        ingredients: '["Meatball","Sausage","Pepperoni","Bacon","Salami","Ham","Cheese"]',
        sortOrder: 5
      },
      {
        name: 'Athenian',
        description: 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["Chicken","Alfredo Sauce","Grilled Onion","Fresh Spinach","Feta Cheese","Mozzarella"]',
        sortOrder: 6
      },
      {
        name: 'Veggie Pizza',
        description: 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli',
        basePrice: 16.5,
        category: 'Vegetarian',
        ingredients: '["Roasted Peppers","Roasted Onions","Fresh Tomatoes","Mushrooms","Broccoli","Cheese"]',
        sortOrder: 7
      }
    ];

    for (const pizza of specialtyPizzas) {
      // Check if specialty pizza already exists
      const existingPizza = await prisma.specialtyPizza.findUnique({
        where: { name: pizza.name }
      });

      let specialtyPizza;
      if (existingPizza) {
        // Update existing pizza
        specialtyPizza = await prisma.specialtyPizza.update({
          where: { id: existingPizza.id },
          data: pizza
        });
        console.log(`Updated specialty pizza: ${pizza.name}`);
      } else {
        // Create new specialty pizza
        specialtyPizza = await prisma.specialtyPizza.create({
          data: pizza
        });
        console.log(`Created specialty pizza: ${pizza.name}`);
      }

      // Create or update specialty pizza sizes
      const sizes = [
        {
          pizzaSizeId: smallPizzaSize.id,
          price: smallPizzaSize.basePrice + pizza.basePrice - largePizzaSize.basePrice // Small base + specialty premium
        },
        {
          pizzaSizeId: largePizzaSize.id,
          price: pizza.basePrice // Large base price + specialty premium
        }
      ];

      for (const size of sizes) {
        await prisma.specialtyPizzaSize.upsert({
          where: {
            specialtyPizzaId_pizzaSizeId: {
              specialtyPizzaId: specialtyPizza.id,
              pizzaSizeId: size.pizzaSizeId
            }
          },
          update: size,
          create: {
            specialtyPizzaId: specialtyPizza.id,
            ...size
          }
        });
      }
    }

    console.log('Specialty pizzas populated successfully!');

  } catch (error) {
    console.error('Error populating specialty pizzas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateSpecialtyPizzas()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
