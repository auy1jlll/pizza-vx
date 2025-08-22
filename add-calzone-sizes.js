const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCalzoneSizes() {
  try {
    console.log('🍕 Adding calzone sizes with caution...');
    
    // First, check existing pizza sizes for reference
    const pizzaSizes = await prisma.pizzaSize.findMany({ 
      orderBy: { sortOrder: 'asc' } 
    });
    
    console.log('📊 Current pizza sizes:');
    pizzaSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice} (${size.diameter})`);
    });
    
    // Add calzone sizes conservatively (+$2 from pizza prices)
    const calzoneSmall = await prisma.pizzaSize.create({
      data: {
        name: 'Small Calzone',
        diameter: 'Personal size calzone',
        basePrice: 13.25, // $11.25 + $2
        isActive: true,
        sortOrder: 10 // Place after pizza sizes
      }
    });
    
    const calzoneLarge = await prisma.pizzaSize.create({
      data: {
        name: 'Large Calzone',
        diameter: 'Family size calzone',
        basePrice: 18.50, // $16.50 + $2
        isActive: true,
        sortOrder: 11
      }
    });
    
    console.log('\n✅ Successfully added calzone sizes:');
    console.log(`   ${calzoneSmall.name}: $${calzoneSmall.basePrice}`);
    console.log(`   ${calzoneLarge.name}: $${calzoneLarge.basePrice}`);
    
    console.log('\n🔍 Verifying all sizes:');
    const allSizes = await prisma.pizzaSize.findMany({ 
      orderBy: { sortOrder: 'asc' } 
    });
    allSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice} (${size.productType || 'PIZZA'})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding calzone sizes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCalzoneSizes();
