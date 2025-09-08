// Production database check script
const { PrismaClient } = require('@prisma/client');

async function checkProductionData() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PRODUCTION DATABASE CHECK ===\n');

    // Check specialty pizzas
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    console.log(`🍕 SPECIALTY PIZZAS: ${specialtyPizzas.length} found`);
    if (specialtyPizzas.length === 0) {
      console.log('❌ No specialty pizzas found in production!');
    } else {
      specialtyPizzas.slice(0, 3).forEach(pizza => {
        console.log(`  - ${pizza.name} ($${pizza.basePrice})`);
      });
      if (specialtyPizzas.length > 3) console.log(`  ... and ${specialtyPizzas.length - 3} more`);
    }

    // Check specialty calzones
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    console.log(`\n🥟 SPECIALTY CALZONES: ${specialtyCalzones.length} found`);
    if (specialtyCalzones.length === 0) {
      console.log('❌ No specialty calzones found in production!');
    } else {
      specialtyCalzones.slice(0, 3).forEach(calzone => {
        console.log(`  - ${calzone.calzoneName} ($${calzone.basePrice})`);
      });
      if (specialtyCalzones.length > 3) console.log(`  ... and ${specialtyCalzones.length - 3} more`);
    }

    // Check menu categories
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { menuItems: true }
        },
        subcategories: {
          where: { isActive: true },
          include: {
            _count: {
              select: { menuItems: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📂 MENU CATEGORIES: ${categories.length} found`);
    categories.forEach(cat => {
      const subcatInfo = cat.subcategories.length > 0 ? ` (${cat.subcategories.length} subcategories)` : '';
      console.log(`  - ${cat.name}: ${cat._count.menuItems} items${subcatInfo}`);
      
      if (cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`    └── ${sub.name}: ${sub._count.menuItems} items`);
        });
      }
    });

    // Check if we have pizza sizes
    const pizzaSizes = await prisma.pizzaSize.findMany();
    console.log(`\n📏 PIZZA SIZES: ${pizzaSizes.length} found`);
    if (pizzaSizes.length === 0) {
      console.log('❌ No pizza sizes found! This could be why specialty items are missing.');
    }

    console.log('\n=== RECOMMENDATIONS ===');
    if (specialtyPizzas.length === 0) {
      console.log('🔧 Need to populate specialty pizzas');
    }
    if (specialtyCalzones.length === 0) {
      console.log('🔧 Need to populate specialty calzones');
    }
    if (categories.length < 5) {
      console.log('🔧 Need to populate more menu categories');
    }

  } catch (error) {
    console.error('Error checking production data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionData();
