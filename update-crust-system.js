const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePizzaCrustSystem() {
  try {
    console.log('🍕 UPDATING PIZZA CRUST SYSTEM');
    console.log('===============================');
    console.log('Adding baking levels:');
    console.log('- Regular baked (default)');
    console.log('- Lightly baked');
    console.log('- Well done');
    console.log('');

    // Check current crusts
    const currentCrusts = await prisma.pizzaCrust.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('Current pizza crusts:');
    currentCrusts.forEach(crust => {
      console.log(`  ${crust.name}: +$${crust.priceModifier} - ${crust.description || 'No description'}`);
    });

    // Define the new crust system with baking levels
    const newCrusts = [
      {
        name: 'Regular Baked',
        description: 'Classic crust baked to perfection (default)',
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Lightly Baked',
        description: 'Softer crust with lighter baking',
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Well Done',
        description: 'Extra crispy crust baked longer',
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 3
      }
    ];

    console.log('\n🔄 Updating crust options...');
    
    // Clear existing crusts first to avoid conflicts
    console.log('Removing old crust options...');
    await prisma.pizzaCrust.deleteMany({});
    
    // Add new crusts
    for (const crust of newCrusts) {
      const created = await prisma.pizzaCrust.create({
        data: crust
      });
      console.log(`✅ Created: ${created.name} (+$${created.priceModifier})`);
    }

    // Verify the changes
    console.log('\n📊 FINAL CRUST OPTIONS:');
    console.log('=======================');
    
    const finalCrusts = await prisma.pizzaCrust.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    finalCrusts.forEach(crust => {
      console.log(`${crust.name}`);
      console.log(`  Description: ${crust.description}`);
      console.log(`  Price Modifier: +$${crust.priceModifier} (${crust.priceModifier === 0 ? 'Free' : 'Additional cost'})`);
      console.log(`  Sort Order: ${crust.sortOrder}`);
      console.log('');
    });

    console.log('✅ Pizza crust system updated successfully!');
    console.log('');
    console.log('📝 Notes:');
    console.log('- All crust options are free (no price modifier)');
    console.log('- Regular Baked is the default option');
    console.log('- Customers can choose their preferred baking level');
    console.log('- This affects texture/crispiness, not price');

  } catch (error) {
    console.error('❌ Error updating pizza crust system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePizzaCrustSystem();
