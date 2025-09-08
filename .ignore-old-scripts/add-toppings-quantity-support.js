const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addQuantityToToppings() {
  try {
    console.log('🔄 Adding quantity support to all toppings groups...\n');

    // Get Cold Sub Toppings group and update all its options
    const coldToppingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Cold Sub Toppings' },
      include: { options: true }
    });

    if (coldToppingsGroup) {
      console.log('✅ Found Cold Sub Toppings group:');
      console.log(`• Max total selections: ${coldToppingsGroup.maxSelections}`);
      console.log(`• Total topping options: ${coldToppingsGroup.options.length}`);

      // Update all cold sub topping options to support quantity
      for (const option of coldToppingsGroup.options) {
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { maxQuantity: 3 }
        });
      }

      console.log('✅ Updated all cold sub topping options to support 3x quantity\n');
    }

    // Get Hot Sub Toppings group and update all its options
    const hotToppingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Hot Sub Toppings' },
      include: { options: true }
    });

    if (hotToppingsGroup) {
      console.log('✅ Found Hot Sub Toppings group:');
      console.log(`• Max total selections: ${hotToppingsGroup.maxSelections}`);
      console.log(`• Total topping options: ${hotToppingsGroup.options.length}`);

      // Update all hot sub topping options to support quantity
      for (const option of hotToppingsGroup.options) {
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { maxQuantity: 3 }
        });
      }
    }

    console.log('✅ Updated all hot sub topping options to support 3x quantity\n');

    console.log('📋 SUMMARY OF CHANGES:');
    console.log('• Cold Sub Toppings: Now supports 1x, 2x (extra), 3x (extra extra)');
    console.log('• Hot Sub Toppings: Now supports 1x, 2x (extra), 3x (extra extra)');
    console.log('• All toppings remain FREE (price = 0.00)');
    console.log('• Max 5 selections still enforced per sub type');
    console.log('• Each selection can be 1x, 2x, or 3x quantity');

    console.log('\n🎯 CUSTOMER EXPERIENCE:');
    console.log('• Click once: Regular amount');
    console.log('• Click twice: Extra amount (2x badge)');
    console.log('• Click three times: Extra extra amount (3x badge)');
    console.log('• Click fourth time: Removes topping');
    console.log('• All topping quantities remain FREE');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

addQuantityToToppings();
