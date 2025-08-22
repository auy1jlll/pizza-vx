const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePizzaBuilderBasePricing() {
  try {
    console.log('🍕 UPDATING PIZZA BUILDER BASE PRICING');
    console.log('======================================');
    console.log('New Base Prices (includes cheese at regular intensity):');
    console.log('- Small cheese pizza: $11.25');
    console.log('- Large cheese pizza: $16.50');
    console.log('');

    // Get current pizza sizes
    const currentSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('Current pizza sizes:');
    currentSizes.forEach(size => {
      console.log(`  ${size.name}: $${size.basePrice} (${size.diameter})`);
    });

    // Update Small pizza size
    const smallSize = currentSizes.find(size => size.name.toLowerCase().includes('small'));
    if (smallSize) {
      await prisma.pizzaSize.update({
        where: { id: smallSize.id },
        data: { basePrice: 11.25 }
      });
      console.log(`✅ Updated ${smallSize.name}: $${smallSize.basePrice} → $11.25`);
    } else {
      console.log('❌ Small size not found');
    }

    // Update Large pizza size
    const largeSize = currentSizes.find(size => size.name.toLowerCase().includes('large'));
    if (largeSize) {
      await prisma.pizzaSize.update({
        where: { id: largeSize.id },
        data: { basePrice: 16.50 }
      });
      console.log(`✅ Updated ${largeSize.name}: $${largeSize.basePrice} → $16.50`);
    } else {
      console.log('❌ Large size not found');
    }

    // Verify the changes
    console.log('\n📊 UPDATED PIZZA SIZES:');
    console.log('========================');
    
    const updatedSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    updatedSizes.forEach(size => {
      console.log(`${size.name}: $${size.basePrice} (${size.diameter})`);
      console.log(`  - Includes: Basic cheese pizza at regular intensity`);
      console.log(`  - Additional toppings will add to this base price`);
      console.log('');
    });

    console.log('✅ Pizza builder base pricing updated successfully!');
    console.log('');
    console.log('📝 Notes:');
    console.log('- Base prices now include cheese at regular intensity');
    console.log('- Additional toppings ($2.00 standard, $5.00 premium) add to base price');
    console.log('- Sauce changes (all free) do not affect price');
    console.log('- Crust upgrades may add additional cost');

  } catch (error) {
    console.error('❌ Error updating pizza builder pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePizzaBuilderBasePricing();
