const { PrismaClient } = require('@prisma/client');

// Use production database connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://pizza_user:pizza123@91.99.194.255:5432/pizza_vx_db'
    }
  }
});

async function checkAndFixProduction() {
  try {
    console.log('🔍 Checking current production specialty pizzas...');
    
    // Check current state
    const currentPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: { pizzaSize: true },
          orderBy: { pizzaSize: { sortOrder: 'asc' } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`\n📊 CURRENT PRODUCTION STATE:`);
    console.log(`Total specialty pizzas: ${currentPizzas.length}`);
    
    if (currentPizzas.length === 0) {
      console.log('❌ NO SPECIALTY PIZZAS FOUND!');
    } else {
      currentPizzas.forEach((pizza, index) => {
        console.log(`${index + 1}. ${pizza.name}`);
        console.log(`   Category: ${pizza.category}`);
        console.log(`   Sizes: ${pizza.sizes.length}`);
        pizza.sizes.forEach(size => {
          console.log(`   - ${size.pizzaSize.name}: $${size.price}`);
        });
        console.log('');
      });
    }
    
    // If we have old garbage data (3 pizzas with wrong structure) or no pizzas, fix it
    const needsFix = currentPizzas.length !== 5 || 
                     currentPizzas.some(p => p.sizes.length !== 2) ||
                     currentPizzas.some(p => p.name.includes('test') || p.name.includes('old'));
    
    if (needsFix) {
      console.log('🔧 FIXING PRODUCTION DATA...');
      
      // Clear all existing
      await prisma.specialtyPizza.deleteMany({});
      console.log('✅ Cleared old data');
      
      // Get available sizes
      const sizes = await prisma.pizzaSize.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      });
      
      const smallSize = sizes.find(s => s.name.toLowerCase().includes('small'));
      const largeSize = sizes.find(s => s.name.toLowerCase().includes('large'));
      
      if (!smallSize || !largeSize) {
        console.error('❌ Cannot find Small and Large sizes');
        return;
      }
      
      console.log(`Found sizes: ${smallSize.name} and ${largeSize.name}`);
      
      // Create the correct 5 specialty pizzas with exactly 2 sizes each
      const CORRECT_PIZZAS = [
        {
          name: "Margherita Supreme",
          description: "Fresh mozzarella, basil, San Marzano tomatoes, and premium olive oil",
          basePrice: 16.99,
          category: "CLASSIC",
          ingredients: "Fresh mozzarella, basil, San Marzano tomatoes, olive oil",
          imageUrl: "/images/pizzas/margherita-supreme.jpg",
          sortOrder: 1,
          sizes: [14.99, 19.99]
        },
        {
          name: "Truffle Mushroom",
          description: "Wild mushrooms, truffle oil, caramelized onions, and fontina cheese",
          basePrice: 22.99,
          category: "GOURMET",
          ingredients: "Wild mushrooms, truffle oil, caramelized onions, fontina cheese",
          imageUrl: "/images/pizzas/truffle-mushroom.jpg",
          sortOrder: 2,
          sizes: [19.99, 25.99]
        },
        {
          name: "Prosciutto Fig",
          description: "Prosciutto di Parma, fresh figs, arugula, balsamic glaze, and goat cheese",
          basePrice: 24.99,
          category: "GOURMET",
          ingredients: "Prosciutto di Parma, fresh figs, arugula, balsamic glaze, goat cheese",
          imageUrl: "/images/pizzas/prosciutto-fig.jpg",
          sortOrder: 3,
          sizes: [21.99, 27.99]
        },
        {
          name: "BBQ Chicken Deluxe",
          description: "Grilled chicken, BBQ sauce, red onions, cilantro, and smoked mozzarella",
          basePrice: 19.99,
          category: "SPECIALTY",
          ingredients: "Grilled chicken, BBQ sauce, red onions, cilantro, smoked mozzarella",
          imageUrl: "/images/pizzas/bbq-chicken-deluxe.jpg",
          sortOrder: 4,
          sizes: [17.99, 22.99]
        },
        {
          name: "Mediterranean Veggie",
          description: "Roasted vegetables, feta cheese, olives, sun-dried tomatoes, and herbs",
          basePrice: 18.99,
          category: "VEGETARIAN",
          ingredients: "Roasted vegetables, feta cheese, olives, sun-dried tomatoes, herbs",
          imageUrl: "/images/pizzas/mediterranean-veggie.jpg",
          sortOrder: 5,
          sizes: [16.99, 21.99]
        }
      ];
      
      for (const pizzaData of CORRECT_PIZZAS) {
        const pizza = await prisma.specialtyPizza.create({
          data: {
            name: pizzaData.name,
            description: pizzaData.description,
            basePrice: pizzaData.basePrice,
            category: pizzaData.category,
            ingredients: pizzaData.ingredients,
            imageUrl: pizzaData.imageUrl,
            sortOrder: pizzaData.sortOrder,
            isActive: true
          }
        });
        
        // Create exactly 2 sizes
        await prisma.specialtyPizzaSize.createMany({
          data: [
            {
              specialtyPizzaId: pizza.id,
              pizzaSizeId: smallSize.id,
              price: pizzaData.sizes[0],
              isAvailable: true
            },
            {
              specialtyPizzaId: pizza.id,
              pizzaSizeId: largeSize.id,
              price: pizzaData.sizes[1],
              isAvailable: true
            }
          ]
        });
        
        console.log(`✅ Created: ${pizzaData.name} (Small: $${pizzaData.sizes[0]}, Large: $${pizzaData.sizes[1]})`);
      }
      
      console.log('\n🎉 PRODUCTION FIXED!');
    } else {
      console.log('✅ Production data looks correct');
    }
    
    // Final verification
    const finalPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: { pizzaSize: true },
          orderBy: { pizzaSize: { sortOrder: 'asc' } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`\n📊 FINAL VERIFICATION:`);
    console.log(`Total specialty pizzas: ${finalPizzas.length}`);
    finalPizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name} (${pizza.sizes.length} sizes)`);
      pizza.sizes.forEach(size => {
        console.log(`   - ${size.pizzaSize.name}: $${size.price}`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixProduction();
