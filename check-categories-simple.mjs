import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== CHECKING DATABASE FOR DELI SUBS SETUP ===\n');
    
    // Check existing categories
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log('📋 EXISTING CATEGORIES:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - Sort: ${cat.sortOrder}`);
    });
    
    // Check if Deli Subs already exists
    const deliCategory = categories.find(cat => cat.slug === 'deli-subs');
    console.log('\n🥪 DELI SUBS CATEGORY:', deliCategory ? 'EXISTS' : 'NOT FOUND');
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total Categories: ${categories.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
