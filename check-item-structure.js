const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkItemStructure() {
  try {
    const item = await prisma.menuItem.findFirst();
    console.log('Sample menu item structure:');
    console.log(JSON.stringify(item, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkItemStructure();
