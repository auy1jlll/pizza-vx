const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyChickenWings() {
  try {
    const chickenWingsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Chicken & Wings' },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (chickenWingsCategory) {
      console.log(`✅ ${chickenWingsCategory.name} Category`);
      console.log(`   Description: ${chickenWingsCategory.description}`);
      console.log(`   Menu Items: ${chickenWingsCategory.menuItems.length}`);
      console.log('');
      
      chickenWingsCategory.menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} – $${item.basePrice.toFixed(2)}`);
        if (item.description) {
          console.log(`   ${item.description}`);
        }
        console.log('');
      });
    } else {
      console.log('❌ Chicken & Wings category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyChickenWings();
