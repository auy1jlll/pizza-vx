const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function increaseSteakCheeseSubPrices() {
  try {
    console.log('💰 Increasing Steak & Cheese Sub prices by $0.75...\n');

    // Get all steak and cheese subs
    const steakCheeseSubs = await prisma.menuItem.findMany({
      where: {
        category: { slug: 'steak-and-cheese-subs' }
      },
      select: { id: true, name: true, basePrice: true }
    });

    console.log(`📋 Found ${steakCheeseSubs.length} steak and cheese subs:\n`);

    // Show current prices
    console.log('CURRENT PRICES:');
    steakCheeseSubs.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name}: $${sub.basePrice.toFixed(2)}`);
    });

    console.log('\n🔄 Updating prices...\n');

    // Update each sub's price
    const updatedSubs = [];
    for (const sub of steakCheeseSubs) {
      const newPrice = sub.basePrice + 0.75;
      
      await prisma.menuItem.update({
        where: { id: sub.id },
        data: { basePrice: newPrice }
      });

      updatedSubs.push({
        name: sub.name,
        oldPrice: sub.basePrice,
        newPrice: newPrice,
        increase: 0.75
      });

      console.log(`✅ ${sub.name}: $${sub.basePrice.toFixed(2)} → $${newPrice.toFixed(2)} (+$0.75)`);
    }

    console.log('\n📊 PRICE UPDATE SUMMARY:');
    console.log('='.repeat(60));
    updatedSubs.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name}:`);
      console.log(`   Old Price: $${sub.oldPrice.toFixed(2)}`);
      console.log(`   New Price: $${sub.newPrice.toFixed(2)}`);
      console.log(`   Increase:  +$${sub.increase.toFixed(2)}`);
      console.log('');
    });

    console.log('✅ All steak and cheese sub prices increased by $0.75');
    console.log(`✅ Updated ${updatedSubs.length} menu items`);

    // Show example order with new pricing
    const firstSub = updatedSubs[0];
    console.log(`\n🥪 EXAMPLE ORDER - ${firstSub.name} (Updated Pricing):`);
    console.log(`${firstSub.name} Base: $${firstSub.newPrice.toFixed(2)}`);
    console.log('✓ Large Sub Roll: $1.00');
    console.log('✓ 2x American Cheese (EXTRA): $1.50 ($0.75 × 2)');
    console.log('✓ 1x Mayo: $0.00 (FREE)');
    console.log('✓ 3x Grilled Onions (EXTRA EXTRA): $0.00 (FREE)');
    console.log('✓ 2x Grilled Mushrooms (EXTRA): $0.00 (FREE)');
    console.log('✓ 1x Lettuce: $0.00 (FREE)');
    console.log('(3/5 max toppings used)');
    
    const exampleTotal = firstSub.newPrice + 1.00 + 1.50;
    console.log(`TOTAL: $${exampleTotal.toFixed(2)}`);

    console.log('\n🎯 PRICE INCREASE RATIONALE:');
    console.log('• Steak and cheese subs now reflect premium protein pricing');
    console.log('• Maintains competitive positioning in the market');
    console.log('• Covers increased costs of quality steak ingredients');
    console.log('• Consistent with industry standards for steak subs');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

increaseSteakCheeseSubPrices();
