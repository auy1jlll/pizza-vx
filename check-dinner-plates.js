const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking dinner plates category and customizations...');
    
    // Check if dinner-plates category exists
    const dinnerPlatesCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'dinner-plates' },
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
    
    if (dinnerPlatesCategory) {
      console.log('✅ Dinner Plates category found:');
      console.log(`   Name: ${dinnerPlatesCategory.name}`);
      console.log(`   Items: ${dinnerPlatesCategory.menuItems.length}`);
      
      dinnerPlatesCategory.menuItems.forEach(item => {
        console.log(`   - ${item.name} (${item.customizationGroups.length} customization groups)`);
      });
    } else {
      console.log('❌ Dinner Plates category not found');
    }
    
    // Check customization groups by type
    const groupStats = await prisma.customizationGroup.groupBy({
      by: ['type'],
      _count: true
    });
    
    console.log('\n📊 Customization Group Types:');
    groupStats.forEach(stat => {
      console.log(`   ${stat.type}: ${stat._count} groups`);
    });
    
    // Check for sides, condiments, toppings specifically
    const sideGroups = await prisma.customizationGroup.findMany({
      where: {
        name: {
          contains: 'side',
          mode: 'insensitive'
        }
      },
      include: {
        options: true
      }
    });
    
    console.log(`\n🍽️ Side-related groups: ${sideGroups.length}`);
    sideGroups.forEach(group => {
      console.log(`   - ${group.name} (${group.options.length} options)`);
    });
    
    const condimentGroups = await prisma.customizationGroup.findMany({
      where: {
        name: {
          contains: 'condiment',
          mode: 'insensitive'
        }
      },
      include: {
        options: true
      }
    });
    
    console.log(`\n🥄 Condiment-related groups: ${condimentGroups.length}`);
    condimentGroups.forEach(group => {
      console.log(`   - ${group.name} (${group.options.length} options)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
