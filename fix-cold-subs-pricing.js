const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixColdSubsPricing() {
  try {
    console.log('Fixing Cold Subs pricing - updating to $11.99 for small size...');

    // Find the Cold Subs category
    const coldSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Cold Subs' },
      include: {
        menuItems: true
      }
    });

    if (!coldSubsCategory) {
      console.log('❌ Cold Subs category not found');
      return;
    }

    console.log(`Found Cold Subs category with ${coldSubsCategory.menuItems.length} items`);
    
    // Check current pricing
    console.log('\n📋 Current Cold Sub Prices:');
    coldSubsCategory.menuItems.forEach(item => {
      console.log(`   ${item.name}: $${item.basePrice.toFixed(2)}`);
    });

    // Update all cold sub items to have base price of $11.99
    const correctBasePrice = 11.99;
    
    console.log(`\n🔧 Updating all cold subs to base price: $${correctBasePrice.toFixed(2)}`);
    
    for (const item of coldSubsCategory.menuItems) {
      if (item.basePrice !== correctBasePrice) {
        const updatedItem = await prisma.menuItem.update({
          where: { id: item.id },
          data: { basePrice: correctBasePrice }
        });
        
        console.log(`  ✓ Fixed: ${item.name} - $${item.basePrice.toFixed(2)} → $${updatedItem.basePrice.toFixed(2)}`);
      } else {
        console.log(`  - ${item.name} already correct at $${item.basePrice.toFixed(2)}`);
      }
    }

    console.log('\n🎉 Cold Subs pricing fixed!');
    
    // Verify the pricing with Sub Size & Style options
    const subSizeStyleGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sub Size & Style' },
      include: { options: true }
    });

    if (subSizeStyleGroup) {
      console.log('\n📋 Final Cold Subs Pricing with Size & Style Options:');
      subSizeStyleGroup.options.forEach(option => {
        const finalPrice = correctBasePrice + (option.priceModifier / 100);
        console.log(`   ${option.name}: $${finalPrice.toFixed(2)}`);
      });
    }

    console.log('\n✅ All cold subs now correctly priced:');
    console.log('   - Small (SM-10"): $11.99');
    console.log('   - Large (LG 12") & Wraps: $12.99');

  } catch (error) {
    console.error('Error fixing cold subs pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixColdSubsPricing();
