const { PrismaClient } = require('@prisma/client');

async function updateComponentFields() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Updating component fields...');
    
    // Update sizes to ensure they have proper fields
    const sizes = await prisma.pizzaSize.findMany();
    console.log('Found sizes:', sizes.length);
    
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      await prisma.pizzaSize.update({
        where: { id: size.id },
        data: {
          isActive: size.isActive ?? true,
          sortOrder: size.sortOrder ?? i + 1
        }
      });
    }
    
    // Update crusts
    const crusts = await prisma.pizzaCrust.findMany();
    console.log('Found crusts:', crusts.length);
    
    for (let i = 0; i < crusts.length; i++) {
      const crust = crusts[i];
      await prisma.pizzaCrust.update({
        where: { id: crust.id },
        data: {
          isActive: crust.isActive ?? true,
          sortOrder: crust.sortOrder ?? i + 1
        }
      });
    }
    
    // Update sauces
    const sauces = await prisma.pizzaSauce.findMany();
    console.log('Found sauces:', sauces.length);
    
    for (let i = 0; i < sauces.length; i++) {
      const sauce = sauces[i];
      await prisma.pizzaSauce.update({
        where: { id: sauce.id },
        data: {
          isActive: sauce.isActive ?? true,
          sortOrder: sauce.sortOrder ?? i + 1
        }
      });
    }
    
    // Update toppings
    const toppings = await prisma.pizzaTopping.findMany();
    console.log('Found toppings:', toppings.length);
    
    for (let i = 0; i < toppings.length; i++) {
      const topping = toppings[i];
      await prisma.pizzaTopping.update({
        where: { id: topping.id },
        data: {
          isActive: topping.isActive ?? true,
          sortOrder: topping.sortOrder ?? i + 1,
          isVegan: topping.isVegan ?? false
        }
      });
    }
    
    console.log('✅ All components updated with proper fields!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateComponentFields();
