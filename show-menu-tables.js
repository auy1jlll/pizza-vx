// Check all menu-related database tables
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showDatabaseStructure() {
  try {
    console.log('=== MENU CATEGORIES ===');
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    categories.forEach(cat => {
      console.log(`ID: ${cat.id} | Name: ${cat.name} | Slug: ${cat.slug} | Active: ${cat.isActive}`);
    });

    console.log('\n=== MENU ITEMS ===');
    const items = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    items.forEach(item => {
      console.log(`ID: ${item.id} | Name: ${item.name} | Category: ${item.category.name} | Price: $${item.basePrice}`);
    });

    console.log('\n=== CUSTOMIZATION GROUPS ===');
    const groups = await prisma.customizationGroup.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    groups.forEach(group => {
      console.log(`ID: ${group.id} | Name: ${group.name} | Type: ${group.type} | Category: ${group.category?.name || 'Global'}`);
    });

    console.log('\n=== CUSTOMIZATION OPTIONS ===');
    const options = await prisma.customizationOption.findMany({
      include: { group: true },
      orderBy: { name: 'asc' }
    });
    options.forEach(option => {
      console.log(`ID: ${option.id} | Name: ${option.name} | Group: ${option.group.name} | Price: +$${option.priceModifier}`);
    });

    console.log('\n=== TABLE COUNTS ===');
    const counts = await Promise.all([
      prisma.menuCategory.count(),
      prisma.menuItem.count(),
      prisma.customizationGroup.count(),
      prisma.customizationOption.count()
    ]);
    console.log(`Categories: ${counts[0]}`);
    console.log(`Menu Items: ${counts[1]}`);
    console.log(`Customization Groups: ${counts[2]}`);
    console.log(`Customization Options: ${counts[3]}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showDatabaseStructure();
