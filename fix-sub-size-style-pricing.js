const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSubSizeStylePricing() {
  try {
    console.log('Fixing Sub Size & Style pricing modifiers...');

    const subSizeStyleGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sub Size & Style' },
      include: { options: true }
    });

    if (!subSizeStyleGroup) {
      console.log('❌ Sub Size & Style group not found');
      return;
    }

    console.log('\n🔧 Updating price modifiers:');
    
    for (const option of subSizeStyleGroup.options) {
      let newPriceModifier;
      
      if (option.name === 'SM-10"') {
        newPriceModifier = 0; // Base price (no addition)
      } else {
        newPriceModifier = 100; // +$1.00 for Large and all wraps
      }
      
      if (option.priceModifier !== newPriceModifier) {
        await prisma.customizationOption.update({
          where: { id: option.id },
          data: { priceModifier: newPriceModifier }
        });
        
        console.log(`  ✓ Fixed: ${option.name} - ${option.priceModifier} cents → ${newPriceModifier} cents (+$${(newPriceModifier / 100).toFixed(2)})`);
      } else {
        console.log(`  - ${option.name} already correct at ${option.priceModifier} cents (+$${(option.priceModifier / 100).toFixed(2)})`);
      }
    }

    console.log('\n🎉 Sub Size & Style pricing fixed!');
    
    // Verify final pricing
    const basePrice = 11.99;
    console.log('\n💰 Final Cold Subs Pricing:');
    
    const updatedGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sub Size & Style' },
      include: { options: true }
    });
    
    updatedGroup.options.forEach(option => {
      const finalPrice = basePrice + (option.priceModifier / 100);
      console.log(`   ${option.name}: $${finalPrice.toFixed(2)}`);
    });

    console.log('\n✅ Correct pricing structure:');
    console.log('   - Small (SM-10"): $11.99 (base price)');
    console.log('   - Large (LG 12") & All Wraps: $12.99 (base + $1.00)');

  } catch (error) {
    console.error('Error fixing Sub Size & Style pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSubSizeStylePricing();
