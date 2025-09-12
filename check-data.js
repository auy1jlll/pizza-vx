const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const specialtyPizzas = await prisma.specialtyPizza.count();
    const specialtyCalzones = await prisma.specialtyCalzone.count();
    const pizzaToppings = await prisma.pizzaTopping.count();
    const modifiers = await prisma.modifier.count();
    const menuItems = await prisma.menuItem.count();
    const categories = await prisma.menuCategory.count();
    
    console.log('📊 Current Data Counts:');
    console.log(`Specialty Pizzas: ${specialtyPizzas}`);
    console.log(`Specialty Calzones: ${specialtyCalzones}`);
    console.log(`Pizza Toppings: ${pizzaToppings}`);
    console.log(`Modifiers: ${modifiers}`);
    console.log(`Menu Items: ${menuItems}`);
    console.log(`Categories: ${categories}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
