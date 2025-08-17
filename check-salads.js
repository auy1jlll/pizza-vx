const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSalads() {
  try {
    const saladsCategory = await prisma.category.findUnique({
      where: { slug: 'salads' },
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: { options: true }
            }
          }
        }
      }
    });
    
    if (!saladsCategory) {
      console.log('❌ Salads category not found');
      return;
    }
    
    console.log('✅ Salads Category Found:');
    console.log(`  Name: ${saladsCategory.name}`);
    console.log(`  Items: ${saladsCategory.menuItems.length}`);
    
    saladsCategory.menuItems.forEach((item, index) => {
      console.log(`\nItem ${index + 1}: ${item.name}`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Base Price: $${item.basePrice}`);
      console.log(`  Customization Groups: ${item.customizationGroups.length}`);
      
      item.customizationGroups.forEach(group => {
        console.log(`    - ${group.name} (${group.type}) - ${group.options.length} options`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSalads();
