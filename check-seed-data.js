const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 Database Summary:');
  
  const categories = await prisma.menuCategory.count();
  const items = await prisma.menuItem.count();
  const groups = await prisma.customizationGroup.count();
  const options = await prisma.customizationOption.count();
  
  console.log('Categories:', categories);
  console.log('Menu Items:', items);
  console.log('Customization Groups:', groups);
  console.log('Customization Options:', options);
  
  console.log('\n📋 Sample Categories:');
  const sampleCategories = await prisma.menuCategory.findMany({
    select: { name: true, slug: true },
    take: 5
  });
  sampleCategories.forEach(cat => console.log(`- ${cat.name} (${cat.slug})`));
  
  console.log('\n📋 Sample Menu Items:');
  const sampleItems = await prisma.menuItem.findMany({
    select: { name: true, basePrice: true, category: { select: { name: true } } },
    take: 5
  });
  sampleItems.forEach(item => console.log(`- ${item.name} - $${item.basePrice} (${item.category.name})`));
  
  await prisma.$disconnect();
}

checkData().catch(console.error);
