const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDinnerPlatesCategories() {
  try {
    console.log('🔍 Checking all categories in the database...\n');
    
    // Get all categories
    const allCategories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            menuItems: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📊 Total categories found: ${allCategories.length}\n`);
    
    allCategories.forEach((category, index) => {
      console.log(`${index + 1}. Category: "${category.name}"`);
      console.log(`   ID: ${category.id}`);
      console.log(`   Slug: "${category.slug}"`);
      console.log(`   Menu Items: ${category._count.menuItems}`);
      console.log('');
    });

    // Look specifically for dinner-related categories
    console.log('🍽️ Dinner-related categories:\n');
    const dinnerCategories = allCategories.filter(cat => 
      cat.name.toLowerCase().includes('dinner') || 
      cat.slug.toLowerCase().includes('dinner') ||
      cat.name.toLowerCase().includes('plate') ||
      cat.slug.toLowerCase().includes('plate')
    );

    if (dinnerCategories.length === 0) {
      console.log('❌ No dinner or plate-related categories found!');
    } else {
      dinnerCategories.forEach((category, index) => {
        console.log(`${index + 1}. "${category.name}" (slug: "${category.slug}")`);
        console.log(`   ID: ${category.id}`);
        console.log(`   Items: ${category._count.menuItems}`);
        console.log('');
      });
    }

    // Check for exact matches
    console.log('🎯 Checking for exact "dinner-plates" slug matches:\n');
    const exactMatch = await prisma.menuCategory.findMany({
      where: {
        slug: 'dinner-plates'
      },
      include: {
        menuItems: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });

    if (exactMatch.length === 0) {
      console.log('❌ No category with slug "dinner-plates" found!');
    } else {
      console.log(`✅ Found ${exactMatch.length} category(ies) with slug "dinner-plates":`);
      exactMatch.forEach((category, index) => {
        console.log(`\n${index + 1}. Category: "${category.name}"`);
        console.log(`   ID: ${category.id}`);
        console.log(`   Slug: "${category.slug}"`);
        console.log(`   Menu Items (${category.menuItems.length}):`);
        
        if (category.menuItems.length === 0) {
          console.log('     (No menu items)');
        } else {
          category.menuItems.forEach((item, itemIndex) => {
            console.log(`     ${itemIndex + 1}. ${item.name} - $${item.price}`);
          });
        }
      });
    }

    // Check for case variations
    console.log('\n🔤 Checking for case variations of dinner plates:\n');
    const caseVariations = await prisma.menuCategory.findMany({
      where: {
        OR: [
          { slug: { contains: 'dinner', mode: 'insensitive' } },
          { slug: { contains: 'plate', mode: 'insensitive' } },
          { name: { contains: 'dinner', mode: 'insensitive' } },
          { name: { contains: 'plate', mode: 'insensitive' } }
        ]
      },
      include: {
        menuItems: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (caseVariations.length > 0) {
      console.log(`Found ${caseVariations.length} variations:`);
      caseVariations.forEach((category, index) => {
        console.log(`\n${index + 1}. "${category.name}" (slug: "${category.slug}")`);
        console.log(`   ID: ${category.id}`);
        console.log(`   Items: ${category.menuItems.length}`);
        if (category.menuItems.length > 0) {
          console.log(`   Sample items: ${category.menuItems.slice(0, 3).map(item => item.name).join(', ')}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error checking categories:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDinnerPlatesCategories();
