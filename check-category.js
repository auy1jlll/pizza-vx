const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategory() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: {
        name: {
          contains: 'Sea Food',
          mode: 'insensitive'
        }
      }
    });
    
    console.log('Found categories matching Sea Food:', JSON.stringify(categories, null, 2));
    
    if (categories.length === 0) {
      console.log('Checking all categories...');
      const allCategories = await prisma.menuCategory.findMany();
      console.log('All categories:', allCategories.map(c => ({ id: c.id, name: c.name })));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategory();
