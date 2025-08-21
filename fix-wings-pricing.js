const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixWingsPricing() {
  try {
    console.log('Fixing Chicken & Wings pricing issues...');

    // IDs of items that need price fixes (from the previous check)
    const itemsToFix = [
      { id: 'cmeknoi2u000tvk7sw656h81g', name: 'BBQ Chicken Fingers' },
      { id: 'cmeknoi2o000nvk7snhp0ib6l', name: 'BBQ Chicken Wings' },
      { id: 'cmeknoi2s000rvk7shikdyhxd', name: 'Buffalo Chicken Fingers' },
      { id: 'cmeknoi2n000lvk7smimsx8be', name: 'Buffalo Chicken Wings' },
      { id: 'cmeknoi2v000vvk7stg7uuwnd', name: 'Regular Chicken Fingers' },
      { id: 'cmeknoi2q000pvk7saaw7lmrx', name: 'Regular Chicken Wings' }
    ];

    console.log(`\nFixing ${itemsToFix.length} items with incorrect pricing...`);

    for (const item of itemsToFix) {
      try {
        const updatedItem = await prisma.menuItem.update({
          where: { id: item.id },
          data: { basePrice: 11.99 }
        });

        console.log(`✓ Fixed: ${item.name} - $1199.00 → $${updatedItem.basePrice.toFixed(2)}`);
      } catch (error) {
        console.log(`❌ Failed to fix: ${item.name} - ${error.message}`);
      }
    }

    console.log('\n🎉 Price fixing complete!');
    console.log('\nVerifying all items now have correct pricing...');

    // Verify the fixes
    const chickenWingsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Chicken & Wings' },
      include: {
        menuItems: {
          orderBy: { name: 'asc' }
        }
      }
    });

    console.log(`\n📋 Updated Chicken & Wings Items (${chickenWingsCategory.menuItems.length} items):`);
    
    chickenWingsCategory.menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.basePrice.toFixed(2)} ${item.basePrice === 11.99 ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('Error fixing wings pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixWingsPricing();
