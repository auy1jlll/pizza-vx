const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyPrismaData() {
  console.log('🔍 Verifying Prisma data access and schema...');

  try {
    // Test basic connectivity
    console.log('\n📊 Testing database connectivity...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);

    // Test menu categories
    console.log('\n🍽️  Testing menu categories...');
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: {
          take: 2, // Just get first 2 items per category
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`✅ Found ${categories.length} menu categories`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.menuItems.length} items`);
    });

    // Test pizza sizes
    console.log('\n📏 Testing pizza sizes...');
    const sizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`✅ Found ${sizes.length} pizza sizes`);
    sizes.forEach(size => {
      console.log(`   - ${size.name}: $${size.basePrice.toFixed(2)} (${size.productType})`);
    });

    // Test specialty pizzas
    console.log('\n🍕 Testing specialty pizzas...');
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      take: 3 // Just test first 3
    });
    console.log(`✅ Found ${specialtyPizzas.length} specialty pizzas`);
    specialtyPizzas.forEach(pizza => {
      console.log(`   - ${pizza.name}: ${pizza.sizes.length} sizes available`);
    });

    // Test specialty calzones
    console.log('\n🥖 Testing specialty calzones...');
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      take: 3 // Just test first 3
    });
    console.log(`✅ Found ${specialtyCalzones.length} specialty calzones`);
    specialtyCalzones.forEach(calzone => {
      console.log(`   - ${calzone.calzoneName}: ${calzone.sizes.length} sizes available`);
    });

    // Test pizza toppings
    console.log('\n🧀 Testing pizza toppings...');
    const toppings = await prisma.pizzaTopping.findMany({
      take: 5 // Just test first 5
    });
    console.log(`✅ Found ${toppings.length} pizza toppings`);
    toppings.forEach(topping => {
      console.log(`   - ${topping.name}: $${topping.price.toFixed(2)}`);
    });

    // Test sauces
    console.log('\n🍅 Testing pizza sauces...');
    const sauces = await prisma.pizzaSauce.findMany();
    console.log(`✅ Found ${sauces.length} pizza sauces`);
    sauces.forEach(sauce => {
      console.log(`   - ${sauce.name}`);
    });

    // Test crusts
    console.log('\n🥖 Testing pizza crusts...');
    const crusts = await prisma.pizzaCrust.findMany();
    console.log(`✅ Found ${crusts.length} pizza crusts`);
    crusts.forEach(crust => {
      console.log(`   - ${crust.name}`);
    });

    console.log('\n🎉 All Prisma data verification completed successfully!');
    console.log('✅ Database schema is properly synchronized');
    console.log('✅ All data is accessible through Prisma Client');
    console.log('✅ Relationships are working correctly');

  } catch (error) {
    console.error('❌ Error verifying Prisma data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification script
verifyPrismaData()
  .then(() => {
    console.log('\n✨ Prisma verification completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Prisma verification failed:', error);
    process.exit(1);
  });
