const { PrismaClient } = require('@prisma/client');

async function quickSlugCheck() {
  const prisma = new PrismaClient({
    log: ['error'] // Only log errors to reduce noise
  });

  try {
    console.log("🔍 Category Slug Check");
    console.log("======================");
    
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

    console.log(`Found ${categories.length} categories:\n`);
    
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. "${cat.name}"`);
      console.log(`   Slug: "${cat.slug}"`);
      console.log(`   Active: ${cat.isActive}`);
      console.log(`   ID: ${cat.id}`);
      console.log('');
    });

    // Check for slug issues
    const issues = [];
    categories.forEach(cat => {
      if (!cat.slug) {
        issues.push(`"${cat.name}" has no slug`);
      } else if (cat.slug.includes(' ')) {
        issues.push(`"${cat.name}" slug contains spaces: "${cat.slug}"`);
      } else if (cat.slug !== cat.slug.toLowerCase()) {
        issues.push(`"${cat.name}" slug not lowercase: "${cat.slug}"`);
      }
    });

    if (issues.length > 0) {
      console.log("❌ ISSUES FOUND:");
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    } else {
      console.log("✅ All category slugs look good!");
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickSlugCheck();
