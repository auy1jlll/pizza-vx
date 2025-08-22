const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugSpecialtyPizzas() {
  try {
    console.log('🔍 Debugging specialty pizzas...');
    
    const count = await prisma.specialtyPizza.count();
    console.log('Total specialty pizzas in DB:', count);
    
    const pizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });
    
    console.log('\n📊 All specialty pizzas:');
    pizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name} (${pizza.category})`);
      console.log(`   Active: ${pizza.isActive}`);
      console.log(`   Base Price: $${pizza.basePrice}`);
      console.log(`   Sizes: ${pizza.sizes.length}`);
      if (pizza.sizes.length > 0) {
        pizza.sizes.forEach(size => {
          console.log(`     - ${size.pizzaSize.name}: $${size.price} (Available: ${size.isAvailable})`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSpecialtyPizzas();
