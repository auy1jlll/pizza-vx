const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickCheck() {
  try {
    console.log('=== MENU CATEGORIES ===');
    const categories = await prisma.menuCategory.findMany({
      select: { id: true, name: true, slug: true }
    });
    console.log('Available MenuCategories:');
    categories.forEach(cat => {
      console.log(`  ID: ${cat.id} | Name: ${cat.name} | Slug: ${cat.slug}`);
    });
    
    console.log('\n=== CUSTOMIZATION GROUPS ===');
    const groups = await prisma.customizationGroup.findMany({
      select: { 
        id: true, 
        name: true, 
        categoryId: true 
      },
      include: {
        category: { select: { name: true } }
      }
    });
    
    console.log('CustomizationGroups:');
    groups.forEach(group => {
      console.log(`  ${group.name} | CategoryID: ${group.categoryId} | Category: ${group.category?.name || 'NULL'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickCheck();
