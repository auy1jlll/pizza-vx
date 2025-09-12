const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalCheck() {
  try {
    const specialtyPizzas = await prisma.specialtyPizza.count();
    const specialtyCalzones = await prisma.specialtyCalzone.count();
    const specialtyPizzaSizes = await prisma.specialtyPizzaSize.count();
    const specialtyCalzoneSizes = await prisma.specialtyCalzoneSize.count();
    const pizzaToppings = await prisma.pizzaTopping.count();
    const modifiers = await prisma.modifier.count();
    const menuItems = await prisma.menuItem.count();
    const categories = await prisma.menuCategory.count();
    
    console.log('🎉 FINAL DEPLOYMENT STATUS:');
    console.log('============================');
    console.log(`✅ Specialty Pizzas: ${specialtyPizzas}`);
    console.log(`✅ Specialty Calzones: ${specialtyCalzones}`);
    console.log(`✅ Specialty Pizza Sizes: ${specialtyPizzaSizes}`);
    console.log(`✅ Specialty Calzone Sizes: ${specialtyCalzoneSizes}`);
    console.log(`✅ Pizza Toppings: ${pizzaToppings}`);
    console.log(`✅ Modifiers: ${modifiers}`);
    console.log(`✅ Menu Items: ${menuItems}`);
    console.log(`✅ Categories: ${categories}`);
    
    if (specialtyPizzas > 0 && specialtyPizzaSizes > 0) {
      console.log('\n🎯 SUCCESS: All specialty pizzas and sizes are loaded!');
    } else {
      console.log('\n❌ ISSUE: Missing specialty pizza data');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalCheck();
