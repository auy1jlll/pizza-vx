const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createPizzaSizesAndSpecialtyPizzas() {
  try {
    console.log('🍕 Creating pizza sizes and specialty pizzas...');

    // First, create the pizza sizes if they don't exist
    console.log('📏 Creating pizza sizes...');
    
    const pizzaSizes = [
      {
        name: 'Small',
        diameter: '12"',
        basePrice: 8.99,
        description: 'Perfect for 1-2 people',
        sortOrder: 1
      },
      {
        name: 'Large',
        diameter: '16"',
        basePrice: 12.99,
        description: 'Great for families and sharing',
        sortOrder: 2
      }
    ];

    // Delete existing sizes to avoid duplicates
    await prisma.specialtyPizzaSize.deleteMany({});
    await prisma.specialtyPizza.deleteMany({});
    await prisma.pizzaSize.deleteMany({});

    // Create pizza sizes
    const createdSizes = [];
    for (const sizeData of pizzaSizes) {
      const size = await prisma.pizzaSize.create({
        data: sizeData
      });
      createdSizes.push(size);
      console.log(`✅ Created pizza size: ${size.name} (${size.diameter}) - Base: $${size.basePrice}`);
    }

    const smallSize = createdSizes.find(s => s.name === 'Small');
    const largeSize = createdSizes.find(s => s.name === 'Large');

    // Now create the specialty pizzas
    console.log('\n🍕 Creating specialty pizzas...');

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
    console.log(`✅ Total pizza sizes created: ${createdSizes.length}`);

  } catch (error) {
    console.error('❌ Error creating pizza data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPizzaSizesAndSpecialtyPizzas();
