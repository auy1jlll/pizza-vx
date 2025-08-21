const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySides() {
  try {
    const sidesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sides' },
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

    if (sidesCategory) {
      console.log(`✅ ${sidesCategory.name} Category`);
      console.log(`   Description: ${sidesCategory.description}`);
      console.log(`   Menu Items: ${sidesCategory.menuItems.length}`);
      console.log('');
      
      console.log('📋 Items with Size Options:');
      console.log('');
      
      sidesCategory.menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - Base: $${item.basePrice.toFixed(2)}`);
        console.log(`   ${item.description}`);
        
        // Show customization options
        item.customizationGroups.forEach(cg => {
          if (cg.customizationGroup.name.includes('Size')) {
            console.log(`   Size Options (${cg.customizationGroup.type}, ${cg.isRequired ? 'Required' : 'Optional'}):`);
            cg.customizationGroup.options.forEach(option => {
              if (option.name === 'Small') {
                console.log(`     - Small: $${item.basePrice.toFixed(2)}`);
              } else if (option.name === 'Large') {
                const largePrice = item.basePrice + (option.priceModifier / 100);
                console.log(`     - Large: $${largePrice.toFixed(2)} (+$${(option.priceModifier / 100).toFixed(2)})`);
              }
            });
          }
        });
        console.log('');
      });
    } else {
      console.log('❌ Sides category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySides();
