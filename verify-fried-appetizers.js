const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyFriedAppetizers() {
  try {
    const friedAppetizersCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Fried Appetizers' },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (friedAppetizersCategory) {
      console.log(`✅ ${friedAppetizersCategory.name} Category`);
      console.log(`   Description: ${friedAppetizersCategory.description}`);
      console.log(`   Menu Items: ${friedAppetizersCategory.menuItems.length}`);
      console.log('');
      
      friedAppetizersCategory.menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} – $${item.basePrice.toFixed(2)}`);
        if (item.description) {
          console.log(`   ${item.description}`);
        }
        console.log('');
      });
    } else {
      console.log('❌ Fried Appetizers category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyFriedAppetizers();
