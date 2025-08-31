const { PrismaClient } = require('@prisma/client');

async function checkExistingData() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking existing menu data...');

    const categories = await prisma.menuCategory.findMany();
    console.log(`\nExisting categories (${categories.length}):`);
    categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));

    const items = await prisma.menuItem.findMany();
    console.log(`\nExisting menu items (${items.length}):`);
    items.forEach(item => console.log(`- ${item.name} (Category: ${item.categoryId})`));

    const groups = await prisma.customizationGroup.findMany();
    console.log(`\nExisting customization groups (${groups.length}):`);
    groups.forEach(group => console.log(`- ${group.name} (Category: ${group.categoryId})`));

    const options = await prisma.customizationOption.findMany();
    console.log(`\nExisting customization options (${options.length}):`);
    options.forEach(option => console.log(`- ${option.name} (Group: ${option.groupId})`));

  } catch (error) {
    console.error('Error checking existing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingData();
