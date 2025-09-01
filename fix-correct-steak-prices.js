const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSteakCheeseSubPrices() {
  try {
    console.log('🔧 Fixing Steak & Cheese Sub prices to correct values...\n');

    // Define the correct prices after $0.75 increase
    const correctPrices = {
      'Steak Bomb': 12.74,           // was $11.99 + $0.75
      'Pepper Cheese Steak': 12.25,  // was $11.50 + $0.75
      'Onion Cheese Steak': 12.25,   // was $11.50 + $0.75
      'Mushroom Cheese Steak': 12.25, // was $11.50 + $0.75
      'Steak Sub Build Your Own': 12.25 // was $11.50 + $0.75
    };

    // Get all steak and cheese subs
    const steakCheeseSubs = await prisma.menuItem.findMany({
      where: {
        category: { slug: 'steak-and-cheese-subs' }
      },
      select: { id: true, name: true, basePrice: true }
    });

    console.log('CURRENT INCORRECT PRICES:');
    steakCheeseSubs.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name}: $${sub.basePrice.toFixed(2)}`);
    });

    console.log('\n🔄 Setting correct prices...\n');

    // Update each sub to the correct price
    for (const sub of steakCheeseSubs) {
      const correctPrice = correctPrices[sub.name];
      
      if (correctPrice) {
        await prisma.menuItem.update({
          where: { id: sub.id },
          data: { basePrice: correctPrice }
        });

        console.log(`✅ ${sub.name}: $${sub.basePrice.toFixed(2)} → $${correctPrice.toFixed(2)}`);
      } else {
        console.log(`⚠️ No correct price defined for: ${sub.name}`);
      }
    }

    console.log('\n📊 CORRECTED PRICE SUMMARY:');
    console.log('='.repeat(50));
    console.log('Original → Correct (after +$0.75):');
    console.log('• Steak Bomb: $11.99 → $12.74');
    console.log('• Pepper Cheese Steak: $11.50 → $12.25');
    console.log('• Onion Cheese Steak: $11.50 → $12.25');
    console.log('• Mushroom Cheese Steak: $11.50 → $12.25');
    console.log('• Steak Sub Build Your Own: $11.50 → $12.25');

    console.log('\n✅ All steak and cheese sub prices corrected!');
    console.log('💡 The frontend should now show the correct prices after refresh.');

    // Show example order with correct pricing
    console.log('\n🥪 EXAMPLE ORDER - Steak Bomb (Corrected Pricing):');
    console.log('Steak Bomb Base: $12.74');
    console.log('✓ Large Sub Roll: $1.00');
    console.log('✓ 2x American Cheese (EXTRA): $1.50 ($0.75 × 2)');
    console.log('✓ 1x Mayo: $0.00 (FREE)');
    console.log('✓ 3x Grilled Onions (EXTRA EXTRA): $0.00 (FREE)');
    console.log('✓ 2x Grilled Mushrooms (EXTRA): $0.00 (FREE)');
    console.log('✓ 1x Lettuce: $0.00 (FREE)');
    console.log('TOTAL: $15.24 (not $15.99)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

fixSteakCheeseSubPrices();
