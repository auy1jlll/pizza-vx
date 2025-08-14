const { PrismaClient } = require('@prisma/client');

async function explainSizeStructure() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Explaining Pizza Size Database Structure...\n');

    // Get all pizza sizes
    const sizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('📊 PIZZA SIZES TABLE (pizza_sizes):');
    console.log('===================================');
    sizes.forEach(size => {
      console.log(`ID: ${size.id}`);
      console.log(`Name: "${size.name}"`);
      console.log(`Diameter: ${size.diameter}`);
      console.log(`Base Price: $${size.basePrice}`);
      console.log(`Active: ${size.isActive}`);
      console.log(`Sort Order: ${size.sortOrder}`);
      console.log('---');
    });

    // Show how specialty pizzas reference sizes
    const specialtyWithSizes = await prisma.specialtyPizza.findFirst({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    if (specialtyWithSizes) {
      console.log('\n🍕 HOW SPECIALTY PIZZAS REFERENCE SIZES:');
      console.log('========================================');
      console.log(`Specialty Pizza: "${specialtyWithSizes.name}"`);
      console.log('Available sizes:');
      specialtyWithSizes.sizes.forEach(sizeRelation => {
        console.log(`  - Size ID: ${sizeRelation.pizzaSizeId}`);
        console.log(`    Size Name: "${sizeRelation.pizzaSize.name}"`);
        console.log(`    Price for this pizza: $${sizeRelation.price}`);
        console.log(`    Available: ${sizeRelation.isAvailable}`);
        console.log('    ---');
      });
    }

    // Show what happens in orders
    console.log('\n📦 HOW ORDERS REFERENCE SIZES:');
    console.log('==============================');
    console.log('When a customer places an order, the system:');
    console.log('1. Stores the SIZE ID (like "cmeb123abc...") in order_items.pizzaSizeId');
    console.log('2. The SIZE NAME is looked up when displaying the order');
    console.log('3. This ensures data consistency even if size names change');

    console.log('\n🔧 KEY POINTS:');
    console.log('==============');
    console.log('✅ Always use SIZE IDs in database relationships');
    console.log('✅ Size names are for display purposes only');
    console.log('✅ IDs never change, names can be updated');
    console.log('✅ This prevents broken references if names are modified');

    console.log('\n💡 EXAMPLE API CALLS:');
    console.log('=====================');
    console.log('To create an order item:');
    console.log('POST /api/cart');
    console.log('{');
    console.log('  "pizzaSizeId": "' + sizes[0]?.id + '",  // Use ID, not name!');
    console.log('  "pizzaCrustId": "crust123...",');
    console.log('  "pizzaSauceId": "sauce123...",');
    console.log('  // ... other fields');
    console.log('}');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

explainSizeStructure();
