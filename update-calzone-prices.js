const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCalzonePrices() {
  try {
    console.log('🥟 Updating calzone prices...');
    
    // Show current prices first
    const currentSizes = await prisma.pizzaSize.findMany({ 
      where: { productType: 'CALZONE' },
      orderBy: { sortOrder: 'asc' } 
    });
    
    console.log('📊 Current Calzone Prices:');
    currentSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });
    
    // Update Small Calzone to $16.00
    const smallUpdate = await prisma.pizzaSize.updateMany({
      where: {
        productType: 'CALZONE',
        name: 'Small Calzone'
      },
      data: {
        basePrice: 16.00
      }
    });
    
    // Update Large Calzone to $21.00
    const largeUpdate = await prisma.pizzaSize.updateMany({
      where: {
        productType: 'CALZONE',
        name: 'Large Calzone'
      },
      data: {
        basePrice: 21.00
      }
    });
    
    console.log(`\n✅ Updated ${smallUpdate.count} Small Calzone record(s)`);
    console.log(`✅ Updated ${largeUpdate.count} Large Calzone record(s)`);
    
    // Show new prices
    const updatedSizes = await prisma.pizzaSize.findMany({ 
      where: { productType: 'CALZONE' },
      orderBy: { sortOrder: 'asc' } 
    });
    
    console.log('\n🎯 NEW Calzone Prices:');
    updatedSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });
    
    // Show comparison with pizza prices
    const pizzaSizes = await prisma.pizzaSize.findMany({ 
      where: { productType: 'PIZZA' },
      orderBy: { sortOrder: 'asc' } 
    });
    
    console.log('\n📊 Price Comparison:');
    console.log('🍕 PIZZA PRICES:');
    pizzaSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });
    
    console.log('🥟 CALZONE PRICES:');
    updatedSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice}`);
    });
    
    console.log('\n💰 Price Difference:');
    if (pizzaSizes.length >= 2 && updatedSizes.length >= 2) {
      const smallDiff = updatedSizes[0].basePrice - pizzaSizes[0].basePrice;
      const largeDiff = updatedSizes[1].basePrice - pizzaSizes[1].basePrice;
      console.log(`   Small: +$${smallDiff.toFixed(2)} more than pizza`);
      console.log(`   Large: +$${largeDiff.toFixed(2)} more than pizza`);
    }
    
  } catch (error) {
    console.error('❌ Error updating calzone prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCalzonePrices();
