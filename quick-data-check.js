const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n');

    // Check pizza sizes
    const sizes = await prisma.pizzaSize.findMany();
    console.log(`🍕 Pizza Sizes: ${sizes.length} found`);
    sizes.forEach(size => console.log(`   - ${size.name} (${size.diameter}) - $${size.basePrice}`));

    // Check pizza crusts
    const crusts = await prisma.pizzaCrust.findMany();
    console.log(`\n🥖 Pizza Crusts: ${crusts.length} found`);
    crusts.forEach(crust => console.log(`   - ${crust.name} (+$${crust.priceModifier})`));

    // Check pizza sauces
    const sauces = await prisma.pizzaSauce.findMany();
    console.log(`\n🍅 Pizza Sauces: ${sauces.length} found`);
    sauces.forEach(sauce => console.log(`   - ${sauce.name} (spice: ${sauce.spiceLevel})`));

    // Check pizza toppings
    const toppings = await prisma.pizzaTopping.findMany();
    console.log(`\n🧀 Pizza Toppings: ${toppings.length} found`);
    toppings.slice(0, 5).forEach(topping => console.log(`   - ${topping.name} ($${topping.price}) [${topping.category}]`));
    if (toppings.length > 5) console.log(`   ... and ${toppings.length - 5} more`);

    // Check orders
    const orders = await prisma.order.findMany();
    console.log(`\n📋 Orders: ${orders.length} found`);

    // Check users
    const users = await prisma.user.findMany();
    console.log(`\n👥 Users: ${users.length} found`);

    // Check app settings
    const settings = await prisma.appSetting.findMany();
    console.log(`\n⚙️ App Settings: ${settings.length} found`);

    // Check menu categories
    const categories = await prisma.menuCategory.findMany();
    console.log(`\n📂 Menu Categories: ${categories.length} found`);

    // Check menu items
    const menuItems = await prisma.menuItem.findMany();
    console.log(`\n🍽️ Menu Items: ${menuItems.length} found`);

    console.log('\n✅ Data check complete!');

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
