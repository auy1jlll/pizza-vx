const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubSizeStylePricing() {
  try {
    console.log('Checking Sub Size & Style customization group pricing...');

    const subSizeStyleGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sub Size & Style' },
      include: { options: true }
    });

    if (subSizeStyleGroup) {
      console.log('\n📋 Sub Size & Style Options:');
      subSizeStyleGroup.options.forEach(option => {
        console.log(`   ${option.name}: priceModifier = ${option.priceModifier} cents (+$${(option.priceModifier / 100).toFixed(2)})`);
      });

      // Calculate final prices with new base price
      const basePrice = 11.99;
      console.log('\n💰 Final Pricing for Cold Subs:');
      subSizeStyleGroup.options.forEach(option => {
        const finalPrice = basePrice + (option.priceModifier / 100);
        console.log(`   ${option.name}: $${finalPrice.toFixed(2)} (Base $${basePrice.toFixed(2)} + $${(option.priceModifier / 100).toFixed(2)})`);
      });

      // Check if SM-10" should be the base (0 modifier) and others should be +$1.00 (100 cents)
      const smOption = subSizeStyleGroup.options.find(opt => opt.name === 'SM-10"');
      if (smOption && smOption.priceModifier !== 0) {
        console.log('\n⚠️  SM-10" should have 0 price modifier (it should be the base price)');
      }

      const lgOption = subSizeStyleGroup.options.find(opt => opt.name === 'LG 12"');
      if (lgOption && lgOption.priceModifier !== 100) {
        console.log('\n⚠️  LG 12" should have 100 cents price modifier (+$1.00)');
      }

    } else {
      console.log('❌ Sub Size & Style group not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubSizeStylePricing();
