const { PrismaClient } = require('@prisma/client');

async function listAllComponents() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📊 Current Database Components:');
    console.log('=====================================');
    
    const sizes = await prisma.pizzaSize.findMany();
    console.log('\n🍕 SIZES:');
    sizes.forEach(size => {
      console.log(`  ID: ${size.id} | ${size.name} (${size.diameter}") - $${size.basePrice}`);
    });
    
    const crusts = await prisma.pizzaCrust.findMany();
    console.log('\n🥖 CRUSTS:');
    crusts.forEach(crust => {
      console.log(`  ID: ${crust.id} | ${crust.name} - ${crust.description} (+$${crust.priceModifier})`);
    });
    
    const sauces = await prisma.pizzaSauce.findMany();
    console.log('\n🍅 SAUCES:');
    sauces.forEach(sauce => {
      console.log(`  ID: ${sauce.id} | ${sauce.name} - ${sauce.description} (+$${sauce.priceModifier})`);
    });
    
    const toppings = await prisma.pizzaTopping.findMany();
    console.log('\n🧀 TOPPINGS:');
    toppings.forEach(topping => {
      console.log(`  ID: ${topping.id} | ${topping.name} (${topping.category}) - $${topping.price}`);
    });
    
    console.log('\n🎉 Database is now ready for orders!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllComponents();
