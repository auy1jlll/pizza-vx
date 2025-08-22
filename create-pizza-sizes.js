const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPizzaSizes() {
  try {
    console.log('🍕 CREATING PIZZA SIZES FOR PIZZA COMPONENTS');
    console.log('===============================================');
    
    // Check existing sizes first
    const existingSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`Found ${existingSizes.length} existing pizza sizes:`);
    existingSizes.forEach(size => {
      console.log(`  - ${size.name}: $${size.basePrice} (${size.diameter})`);
    });
    
    // Define the pizza sizes that components need
    const requiredSizes = [
      {
        name: 'Small',
        diameter: '10"',
        basePrice: 12.99,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Large', 
        diameter: '14"',
        basePrice: 18.99,
        isActive: true,
        sortOrder: 2
      }
    ];
    
    console.log('\n🎯 CHECKING FOR REQUIRED SIZES:');
    console.log('================================');
    
    for (const requiredSize of requiredSizes) {
      const existing = existingSizes.find(size => 
        size.name.toLowerCase() === requiredSize.name.toLowerCase()
      );
      
      if (existing) {
        console.log(`✅ ${requiredSize.name} already exists (ID: ${existing.id})`);
      } else {
        console.log(`❌ ${requiredSize.name} missing - creating...`);
        
        const created = await prisma.pizzaSize.create({
          data: requiredSize
        });
        
        console.log(`✅ Created ${created.name}: $${created.basePrice} (ID: ${created.id})`);
      }
    }
    
    // Show final state
    console.log('\n📊 FINAL PIZZA SIZES:');
    console.log('======================');
    const finalSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    finalSizes.forEach((size, index) => {
      console.log(`${index + 1}. ${size.name} - $${size.basePrice} (${size.diameter})`);
    });
    
    console.log(`\n✅ Pizza components now have ${finalSizes.length} size options available!`);
    
  } catch (error) {
    console.error('❌ Error creating pizza sizes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPizzaSizes();
