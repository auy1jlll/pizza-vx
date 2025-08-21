const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWingsPricing() {
  try {
    console.log('Checking Chicken & Wings pricing issues...');

    const chickenWingsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Chicken & Wings' },
      include: {
        menuItems: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!chickenWingsCategory) {
      console.log('❌ Chicken & Wings category not found');
      return;
    }

    console.log(`\n📋 Current Chicken & Wings Items (${chickenWingsCategory.menuItems.length} items):`);
    console.log('');

    const problemItems = [];
    
    chickenWingsCategory.menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Current Price: $${item.basePrice.toFixed(2)}`);
      console.log(`   ID: ${item.id}`);
      
      // Check if price looks wrong (should be 11.99, not 1199.00)
      if (item.basePrice > 100) {
        problemItems.push({
          id: item.id,
          name: item.name,
          currentPrice: item.basePrice,
          shouldBe: 11.99
        });
        console.log(`   ⚠️  PROBLEM: Price seems too high!`);
      }
      console.log('');
    });

    if (problemItems.length > 0) {
      console.log(`\n🔧 Found ${problemItems.length} items with pricing issues:`);
      problemItems.forEach(item => {
        console.log(`   - ${item.name}: $${item.currentPrice.toFixed(2)} → should be $${item.shouldBe.toFixed(2)}`);
      });
      
      console.log('\n💡 These items likely have prices stored incorrectly.');
      console.log('   They should all be $11.99 but are showing as $1199.00');
    } else {
      console.log('\n✅ All prices look correct!');
    }

  } catch (error) {
    console.error('Error checking wings pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWingsPricing();
