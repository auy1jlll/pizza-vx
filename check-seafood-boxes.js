const { PrismaClient } = require('@prisma/client');

async function checkSeafoodBoxes() {
  const prisma = new PrismaClient();
  
  try {
    const seafoodBoxes = await prisma.menuCategory.findFirst({
      where: { name: 'Seafood Boxes' },
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
    
    if (seafoodBoxes) {
      console.log('✅ Seafood Boxes category found!');
      console.log(`Category ID: ${seafoodBoxes.id}`);
      console.log(`Number of items: ${seafoodBoxes.menuItems.length}`);
      
      console.log('\nSeafood items with pricing:');
      seafoodBoxes.menuItems.forEach(item => {
        console.log(`\n- ${item.name}: $${item.basePrice}`);
        console.log(`  Description: ${item.description}`);
        console.log(`  Customization groups: ${item.customizationGroups.length}`);
        
        if (item.customizationGroups.length > 0) {
          item.customizationGroups.forEach(itemGroup => {
            const group = itemGroup.customizationGroup;
            console.log(`  Size options:`);
            group.options.forEach(option => {
              const price = item.basePrice + option.priceModifier;
              console.log(`    - ${option.name}: $${price}`);
            });
          });
        }
      });
      
    } else {
      console.log('❌ Seafood Boxes category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeafoodBoxes();
