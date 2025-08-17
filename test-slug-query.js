const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCategorySlugQuery() {
  try {
    console.log('🔍 Testing category slug query...\n');
    
    // Step 1: Check the category exists
    console.log('1. Checking if dinner-plates category exists:');
    const category = await prisma.menuCategory.findUnique({
      where: { slug: 'dinner-plates' }
    });
    
    if (!category) {
      console.log('❌ No category found with slug "dinner-plates"');
      return;
    }
    
    console.log(`✅ Found category: "${category.name}" (ID: ${category.id})`);
    
    // Step 2: Check menu items linked to this category
    console.log('\n2. Checking menu items in this category:');
    const itemsByCategory = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      include: { category: true }
    });
    
    console.log(`📋 Found ${itemsByCategory.length} items by categoryId`);
    itemsByCategory.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.name} (Active: ${item.isActive}, Available: ${item.isAvailable})`);
    });
    
    // Step 3: Test the corrected query (join by slug)
    console.log('\n3. Testing corrected query (join by slug):');
    const itemsBySlug = await prisma.menuItem.findMany({
      where: {
        category: {
          slug: 'dinner-plates',
          isActive: true
        },
        isActive: true,
        isAvailable: true
      },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`✅ Query by slug returned ${itemsBySlug.length} items`);
    if (itemsBySlug.length > 0) {
      console.log(`   First item: ${itemsBySlug[0].name}`);
      console.log(`   Category: ${itemsBySlug[0].category.name}`);
    } else {
      console.log('❌ No items returned by slug query');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCategorySlugQuery();
