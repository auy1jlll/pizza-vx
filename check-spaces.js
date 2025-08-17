const { PrismaClient } = require('@prisma/client');

async function checkCategorySpaces() {
  const prisma = new PrismaClient({
    log: ['error']
  });

  try {
    console.log('🔍 Checking Category Name vs Slug Issues...\n');
    
    const categories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Current categories:');
    categories.forEach((cat, index) => {
      const hasSpaces = cat.name.includes(' ');
      const slugHasSpaces = cat.slug.includes(' ');
      const urlEncoded = encodeURIComponent(cat.name);
      
      console.log(`${index + 1}. "${cat.name}"`);
      console.log(`   Slug: "${cat.slug}"`);
      console.log(`   Name has spaces: ${hasSpaces}`);
      console.log(`   Slug has spaces: ${slugHasSpaces}`);
      console.log(`   URL encoded name: "${urlEncoded}"`);
      console.log(`   Expected URL: /menu/${cat.slug}`);
      
      if (hasSpaces && !slugHasSpaces) {
        console.log(`   ✅ Correct: Name has spaces but slug is clean`);
      } else if (hasSpaces && slugHasSpaces) {
        console.log(`   ❌ Problem: Both name AND slug have spaces!`);
      } else {
        console.log(`   ✅ OK: No space issues`);
      }
      console.log('');
    });

    // Test if frontend might be using name instead of slug
    console.log('Potential frontend routing issues:');
    categories.forEach(cat => {
      if (cat.name.includes(' ')) {
        console.log(`- If using name: /menu/${cat.name} → would fail`);
        console.log(`- If using slug: /menu/${cat.slug} → should work`);
        console.log(`- URL encoded: /menu/${encodeURIComponent(cat.name)} → would look ugly`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategorySpaces();
