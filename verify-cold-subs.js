const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyColdSubs() {
  try {
    const coldSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Cold Subs' },
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: {
                    options: true
                  }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (coldSubsCategory) {
      console.log(`✅ ${coldSubsCategory.name} Category`);
      console.log(`   Description: ${coldSubsCategory.description}`);
      console.log(`   Menu Items: ${coldSubsCategory.menuItems.length}`);
      console.log('');
      
      console.log('🥪 Cold Sub Items with Size & Style Options:');
      console.log('');
      
      coldSubsCategory.menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - Base: $${item.basePrice.toFixed(2)}`);
        console.log(`   ${item.description}`);
        
        // Show customization options
        item.customizationGroups.forEach(cg => {
          if (cg.customizationGroup.name === 'Sub Size & Style') {
            console.log(`   Size & Style Options (${cg.customizationGroup.type}, ${cg.isRequired ? 'Required' : 'Optional'}):`);
            cg.customizationGroup.options.forEach(option => {
              const finalPrice = item.basePrice + (option.priceModifier / 100);
              console.log(`     - ${option.name}: $${finalPrice.toFixed(2)} (+$${(option.priceModifier / 100).toFixed(2)})`);
            });
          }
        });
        console.log('');
      });

      // Show summary
      const subSizeGroup = coldSubsCategory.menuItems[0]?.customizationGroups.find(cg => 
        cg.customizationGroup.name === 'Sub Size & Style'
      );
      
      if (subSizeGroup) {
        console.log('📋 Available Sizes & Styles for ALL Cold Subs:');
        subSizeGroup.customizationGroup.options.forEach(option => {
          const basePrice = 8.99;
          const finalPrice = basePrice + (option.priceModifier / 100);
          console.log(`   ${option.name}: $${finalPrice.toFixed(2)}`);
        });
      }

    } else {
      console.log('❌ Cold Subs category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyColdSubs();
