const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupDefaultCrust() {
  try {
    console.log('🍕 Setting up default crust system...');
    
    // First, clear existing crusts
    await prisma.pizzaCrust.deleteMany({});
    console.log('✅ Cleared existing crusts');
    
    // Create one default "Regular" crust
    const regularCrust = await prisma.pizzaCrust.create({
      data: {
        name: 'Regular',
        description: 'Our classic hand-tossed crust',
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 1
      }
    });
    
    console.log('✅ Created default Regular crust:', regularCrust.name);
    
    // Show final crust data
    const crusts = await prisma.pizzaCrust.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n=== FINAL CRUST SETUP ===');
    crusts.forEach(crust => {
      console.log(`${crust.name}: +$${crust.priceModifier} - ${crust.description}`);
    });
    
    console.log('\n✅ Default crust system setup complete!');
    console.log('💡 Now you have one Regular crust with cooking levels: Light, Regular, Well Done');
    
  } catch (error) {
    console.error('❌ Error setting up crust:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDefaultCrust();
