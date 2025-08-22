const { PrismaClient } = require('@prisma/client');

async function checkDinnerPlates() {
  const prisma = new PrismaClient();
  
  try {
    const dinnerPlates = await prisma.menuCategory.findFirst({
      where: { name: 'Dinner Plates' },
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
    
    if (dinnerPlates) {
      console.log('✅ Dinner Plates category found!');
      console.log(`Category ID: ${dinnerPlates.id}`);
      console.log(`Number of items: ${dinnerPlates.menuItems.length}`);
      
      dinnerPlates.menuItems.forEach(item => {
        console.log(`- ${item.name}: $${item.basePrice} (${item.customizationGroups.length} customization groups)`);
      });

      // Check customization groups
      const allGroups = dinnerPlates.menuItems[0]?.customizationGroups || [];
      console.log(`\nCustomization groups for ${dinnerPlates.menuItems[0]?.name}:`);
      allGroups.forEach(itemGroup => {
        const group = itemGroup.customizationGroup;
        console.log(`- ${group.name}: ${group.options.length} options (${group.isRequired ? 'Required' : 'Optional'})`);
      });
      
    } else {
      console.log('❌ Dinner Plates category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDinnerPlates();
