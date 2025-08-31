const { PrismaClient } = require('@prisma/client');

async function verifyCompleteMenuData() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Verifying complete menu data...\n');

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

    // Get customization stats
    const totalItems = await prisma.menuItem.count();
    const totalGroups = await prisma.customizationGroup.count();
    const totalOptions = await prisma.customizationOption.count();

    console.log('\n📈 MENU STATISTICS:');
    console.log(`  • Total Menu Items: ${totalItems}`);
    console.log(`  • Total Customization Groups: ${totalGroups}`);
    console.log(`  • Total Customization Options: ${totalOptions}`);

    console.log('\n✅ Menu verification complete!');

  } catch (error) {
    console.error('❌ Error verifying menu data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCompleteMenuData();
