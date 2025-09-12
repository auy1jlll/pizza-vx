const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPizzaData() {
  try {
    console.log('🍕 Checking Pizza-Related Data...');
    console.log('==================================');
    
    // Check specialty pizzas
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true }
    });
    console.log(`\n🍕 Specialty Pizzas: ${specialtyPizzas.length}`);
    specialtyPizzas.forEach(pizza => {
      console.log(`- ${pizza.name}: $${pizza.basePrice}`);
    });
    
    // Check specialty calzones
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      where: { isActive: true }
    });
    console.log(`\n🥟 Specialty Calzones: ${specialtyCalzones.length}`);
    specialtyCalzones.forEach(calzone => {
      console.log(`- ${calzone.name}: $${calzone.basePrice}`);
    });
    
    // Check pizza sizes
    const pizzaSizes = await prisma.pizzaSize.findMany({
      where: { isActive: true }
    });
    console.log(`\n📏 Pizza Sizes: ${pizzaSizes.length}`);
    pizzaSizes.forEach(size => {
      console.log(`- ${size.name}: $${size.basePrice}`);
    });
    
    // Check pizza crusts
    const pizzaCrusts = await prisma.pizzaCrust.findMany({
      where: { isActive: true }
    });
    console.log(`\n🍞 Pizza Crusts: ${pizzaCrusts.length}`);
    pizzaCrusts.forEach(crust => {
      console.log(`- ${crust.name}: $${crust.priceModifier}`);
    });
    
    // Check pizza sauces
    const pizzaSauces = await prisma.pizzaSauce.findMany({
      where: { isActive: true }
    });
    console.log(`\n🍅 Pizza Sauces: ${pizzaSauces.length}`);
    pizzaSauces.forEach(sauce => {
      console.log(`- ${sauce.name}: $${sauce.priceModifier}`);
    });
    
    // Check pizza toppings
    const pizzaToppings = await prisma.pizzaTopping.findMany({
      where: { isActive: true }
    });
    console.log(`\n🥓 Pizza Toppings: ${pizzaToppings.length}`);
    pizzaToppings.slice(0, 10).forEach(topping => {
      console.log(`- ${topping.name}: $${topping.price}`);
    });
    if (pizzaToppings.length > 10) {
      console.log(`... and ${pizzaToppings.length - 10} more toppings`);
    }
    
    // Check if we have pizza categories
    const pizzaCategories = await prisma.menuCategory.findMany({
      where: {
        isActive: true,
        name: {
          contains: 'pizza',
          mode: 'insensitive'
        }
      }
    });
    console.log(`\n🍕 Pizza Categories: ${pizzaCategories.length}`);
    pizzaCategories.forEach(cat => {
      console.log(`- ${cat.name}`);
    });
    
    // Check calzone categories
    const calzoneCategories = await prisma.menuCategory.findMany({
      where: {
        isActive: true,
        name: {
          contains: 'calzone',
          mode: 'insensitive'
        }
      }
    });
    console.log(`\n🥟 Calzone Categories: ${calzoneCategories.length}`);
    calzoneCategories.forEach(cat => {
      console.log(`- ${cat.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPizzaData();
