const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSpecialtyPizzas() {
  try {
    console.log('🍕 Creating specialty pizzas...');

    // First, get the pizza sizes to map them properly
    const pizzaSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('Available pizza sizes:', pizzaSizes.map(s => `${s.name} (${s.diameter})`));

    // Find Small and Large sizes (adjust these names if they're different in your DB)
    const smallSize = pizzaSizes.find(s => s.name.toLowerCase().includes('small') || s.diameter === '10"' || s.diameter === '12"');
    const largeSize = pizzaSizes.find(s => s.name.toLowerCase().includes('large') || s.diameter === '16"' || s.diameter === '18"');

    if (!smallSize || !largeSize) {
      console.log('Available sizes:', pizzaSizes);
      throw new Error('Could not find Small and Large pizza sizes. Please check the size names in your database.');
    }

    console.log(`Using sizes: Small=${smallSize.name} (${smallSize.diameter}), Large=${largeSize.name} (${largeSize.diameter})`);

    // Define the specialty pizzas based on your list
    const specialtyPizzas = [
      {
        name: 'Chicken Alfredo',
        description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
        category: 'Premium',
        ingredients: JSON.stringify(['Alfredo Sauce', 'Chicken', 'Broccoli', 'Onions', 'Cheese Blend']),
        basePrice: 15.45, // Small price
        smallPrice: 15.45,
        largePrice: 22.45,
        sortOrder: 1
      },
      {
        name: 'BBQ Chicken',
        description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
        category: 'Premium',
        ingredients: JSON.stringify(['BBQ Sauce', 'Chicken', 'Onion', 'Bacon', 'Cheese']),
        basePrice: 16.50,
        smallPrice: 16.50,
        largePrice: 23.50,
        sortOrder: 2
      },
      {
        name: 'House Special',
        description: 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions',
        category: 'Premium',
        ingredients: JSON.stringify(['Meatball', 'Sausage', 'Pepperoni', 'Mushrooms', 'Grilled Peppers', 'Grilled Onions', 'Cheese']),
        basePrice: 16.50,
        smallPrice: 16.50,
        largePrice: 23.50,
        sortOrder: 3
      },
      {
        name: 'Buffalo Chicken',
        description: 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese',
        category: 'Premium',
        ingredients: JSON.stringify(['Buffalo Chicken', 'Grilled Onion', 'Grilled Peppers', 'Extra Cheese']),
        basePrice: 16.50,
        smallPrice: 16.50,
        largePrice: 23.50,
        sortOrder: 4
      },
      {
        name: 'Meat Lovers',
        description: 'Meatball, Sausage, Pepperoni, Bacon, Salami and Ham',
        category: 'Meat Lovers',
        ingredients: JSON.stringify(['Meatball', 'Sausage', 'Pepperoni', 'Bacon', 'Salami', 'Ham', 'Cheese']),
        basePrice: 16.50,
        smallPrice: 16.50,
        largePrice: 23.50,
        sortOrder: 5
      },
      {
        name: 'Athenian',
        description: 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese',
        category: 'Premium',
        ingredients: JSON.stringify(['Chicken', 'Alfredo Sauce', 'Grilled Onion', 'Fresh Spinach', 'Feta Cheese', 'Mozzarella']),
        basePrice: 16.50,
        smallPrice: 16.50,
        largePrice: 23.50,
        sortOrder: 6
      },
      {
        name: 'Veggie Pizza',
        description: 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli',
        category: 'Vegetarian',
        ingredients: JSON.stringify(['Roasted Peppers', 'Roasted Onions', 'Fresh Tomatoes', 'Mushrooms', 'Broccoli', 'Cheese']),
        basePrice: 16.50,
        smallPrice: 16.50,
        largePrice: 23.50,
        sortOrder: 7
      }
    ];

    // Delete existing specialty pizzas to avoid duplicates
    console.log('🗑️ Cleaning up existing specialty pizzas...');
    await prisma.specialtyPizzaSize.deleteMany({});
    await prisma.specialtyPizza.deleteMany({});

    // Create each specialty pizza with its sizes
    for (const pizzaData of specialtyPizzas) {
      console.log(`Creating ${pizzaData.name}...`);
      
      // Create the specialty pizza
      const specialtyPizza = await prisma.specialtyPizza.create({
        data: {
          name: pizzaData.name,
          description: pizzaData.description,
          basePrice: pizzaData.basePrice,
          category: pizzaData.category,
          ingredients: pizzaData.ingredients,
          isActive: true,
          sortOrder: pizzaData.sortOrder
        }
      });

      // Create the size variants
      await prisma.specialtyPizzaSize.create({
        data: {
          specialtyPizzaId: specialtyPizza.id,
          pizzaSizeId: smallSize.id,
          price: pizzaData.smallPrice,
          isAvailable: true
        }
      });

      await prisma.specialtyPizzaSize.create({
        data: {
          specialtyPizzaId: specialtyPizza.id,
          pizzaSizeId: largeSize.id,
          price: pizzaData.largePrice,
          isAvailable: true
        }
      });

      console.log(`✅ Created ${pizzaData.name} with Small ($${pizzaData.smallPrice}) and Large ($${pizzaData.largePrice}) sizes`);
    }

    // Verify the creation
    const createdPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n🎉 Successfully created specialty pizzas:');
    createdPizzas.forEach(pizza => {
      console.log(`\n📍 ${pizza.name} (${pizza.category})`);
      console.log(`   Description: ${pizza.description}`);
      console.log(`   Ingredients: ${JSON.parse(pizza.ingredients).join(', ')}`);
      pizza.sizes.forEach(size => {
        console.log(`   ${size.pizzaSize.name} (${size.pizzaSize.diameter}): $${size.price.toFixed(2)}`);
      });
    });

    console.log(`\n✅ Total specialty pizzas created: ${createdPizzas.length}`);

  } catch (error) {
    console.error('❌ Error creating specialty pizzas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSpecialtyPizzas();
