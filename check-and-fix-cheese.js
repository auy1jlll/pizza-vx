const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCheeseOptions() {
  try {
    console.log('🔍 Checking cheese options...\n');

    const cheeseGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Cheese' },
      include: { options: true }
    });

    if (cheeseGroup) {
      console.log('Cheese group found:');
      console.log(`Name: ${cheeseGroup.name}`);
      console.log(`Options count: ${cheeseGroup.options.length}`);
      
      cheeseGroup.options.forEach((option, index) => {
        console.log(`${index + 1}. ${option.name}`);
        console.log(`   Price Modifier: ${option.priceModifier}`);
        console.log(`   Max Quantity: ${option.maxQuantity}`);
        console.log('');
      });

      // Update each option to $0.75
      for (const option of cheeseGroup.options) {
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { priceModifier: 0.75 }
        });
        console.log(`✅ Updated ${option.name} to $0.75`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkCheeseOptions();
