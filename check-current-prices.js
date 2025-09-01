const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCurrentSteakCheesePrices() {
  try {
    console.log('🔍 Checking current steak and cheese sub prices in database...\n');

    const steakCheeseSubs = await prisma.menuItem.findMany({
      where: {
        category: { slug: 'steak-and-cheese-subs' }
      },
      select: { 
        id: true, 
        name: true, 
        basePrice: true,
        updatedAt: true 
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('📊 CURRENT DATABASE PRICES:');
    console.log('=' .repeat(50));
    steakCheeseSubs.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name}`);
      console.log(`   Base Price: $${sub.basePrice.toFixed(2)}`);
      console.log(`   Last Updated: ${sub.updatedAt.toISOString()}`);
      console.log('');
    });

    console.log('🎯 EXPECTED PRICES AFTER $0.75 INCREASE:');
    console.log('• Steak Bomb: $13.49');
    console.log('• Pepper Cheese Steak: $13.00');
    console.log('• Onion Cheese Steak: $13.00');
    console.log('• Mushroom Cheese Steak: $13.00');
    console.log('• Steak Sub Build Your Own: $13.00');

    // Check if prices match expected values
    const expectedPrices = {
      'Steak Bomb': 13.49,
      'Pepper Cheese Steak': 13.00,
      'Onion Cheese Steak': 13.00,
      'Mushroom Cheese Steak': 13.00,
      'Steak Sub Build Your Own': 13.00
    };

    console.log('\n✅ VERIFICATION:');
    let allCorrect = true;
    steakCheeseSubs.forEach(sub => {
      const expected = expectedPrices[sub.name];
      const actual = parseFloat(sub.basePrice.toFixed(2));
      const isCorrect = Math.abs(actual - expected) < 0.01;
      
      if (isCorrect) {
        console.log(`✅ ${sub.name}: $${actual.toFixed(2)} (CORRECT)`);
      } else {
        console.log(`❌ ${sub.name}: $${actual.toFixed(2)} (EXPECTED: $${expected.toFixed(2)})`);
        allCorrect = false;
      }
    });

    if (allCorrect) {
      console.log('\n🎉 Database prices are correct! The issue might be frontend caching.');
      console.log('💡 Suggestion: Refresh the browser or restart the development server.');
    } else {
      console.log('\n⚠️ Database prices need to be corrected.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkCurrentSteakCheesePrices();
