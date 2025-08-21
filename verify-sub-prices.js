const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubCustomizations() {
  try {
    const subsCategory = await prisma.menuCategory.findFirst({
      where: {
        slug: { in: ['subs', 'cold-subs'] }
      }
    });
    
    const subItems = await prisma.menuItem.findMany({
      where: {
        categoryId: subsCategory.id
      },
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
      take: 1
    });
    
    if (subItems.length > 0) {
      console.log('Updated Sub Size & Style options:');
      subItems[0].customizationGroups.forEach(icg => {
        const group = icg.customizationGroup;
        if (group.name === 'Sub Size & Style') {
          group.options.forEach(option => {
            console.log('  -', option.name, '| Price:', option.priceModifier >= 0 ? '+' : '', '$' + option.priceModifier.toFixed(2));
          });
        }
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubCustomizations();
