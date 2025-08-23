const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSpecialtyPizzasAPI() {
  try {
    console.log('🔍 Testing specialty pizzas API query...');
    
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`✅ Found ${specialtyPizzas.length} specialty pizzas`);
    
    // Parse ingredients JSON for each pizza
    const formattedPizzas = specialtyPizzas.map(pizza => {
      let ingredients = [];
      try {
        ingredients = pizza.ingredients ? JSON.parse(pizza.ingredients) : [];
      } catch (e) {
        console.log(`⚠️  Failed to parse ingredients for ${pizza.name}: ${pizza.ingredients}`);
        ingredients = [];
      }
      
      return {
        ...pizza,
        ingredients
      };
    });

    console.log('\n📋 Formatted pizzas:');
    formattedPizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name} (${pizza.category})`);
      console.log(`   Ingredients: ${JSON.stringify(pizza.ingredients)}`);
      console.log(`   Sizes: ${pizza.sizes.length}`);
    });

    return formattedPizzas;
    
  } catch (error) {
    console.error('❌ Error in specialty pizzas query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSpecialtyPizzasAPI();
