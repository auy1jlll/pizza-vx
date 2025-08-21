const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBLTSubPricing() {
  try {
    console.log('Checking BLT Sub pricing issue...');

    // Find the BLT Sub specifically
    const bltSub = await prisma.menuItem.findFirst({
      where: { name: 'BLT Sub' },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    if (bltSub) {
      console.log('\n📋 BLT Sub Details:');
      console.log(`   ID: ${bltSub.id}`);
      console.log(`   Name: ${bltSub.name}`);
      console.log(`   Base Price: $${bltSub.basePrice.toFixed(2)} (stored as ${bltSub.basePrice})`);
      console.log(`   Category: ${bltSub.category.name}`);
      console.log(`   Description: ${bltSub.description}`);
      console.log(`   Active: ${bltSub.isActive}`);
      console.log(`   Available: ${bltSub.isAvailable}`);
      
      console.log('\n🎯 Customization Groups:');
      bltSub.customizationGroups.forEach(cg => {
        console.log(`   - ${cg.customizationGroup.name} (${cg.customizationGroup.type}, ${cg.isRequired ? 'Required' : 'Optional'})`);
        console.log(`     Options (${cg.customizationGroup.options.length}):`);
        cg.customizationGroup.options.forEach(option => {
          const finalPrice = bltSub.basePrice + (option.priceModifier / 100);
          console.log(`       • ${option.name}: $${finalPrice.toFixed(2)} (base $${bltSub.basePrice.toFixed(2)} + $${(option.priceModifier / 100).toFixed(2)})`);
        });
      });

      // Check if there's a pricing issue
      if (bltSub.basePrice < 10) {
        console.log('\n⚠️  PROBLEM DETECTED:');
        console.log(`   BLT Sub base price is $${bltSub.basePrice.toFixed(2)} - should be $11.99`);
        console.log('   This explains why you\'re seeing $0.12 in the display');
        
        // Fix the BLT Sub pricing
        console.log('\n🔧 Fixing BLT Sub base price...');
        const updatedBLT = await prisma.menuItem.update({
          where: { id: bltSub.id },
          data: { basePrice: 11.99 }
        });
        
        console.log(`   ✓ Fixed: BLT Sub base price updated to $${updatedBLT.basePrice.toFixed(2)}`);
        
        // Show corrected pricing with customizations
        console.log('\n✅ Corrected BLT Sub Pricing:');
        bltSub.customizationGroups.forEach(cg => {
          if (cg.customizationGroup.name === 'Sub Size & Style') {
            cg.customizationGroup.options.forEach(option => {
              const finalPrice = 11.99 + (option.priceModifier / 100);
              console.log(`   ${option.name}: $${finalPrice.toFixed(2)}`);
            });
          }
        });
      } else {
        console.log('\n✅ BLT Sub base price looks correct');
      }

    } else {
      console.log('❌ BLT Sub not found');
    }

    // Also check all Cold Subs to make sure they're all correct
    console.log('\n📋 Checking all Cold Subs base prices:');
    const coldSubs = await prisma.menuItem.findMany({
      where: {
        category: {
          name: 'Cold Subs'
        }
      },
      orderBy: { name: 'asc' }
    });

    coldSubs.forEach(sub => {
      const status = sub.basePrice === 11.99 ? '✅' : '❌';
      console.log(`   ${status} ${sub.name}: $${sub.basePrice.toFixed(2)}`);
    });

  } catch (error) {
    console.error('Error checking BLT Sub:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBLTSubPricing();
