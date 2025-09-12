const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPizzaComponents() {
  try {
    console.log('🍕 Checking pizza components...');
    
    const sizes = await prisma.pizzaSize.findMany({ where: { isActive: true } });
    console.log('Pizza Sizes:', sizes.map(s => ({ id: s.id, name: s.name, basePrice: s.basePrice })));
    
    const crusts = await prisma.pizzaCrust.findMany({ where: { isActive: true } });
    console.log('Pizza Crusts:', crusts.map(c => ({ id: c.id, name: c.name, priceModifier: c.priceModifier })));
    
    const sauces = await prisma.pizzaSauce.findMany({ where: { isActive: true } });
    console.log('Pizza Sauces:', sauces.map(s => ({ id: s.id, name: s.name, priceModifier: s.priceModifier })));
    
    const toppings = await prisma.pizzaTopping.findMany({ where: { isActive: true } });
    console.log('Pizza Toppings:', toppings.map(t => ({ id: t.id, name: t.name, price: t.price })));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPizzaComponents();
