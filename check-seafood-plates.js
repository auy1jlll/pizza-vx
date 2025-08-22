const { PrismaClient } = require('@prisma/client');

async function checkSeafoodPlates() {
  const prisma = new PrismaClient();
  
  try {
    const seafoodPlates = await prisma.menuCategory.findFirst({
      where: { name: 'Seafood Plates' },
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
    
    if (seafoodPlates) {
      console.log('✅ Seafood Plates category found!');
      console.log(`Category ID: ${seafoodPlates.id}`);
      console.log(`Number of items: ${seafoodPlates.menuItems.length}`);
      
      console.log('\nSeafood plates with pricing:');
      seafoodPlates.menuItems.forEach(item => {
        console.log(`- ${item.name}: $${item.basePrice}`);
        console.log(`  Customization groups: ${item.customizationGroups.length}`);
      });

      // Show customization groups for first item
      if (seafoodPlates.menuItems[0]?.customizationGroups.length > 0) {
        console.log(`\nCustomization groups for ${seafoodPlates.menuItems[0].name}:`);
        seafoodPlates.menuItems[0].customizationGroups.forEach(itemGroup => {
          const group = itemGroup.customizationGroup;
          console.log(`\n- ${group.name}: ${group.options.length} options (${group.isRequired ? 'Required' : 'Optional'})`);
          group.options.forEach(option => {
            const priceDisplay = option.priceModifier > 0 ? ` (+$${option.priceModifier})` : ' (Free)';
            console.log(`  • ${option.name}${priceDisplay}`);
          });
        });
      }
      
    } else {
      console.log('❌ Seafood Plates category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeafoodPlates();
