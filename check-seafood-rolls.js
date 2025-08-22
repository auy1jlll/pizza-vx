const { PrismaClient } = require('@prisma/client');

async function checkSeafoodRolls() {
  const prisma = new PrismaClient();
  
  try {
    const seafoodRolls = await prisma.menuCategory.findFirst({
      where: { name: 'Seafood Rolls' },
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
          }
        }
      }
    });
    
    if (seafoodRolls) {
      console.log('✅ Seafood Rolls category found!');
      console.log(`Category ID: ${seafoodRolls.id}`);
      console.log(`Number of items: ${seafoodRolls.menuItems.length}`);
      
      console.log('\nSeafood rolls with pricing:');
      seafoodRolls.menuItems.forEach(item => {
        console.log(`- ${item.name}: $${item.basePrice}`);
        console.log(`  Description: ${item.description}`);
        console.log(`  Customization groups: ${item.customizationGroups.length}`);
      });

      // Show customization groups for first item
      if (seafoodRolls.menuItems[0]?.customizationGroups.length > 0) {
        console.log(`\nCustomization groups for ${seafoodRolls.menuItems[0].name}:`);
        seafoodRolls.menuItems[0].customizationGroups.forEach(itemGroup => {
          const group = itemGroup.customizationGroup;
          console.log(`- ${group.name}: ${group.options.length} options (${group.isRequired ? 'Required' : 'Optional'})`);
          group.options.forEach(option => {
            const priceDisplay = option.priceModifier > 0 ? ` (+$${option.priceModifier})` : ' (Free)';
            console.log(`  • ${option.name}${priceDisplay}`);
          });
        });
      }
      
    } else {
      console.log('❌ Seafood Rolls category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeafoodRolls();
