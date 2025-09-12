const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubsCategory() {
  try {
    console.log('🔍 Checking subs and sandwiches category...');
    
    // Get all categories
    const allCategories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        sortOrder: true,
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('📊 All Categories:');
    allCategories.forEach(cat => {
      const status = cat.isActive ? '✅' : '❌';
      console.log(`   ${status} ${cat.name} (slug: ${cat.slug}) - ${cat._count.menuItems} items`);
    });
    
    // Look specifically for subs/sandwiches
    const subsCategory = allCategories.find(cat => 
      cat.name.toLowerCase().includes('sub') || 
      cat.name.toLowerCase().includes('sandwich') ||
      cat.slug.toLowerCase().includes('sub') ||
      cat.slug.toLowerCase().includes('sandwich')
    );
    
    if (subsCategory) {
      console.log('\n🥪 Found Subs Category:');
      console.log(`   ID: ${subsCategory.id}`);
      console.log(`   Name: ${subsCategory.name}`);
      console.log(`   Slug: ${subsCategory.slug}`);
      console.log(`   Active: ${subsCategory.isActive}`);
      console.log(`   Items: ${subsCategory._count.menuItems}`);
      
      // Get the actual menu items in this category
      const items = await prisma.menuItem.findMany({
        where: { 
          categoryId: subsCategory.id 
        },
        select: {
          id: true,
          name: true,
          isActive: true,
          isAvailable: true
        }
      });
      
      console.log('\n📋 Items in Subs Category:');
      items.forEach(item => {
        const status = (item.isActive && item.isAvailable) ? '✅' : '❌';
        console.log(`   ${status} ${item.name}`);
      });
      
      if (!subsCategory.isActive) {
        console.log('\n❌ ISSUE: Category is not active!');
      }
      
      const activeItems = items.filter(item => item.isActive && item.isAvailable);
      if (activeItems.length === 0) {
        console.log('\n❌ ISSUE: No active/available items in this category!');
      }
      
    } else {
      console.log('\n❌ No subs/sandwiches category found!');
      console.log('\n🔍 Checking for similar names:');
      allCategories.forEach(cat => {
        const name = cat.name.toLowerCase();
        if (name.includes('sand') || name.includes('sub') || 
            name.includes('wrap') || name.includes('hero') ||
            name.includes('grinder') || name.includes('hoagie')) {
          console.log(`   Possible match: ${cat.name} (slug: ${cat.slug})`);
        }
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  checkSubsCategory().catch(console.error);
}