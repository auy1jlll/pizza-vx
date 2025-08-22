const { PrismaClient } = require('@prisma/client');

async function checkSandwiches() {
  const prisma = new PrismaClient();
  
  try {
    const sandwiches = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' },
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
    
    if (sandwiches) {
      console.log('✅ Sandwiches category found!');
      console.log(`Category ID: ${sandwiches.id}`);
      console.log(`Number of items: ${sandwiches.menuItems.length}`);
      
      if (sandwiches.menuItems.length > 0) {
        console.log('\nCurrent sandwich items:');
        sandwiches.menuItems.forEach(item => {
          console.log(`- ${item.name}: $${item.basePrice} (${item.customizationGroups.length} customization groups)`);
        });

        // Check customization groups for first item
        if (sandwiches.menuItems[0]?.customizationGroups.length > 0) {
          console.log(`\nCustomization groups for ${sandwiches.menuItems[0].name}:`);
          sandwiches.menuItems[0].customizationGroups.forEach(itemGroup => {
            const group = itemGroup.customizationGroup;
            console.log(`- ${group.name}: ${group.options.length} options (${group.isRequired ? 'Required' : 'Optional'})`);
          });
        }
      } else {
        console.log('\n⚠️  No sandwich items found - category exists but is empty');
      }
      
    } else {
      console.log('❌ Sandwiches category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSandwiches();
