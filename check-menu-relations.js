const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('=== MENU CATEGORIES ===');
  const categories = await prisma.menuCategory.findMany({
    include: {
      _count: {
        select: { menuItems: true }
      }
    }
  });
  console.log('Categories found:', categories.length);
  categories.forEach(cat => {
    console.log(`- ${cat.name} (${cat.slug}) - ${cat._count.menuItems} items`);
  });

  console.log('\n=== MENU ITEMS ===');
  const items = await prisma.menuItem.findMany({
    include: {
      category: { select: { name: true, slug: true } }
    }
  });
  console.log('Menu items found:', items.length);
  items.forEach(item => {
    console.log(`- ${item.name} (Category: ${item.category?.name || 'NONE'})`);
  });

  await prisma.$disconnect();
}

checkData().catch(console.error);
