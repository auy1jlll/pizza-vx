const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log('Current categories:');
    categories.forEach(cat => {
      console.log(`  • ${cat.name} (slug: ${cat.slug})`);
    });
    
    const sandwichCategory = categories.find(c => 
      c.name.toLowerCase().includes('sandwich') || 
      c.slug.includes('sandwich')
    );
    
    if (sandwichCategory) {
      console.log(`\n🥪 Found sandwich category: ${sandwichCategory.name} (ID: ${sandwichCategory.id})`);
      
      // Check items in this category
      const items = await prisma.menuItem.findMany({
        where: { categoryId: sandwichCategory.id },
        orderBy: { sortOrder: 'asc' }
      });
      
      console.log(`\nCurrent items in ${sandwichCategory.name}:`);
      items.forEach(item => {
        console.log(`  • ${item.name} - $${item.basePrice}`);
      });
    } else {
      console.log('\n❌ No sandwich category found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
