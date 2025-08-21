const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySalads() {
  try {
    const saladsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Salads' },
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

    if (saladsCategory) {
      console.log(`✅ Salads Category: ${saladsCategory.name} (${saladsCategory.menuItems.length} items)`);
      console.log('');
      
      saladsCategory.menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - $${item.basePrice.toFixed(2)}`);
        console.log(`   ${item.description}`);
        
        if (item.customizationGroups.length > 0) {
          item.customizationGroups.forEach(cg => {
            console.log(`   ✓ Customization: ${cg.customizationGroup.name} (${cg.customizationGroup.options.length} options)`);
          });
        }
        console.log('');
      });
    } else {
      console.log('❌ Salads category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySalads();
