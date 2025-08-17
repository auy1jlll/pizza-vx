const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategorySlugs() {
  try {
    console.log('🔍 Checking all category slugs...\n');
    
    const categories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        _count: {
          select: {
            menuItems: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('📋 Current Categories:');
    console.log('Name                | Slug              | Active | Items');
    console.log('=================== | ================= | ====== | =====');
    
    categories.forEach(cat => {
      const name = cat.name.padEnd(19);
      const slug = (cat.slug || 'NULL').padEnd(17);
      const active = cat.isActive ? '✅' : '❌';
      const items = cat._count.menuItems.toString().padStart(5);
      console.log(`${name} | ${slug} | ${active}    | ${items}`);
    });

    // Check for any missing slugs
    const missingSlugs = categories.filter(cat => !cat.slug);
    if (missingSlugs.length > 0) {
      console.log('\n⚠️  Categories missing slugs:');
      missingSlugs.forEach(cat => {
        console.log(`  - ${cat.name} (ID: ${cat.id})`);
      });
    } else {
      console.log('\n✅ All categories have proper slugs!');
    }

    // Check for slug format issues
    const badSlugs = categories.filter(cat => 
      cat.slug && (cat.slug.includes(' ') || cat.slug !== cat.slug.toLowerCase())
    );
    
    if (badSlugs.length > 0) {
      console.log('\n⚠️  Categories with non-standard slugs:');
      badSlugs.forEach(cat => {
        console.log(`  - "${cat.name}" has slug: "${cat.slug}"`);
      });
    } else {
      console.log('✅ All slugs are properly formatted!');
    }

  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategorySlugs();
