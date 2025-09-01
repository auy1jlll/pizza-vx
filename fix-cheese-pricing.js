const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCheesepricing() {
  try {
    console.log('🔧 Fixing cheese pricing...\n');

    // Get the cheese group and update pricing
    const cheeseGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Cheese' },
      include: { options: true }
    });

    if (cheeseGroup) {
      console.log('Found cheese group with options:');
      for (const option of cheeseGroup.options) {
        console.log(`• ${option.name}: $${option.price.toFixed(2)}`);
        
        // Update each cheese option to cost $0.75
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { price: 0.75 }
        });
      }
      
      console.log('\n✅ Updated all cheese options to $0.75 each');
    }

    // Verify the changes
    const updatedCheeseGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Cheese' },
      include: { options: true }
    });

    console.log('\n📋 Updated cheese pricing:');
    for (const option of updatedCheeseGroup.options) {
      const quantityText = option.maxQuantity > 1 ? ` (up to ${option.maxQuantity}x, price multiplied)` : '';
      console.log(`• ${option.name}: $${option.price.toFixed(2)}${quantityText}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

fixCheesepricing();
