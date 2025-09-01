const { PrismaClient } = require('@prisma/client');

async function checkCategories() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    
    // Test basic connection first
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    console.log('\n=== ALL CATEGORIES IN DATABASE ===');
    const allCategories = await prisma.menuCategory.findMany({
      include: {
        _count: {
          select: { menuItems: true }
        },
        subcategories: {
          include: {
            _count: {
              select: { menuItems: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`Total categories found: ${allCategories.length}`);
    
    if (allCategories.length === 0) {
      console.log('❌ No categories found in database!');
      return;
    }
    
    console.log('\nAll categories:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
      console.log(`  ID: ${cat.id}`);
      console.log(`  Active: ${cat.isActive}`);
      console.log(`  Parent ID: ${cat.parentCategoryId}`);
      console.log(`  Sort Order: ${cat.sortOrder}`);
      console.log(`  Menu Items: ${cat._count.menuItems}`);
      console.log(`  Subcategories: ${cat.subcategories.length}`);
      if (cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`    - ${sub.name} (${sub.slug}) - ${sub._count.menuItems} items`);
        });
      }
      console.log('');
    });

    console.log('\n=== ACTIVE TOP-LEVEL CATEGORIES ===');
    const topLevelCategories = await prisma.menuCategory.findMany({
      where: { 
        isActive: true,
        parentCategoryId: null
      },
      include: {
        _count: {
          select: { menuItems: true }
        },
        subcategories: {
          where: { isActive: true },
          include: {
            _count: {
              select: { menuItems: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`Active top-level categories: ${topLevelCategories.length}`);
    topLevelCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}) - ${cat._count.menuItems} items, ${cat.subcategories.length} subcategories`);
    });

    console.log('\n=== RECENT CATEGORIES (Last 5) ===');
    const recentCategories = await prisma.menuCategory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { menuItems: true }
        }
      }
    });

    recentCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}) - Created: ${cat.createdAt}, Active: ${cat.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error checking categories:', error);
    console.error('Error details:', error.message);
    
    if (error.code === 'P1001') {
      console.error('🔥 Database connection failed - check your DATABASE_URL');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Database disconnected');
  }
}

console.log('🔍 Starting category check...');
checkCategories();
