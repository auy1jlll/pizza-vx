const { PrismaClient } = require('@prisma/client');

async function checkZitiPasta() {
  const prisma = new PrismaClient();
  
  try {
    const zitiPasta = await prisma.menuCategory.findFirst({
      where: { name: 'Ziti Pasta' },
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
    
    if (zitiPasta) {
      console.log('✅ Ziti Pasta category found!');
      console.log(`Category ID: ${zitiPasta.id}`);
      console.log(`Number of items: ${zitiPasta.menuItems.length}`);
      
      if (zitiPasta.menuItems.length > 0) {
        console.log('\nCurrent ziti pasta items:');
        zitiPasta.menuItems.forEach(item => {
          console.log(`- ${item.name}: $${item.basePrice} (${item.customizationGroups.length} customization groups)`);
        });

        // Check customization groups for first item
        if (zitiPasta.menuItems[0]?.customizationGroups.length > 0) {
          console.log(`\nCustomization groups for ${zitiPasta.menuItems[0].name}:`);
          zitiPasta.menuItems[0].customizationGroups.forEach(itemGroup => {
            const group = itemGroup.customizationGroup;
            console.log(`- ${group.name}: ${group.options.length} options (${group.isRequired ? 'Required' : 'Optional'})`);
          });
        }
      } else {
        console.log('\n⚠️  No ziti pasta items found - category exists but is empty');
      }
      
    } else {
      console.log('❌ Ziti Pasta category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkZitiPasta();
