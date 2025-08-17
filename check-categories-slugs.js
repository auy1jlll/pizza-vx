const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategorySlugs() {
  try {
    console.log('🔍 Checking current categories and slugs...\n');
    
    const categories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log('📋 Categories in database:');
    console.log('============================');
    categories.forEach(cat => {
      console.log(`Name: "${cat.name}" → Slug: "${cat.slug}"`);
    });
    
    console.log(`\n✅ Total categories: ${categories.length}`);
    
    // Check if dinner-plates exists
    const dinnerPlates = categories.find(cat => cat.slug === 'dinner-plates');
    if (dinnerPlates) {
      console.log(`\n✅ Found "dinner-plates" category: "${dinnerPlates.name}"`);
    } else {
      console.log('\n❌ "dinner-plates" slug not found!');
    }
    
  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategorySlugs();
