const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showPricing() {
  try {
    console.log('🍕 CURRENT PRICING SETUP:');
    console.log('');
    
    const allSizes = await prisma.pizzaSize.findMany({ 
      orderBy: { sortOrder: 'asc' } 
    });
    
    console.log('📊 Pizza Sizes:');
    allSizes.filter(s => s.productType === 'PIZZA').forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });
    
    console.log('');
    console.log('🥟 Calzone Sizes:');
    allSizes.filter(s => s.productType === 'CALZONE').forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });
    
    console.log('');
    console.log('🧄 Toppings (SHARED between pizzas and calzones):');
    const toppings = await prisma.pizzaTopping.findMany({ 
      orderBy: { sortOrder: 'asc' } 
    });
    
    const categories = ['CHEESE', 'MEAT', 'VEGETABLE', 'PREMIUM'];
    categories.forEach(cat => {
      const catToppings = toppings.filter(t => t.category === cat);
      if (catToppings.length > 0) {
        console.log(`   ${cat}:`);
        catToppings.forEach(t => {
          console.log(`     ${t.name}: +$${t.price}`);
        });
      }
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

showPricing();
