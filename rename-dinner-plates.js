const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function renameDinnerPlates() {
  try {
    console.log('🔧 Renaming "Dinner Plates" to "Dinner"...');
    
    // Find the dinner plates category
    const dinnerPlatesCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'dinner-plates' }
    });

    if (!dinnerPlatesCategory) {
      console.log('❌ No dinner plates category found');
      return;
    }

    console.log(`📋 Found category: "${dinnerPlatesCategory.name}"`);

    // Update the category name
    const updatedCategory = await prisma.menuCategory.update({
      where: { id: dinnerPlatesCategory.id },
      data: {
        name: 'Dinner',
        slug: 'dinner' // Also update the slug to be cleaner
      }
    });

    console.log(`✅ Successfully renamed to: "${updatedCategory.name}"`);
    console.log(`✅ New slug: "${updatedCategory.slug}"`);

    // Show all categories
    const allCategories = await prisma.menuCategory.findMany({
      select: { name: true, slug: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n📋 All categories:');
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

  } catch (error) {
    console.error('❌ Error renaming category:', error);
  } finally {
    await prisma.$disconnect();
  }
}

renameDinnerPlates();
