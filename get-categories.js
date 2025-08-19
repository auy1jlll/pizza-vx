const { PrismaClient } = require('@prisma/client');

async function getCategories() {
  const prisma = new PrismaClient();
  
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    
    console.log('\n🍕 RESTAURANT MENU CATEGORIES:');
    console.log('================================');
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
      if (category.description) {
        console.log(`   Description: ${category.description}`);
      }
      console.log('');
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getCategories();
