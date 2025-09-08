const { PrismaClient } = require('@prisma/client');

async function fixProductionSpecialtyPizzas() {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });

  try {
    console.log('🔧 Starting Production Specialty Pizza Fix...');

    // First, let's check what's currently in production
    const currentPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    console.log(`Found ${currentPizzas.length} current specialty pizzas in production`);
    
    // Log current state
    currentPizzas.forEach(pizza => {
      console.log(`- ${pizza.name}: ${pizza.sizes.length} sizes`);
    });

    // Clean specialty pizzas with proper data
    const properSpecialtyPizzas = [
      {
        name: 'Chicken Alfredo',
        description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
        basePrice: 15.45,
        category: 'Premium',
        ingredients: '["Alfredo Sauce","Chicken","Broccoli","Onions","Cheese Blend"]',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'BBQ Chicken',
        description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["BBQ Sauce","Chicken","Onion","Bacon","Cheese"]',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'House Special',
        description: 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["Meatball","Sausage","Pepperoni","Mushrooms","Grilled Peppers","Grilled Onions","Cheese"]',
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'Buffalo Chicken',
        description: 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["Buffalo Chicken","Grilled Onion","Grilled Peppers","Extra Cheese"]',
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Meat Lovers',
        description: 'Meatball, Sausage, Pepperoni, Bacon, Salami and Ham',
        basePrice: 16.5,
        category: 'Meat Lovers',
        ingredients: '["Meatball","Sausage","Pepperoni","Bacon","Salami","Ham","Cheese"]',
        sortOrder: 5,
        isActive: true
      },
      {
        name: 'Athenian',
        description: 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["Chicken","Alfredo Sauce","Grilled Onion","Fresh Spinach","Feta Cheese","Mozzarella"]',
        sortOrder: 6,
        isActive: true
      },
      {
        name: 'Veggie Pizza',
        description: 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli',
        basePrice: 16.5,
        category: 'Vegetarian',
        ingredients: '["Roasted Peppers","Roasted Onions","Fresh Tomatoes","Mushrooms","Broccoli","Cheese"]',
        sortOrder: 7,
        isActive: true
      }
    ];

    // Get pizza sizes
    const pizzaSizes = await prisma.pizzaSize.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`Found ${pizzaSizes.length} pizza sizes`);

    if (pizzaSizes.length === 0) {
      console.log('❌ No pizza sizes found. Creating default sizes...');
      
      // Create default pizza sizes
      await prisma.pizzaSize.createMany({
        data: [
          {
            name: 'Small',
            diameter: '10"',
            basePrice: 12.99,
            description: 'Personal size pizza',
            isActive: true,
            sortOrder: 1
          },
          {
            name: 'Medium', 
            diameter: '12"',
            basePrice: 15.99,
            description: 'Perfect for sharing',
            isActive: true,
            sortOrder: 2
          },
          {
            name: 'Large',
            diameter: '14"',
            basePrice: 18.99,
            description: 'Family size pizza',
            isActive: true,
            sortOrder: 3
          }
        ],
        skipDuplicates: true
      });

      // Refresh pizza sizes
      const newPizzaSizes = await prisma.pizzaSize.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      });
      pizzaSizes.push(...newPizzaSizes);
    }

    // Delete old specialty pizza sizes first
    console.log('🗑️ Cleaning old specialty pizza sizes...');
    await prisma.specialtyPizzaSize.deleteMany({});

    // Update or create specialty pizzas
    console.log('🍕 Creating/updating specialty pizzas...');
    
    for (const pizzaData of properSpecialtyPizzas) {
      const specialtyPizza = await prisma.specialtyPizza.upsert({
        where: { name: pizzaData.name },
        update: pizzaData,
        create: pizzaData
      });

      console.log(`✅ ${pizzaData.name} - Created/Updated`);

      // Create sizes for this specialty pizza
      for (const size of pizzaSizes) {
        let price;
        const isPremium = pizzaData.category === 'Premium' || pizzaData.category === 'Meat Lovers';
        
        switch (size.name) {
          case 'Small':
            price = isPremium ? 14.99 : 12.99;
            break;
          case 'Medium':
            price = isPremium ? 18.99 : 16.99;
            break;
          case 'Large':
            price = isPremium ? 22.99 : 20.99;
            break;
          default:
            price = size.basePrice + 2.00;
        }

        await prisma.specialtyPizzaSize.create({
          data: {
            specialtyPizzaId: specialtyPizza.id,
            pizzaSizeId: size.id,
            price: price,
            isAvailable: true
          }
        });

        console.log(`  + ${size.name}: $${price}`);
      }
    }

    // Deactivate any old/garbage specialty pizzas not in our clean list
    const cleanNames = properSpecialtyPizzas.map(p => p.name);
    await prisma.specialtyPizza.updateMany({
      where: {
        name: {
          notIn: cleanNames
        }
      },
      data: {
        isActive: false
      }
    });

    // Final verification
    const finalPizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n🎉 Production Specialty Pizza Fix Complete!');
    console.log(`✅ Active Specialty Pizzas: ${finalPizzas.length}`);
    
    finalPizzas.forEach(pizza => {
      console.log(`   ${pizza.name}: ${pizza.sizes.length} sizes (${pizza.sizes.map(s => s.pizzaSize.name + ':$' + s.price).join(', ')})`);
    });

  } catch (error) {
    console.error('❌ Error fixing production specialty pizzas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  fixProductionSpecialtyPizzas()
    .then(() => {
      console.log('✅ Production fix completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixProductionSpecialtyPizzas };
