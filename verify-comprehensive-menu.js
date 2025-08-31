const { PrismaClient } = require('@prisma/client');

async function verifyComprehensiveMenuData() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Verifying comprehensive menu data...\n');

    // Get all categories
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { menuItems: true }
        }
      }
    });

    console.log('📂 MENU CATEGORIES:');
    categories.forEach(cat => {
      console.log(`  ${cat.name} (${cat._count.menuItems} items)`);
    });

    console.log('\n🍕 SPECIALTY PIZZAS:');
    const specialtyCategory = categories.find(c => c.name === 'Specialty Pizzas');
    if (specialtyCategory) {
      const specialtyPizzas = await prisma.menuItem.findMany({
        where: { categoryId: specialtyCategory.id },
        orderBy: { sortOrder: 'asc' }
      });

      specialtyPizzas.forEach(pizza => {
        console.log(`  • ${pizza.name} - $${pizza.basePrice}`);
        console.log(`    ${pizza.description}`);
      });
    }

    console.log('\n🥗 SALADS:');
    const saladsCategory = categories.find(c => c.name === 'Salads');
    if (saladsCategory) {
      const salads = await prisma.menuItem.findMany({
        where: { categoryId: saladsCategory.id },
        orderBy: { sortOrder: 'asc' }
      });

      salads.forEach(salad => {
        console.log(`  • ${salad.name} - $${salad.basePrice}`);
      });
    }

    console.log('\n🧀 CALZONES:');
    const calzonesCategory = categories.find(c => c.name === 'Calzones');
    if (calzonesCategory) {
      const calzones = await prisma.menuItem.findMany({
        where: { categoryId: calzonesCategory.id },
        orderBy: { sortOrder: 'asc' }
      });

      calzones.forEach(calzone => {
        console.log(`  • ${calzone.name} - $${calzone.basePrice}`);
      });
    }

    console.log('\n🍟 SIDE ORDERS:');
    const sideOrdersCategory = categories.find(c => c.name === 'Side Orders');
    if (sideOrdersCategory) {
      const sideOrders = await prisma.menuItem.findMany({
        where: { categoryId: sideOrdersCategory.id },
        orderBy: { sortOrder: 'asc' }
      });

      sideOrders.forEach(side => {
        console.log(`  • ${side.name} - $${side.basePrice}`);
      });
    }

    console.log('\n🥤 BEVERAGES:');
    const beveragesCategory = categories.find(c => c.name === 'Beverages');
    if (beveragesCategory) {
      const beverages = await prisma.menuItem.findMany({
        where: { categoryId: beveragesCategory.id },
        orderBy: { sortOrder: 'asc' }
      });

      beverages.forEach(beverage => {
        console.log(`  • ${beverage.name} - $${beverage.basePrice}`);
      });
    }

    // Get pizza configuration data
    console.log('\n🍕 PIZZA CONFIGURATION:');

    const pizzaSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`  Sizes (${pizzaSizes.length}):`);
    pizzaSizes.forEach(size => {
      console.log(`    • ${size.name} (${size.diameter}) - $${size.basePrice}`);
    });

    const pizzaSauces = await prisma.pizzaSauce.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`\n  Sauces (${pizzaSauces.length}):`);
    pizzaSauces.forEach(sauce => {
      console.log(`    • ${sauce.name} - ${sauce.description}`);
    });

    const pizzaCrusts = await prisma.pizzaCrust.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`\n  Crusts (${pizzaCrusts.length}):`);
    pizzaCrusts.forEach(crust => {
      console.log(`    • ${crust.name} - ${crust.description}`);
    });

    const pizzaToppings = await prisma.pizzaTopping.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    // Group toppings by category
    const toppingsByCategory = {};
    pizzaToppings.forEach(topping => {
      if (!toppingsByCategory[topping.category]) {
        toppingsByCategory[topping.category] = [];
      }
      toppingsByCategory[topping.category].push(topping);
    });

    console.log(`\n  Toppings (${pizzaToppings.length}):`);
    Object.keys(toppingsByCategory).forEach(category => {
      console.log(`    ${category} (${toppingsByCategory[category].length}):`);
      toppingsByCategory[category].forEach(topping => {
        const dietary = [];
        if (topping.isVegan) dietary.push('V');
        else if (topping.isVegetarian) dietary.push('Veg');
        if (topping.isGlutenFree) dietary.push('GF');
        const dietaryStr = dietary.length > 0 ? ` (${dietary.join(', ')})` : '';
        console.log(`      • ${topping.name} - $${topping.price}${dietaryStr}`);
      });
    });

    // Get final statistics
    const totalItems = await prisma.menuItem.count();
    const totalGroups = await prisma.customizationGroup.count();
    const totalOptions = await prisma.customizationOption.count();

    console.log('\n📈 COMPREHENSIVE MENU STATISTICS:');
    console.log(`  • Total Menu Categories: ${categories.length}`);
    console.log(`  • Total Menu Items: ${totalItems}`);
    console.log(`  • Total Customization Groups: ${totalGroups}`);
    console.log(`  • Total Customization Options: ${totalOptions}`);
    console.log(`  • Total Pizza Sizes: ${pizzaSizes.length}`);
    console.log(`  • Total Pizza Sauces: ${pizzaSauces.length}`);
    console.log(`  • Total Pizza Crusts: ${pizzaCrusts.length}`);
    console.log(`  • Total Pizza Toppings: ${pizzaToppings.length}`);

    console.log('\n✅ Comprehensive menu verification complete!');

  } catch (error) {
    console.error('❌ Error verifying comprehensive menu data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyComprehensiveMenuData();
