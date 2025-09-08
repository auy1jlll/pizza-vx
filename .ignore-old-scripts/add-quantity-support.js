const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addQuantitySupport() {
  try {
    console.log('🔄 Adding quantity support to condiments and cheese options...');

    // Update Condiments group options to support up to 3x quantity
    const condimentsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Condiments' },
      include: { options: true }
    });

    if (condimentsGroup) {
      console.log(`\n📝 Updating ${condimentsGroup.options.length} condiment options...`);
      
      for (const option of condimentsGroup.options) {
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { 
            maxQuantity: 3,
            // Keep price at 0 for condiments (they remain free)
            priceModifier: 0,
            priceType: 'FLAT'
          }
        });
        console.log(`✅ ${option.name}: Set maxQuantity=3, price=$0 (FREE)`);
      }
    }

    // Update Add Cheese group options to support up to 3x quantity
    const cheeseGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Cheese' },
      include: { options: true }
    });

    if (cheeseGroup) {
      console.log(`\n📝 Updating ${cheeseGroup.options.length} cheese options...`);
      
      for (const option of cheeseGroup.options) {
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { 
            maxQuantity: 3,
            // Keep price at 0.75 per selection (will be multiplied by quantity)
            priceModifier: 0.75,
            priceType: 'FLAT'
          }
        });
        console.log(`✅ ${option.name}: Set maxQuantity=3, price=$0.75 per selection`);
      }
    }

    console.log('\n🎉 Quantity support added successfully!');
    console.log('\n📋 How it works:');
    console.log('• Condiments: 1x = Free, 2x = Free, 3x = Free');
    console.log('• Cheese: 1x = $0.75, 2x = $1.50, 3x = $2.25');
    console.log('• Users can click the same option multiple times to add extra amounts');
    console.log('• Maximum 3 selections per topping');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

addQuantitySupport();
