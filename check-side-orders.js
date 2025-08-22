const { PrismaClient } = require('@prisma/client');

async function checkSideOrders() {
  const prisma = new PrismaClient();
  
  try {
    const sideOrders = await prisma.menuCategory.findFirst({
      where: { name: 'Side Orders' },
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: true
              }
            }
          }
        }
      }
    });
    
    if (sideOrders) {
      console.log('✅ Side Orders category found!');
      console.log(`Category ID: ${sideOrders.id}`);
      console.log(`Number of items: ${sideOrders.menuItems.length}`);
      
      sideOrders.menuItems.forEach(item => {
        console.log(`- ${item.name}: $${item.basePrice} (customizations: ${item.customizationGroups.length})`);
      });
    } else {
      console.log('❌ Side Orders category not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSideOrders();
