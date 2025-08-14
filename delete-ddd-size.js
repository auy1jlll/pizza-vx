const { PrismaClient } = require('@prisma/client');

async function deleteDddSize() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🗑️ Attempting to delete "ddd" pizza size...');

    // Find the "ddd" size
    const dddSize = await prisma.pizzaSize.findFirst({
      where: { name: 'ddd' }
    });

    if (!dddSize) {
      console.log('❌ "ddd" size not found');
      return;
    }

    console.log(`Found "ddd" size with ID: ${dddSize.id}`);

    // Check for order items using this size
    const orderItemsCount = await prisma.orderItem.count({
      where: { pizzaSizeId: dddSize.id }
    });

    console.log(`Order items using this size: ${orderItemsCount}`);

    if (orderItemsCount > 0) {
      console.log('⚠️ Cannot delete size - it is being used in order items');
      console.log('Setting size to inactive instead...');
      
      await prisma.pizzaSize.update({
        where: { id: dddSize.id },
        data: { isActive: false }
      });
      
      console.log('✅ Size deactivated successfully');
      return;
    }

    // Check for specialty pizza sizes using this size
    const specialtyCount = await prisma.specialtyPizzaSize.count({
      where: { pizzaSizeId: dddSize.id }
    });

    console.log(`Specialty pizza sizes using this size: ${specialtyCount}`);

    if (specialtyCount > 0) {
      console.log('Deleting specialty pizza size relationships...');
      await prisma.specialtyPizzaSize.deleteMany({
        where: { pizzaSizeId: dddSize.id }
      });
      console.log('✅ Specialty pizza size relationships deleted');
    }

    // Now delete the size
    await prisma.pizzaSize.delete({
      where: { id: dddSize.id }
    });

    console.log('🎉 "ddd" size deleted successfully!');

    // List remaining sizes
    const remainingSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n📋 Remaining pizza sizes:');
    remainingSizes.forEach(size => {
      console.log(`  - ${size.name} (${size.diameter}") - $${size.basePrice} ${size.isActive ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDddSize();
