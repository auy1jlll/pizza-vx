const { PrismaClient } = require('@prisma/client');

async function checkPizzaComponents() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking pizza components in database...\n');
    
    // Check pizza sizes
    const sizes = await prisma.pizzaSize.findMany();
    console.log('🍕 Pizza Sizes:');
    sizes.forEach(size => {
      console.log(`  - ${size.id}: ${size.name} ($${size.basePrice})`);
    });
    
    // Check pizza crusts
    const crusts = await prisma.pizzaCrust.findMany();
    console.log('\n🍞 Pizza Crusts:');
    crusts.forEach(crust => {
      console.log(`  - ${crust.id}: ${crust.name} (+$${crust.priceModifier})`);
    });
    
    // Check pizza sauces
    const sauces = await prisma.pizzaSauce.findMany();
    console.log('\n🍅 Pizza Sauces:');
    sauces.forEach(sauce => {
      console.log(`  - ${sauce.id}: ${sauce.name} (+$${sauce.priceModifier})`);
    });
    
    // Check pizza toppings
    const toppings = await prisma.pizzaTopping.findMany();
    console.log('\n🧀 Pizza Toppings:');
    toppings.forEach(topping => {
      console.log(`  - ${topping.id}: ${topping.name} ($${topping.price})`);
    });
    
    // Check menu items
    const menuItems = await prisma.menuItem.findMany({
      take: 5
    });
    console.log('\n🍽️ Sample Menu Items:');
    menuItems.forEach(item => {
      console.log(`  - ${item.id}: ${item.name} ($${item.basePrice})`);
    });
    
    return {
      sizes: sizes.length > 0 ? sizes[0] : null,
      crusts: crusts.length > 0 ? crusts[0] : null,
      sauces: sauces.length > 0 ? sauces[0] : null,
      toppings: toppings.length > 0 ? toppings[0] : null,
      menuItems: menuItems.length > 0 ? menuItems[0] : null
    };
    
  } catch (error) {
    console.error('❌ Error checking pizza components:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

checkPizzaComponents().then(components => {
  if (components) {
    console.log('\n✅ Found pizza components in database');
    if (components.sizes) console.log(`Sample size ID: ${components.sizes.id}`);
    if (components.crusts) console.log(`Sample crust ID: ${components.crusts.id}`);
    if (components.sauces) console.log(`Sample sauce ID: ${components.sauces.id}`);
    if (components.toppings) console.log(`Sample topping ID: ${components.toppings.id}`);
    if (components.menuItems) console.log(`Sample menu item ID: ${components.menuItems.id}`);
  } else {
    console.log('❌ Failed to retrieve pizza components');
  }
}).catch(console.error);
