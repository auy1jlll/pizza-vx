const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const chickenz = await prisma.menuCategory.findFirst({
    where: { name: 'Chickenz' }
  });
  console.log('Chickenz category:', JSON.stringify(chickenz, null, 2));
  
  const subcategories = await prisma.menuCategory.findMany({
    where: { parentCategoryId: chickenz?.id }
  });
  console.log('Subcategories:', JSON.stringify(subcategories, null, 2));
  
  await prisma.$disconnect();
}

main().catch(console.error);
