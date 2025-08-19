const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simpleCheck() {
  try {
    // Check if all customization groups have the same categoryId
    const result = await prisma.$queryRaw`
      SELECT 
        cg.categoryId,
        mc.name as category_name,
        COUNT(*) as group_count
      FROM customization_groups cg
      LEFT JOIN menu_categories mc ON cg.categoryId = mc.id
      GROUP BY cg.categoryId, mc.name
      ORDER BY group_count DESC
    `;
    
    console.log('CustomizationGroup categoryId distribution:');
    result.forEach(row => {
      console.log(`CategoryID: ${row.categoryId} | Category: ${row.category_name || 'NULL'} | Groups: ${row.group_count}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleCheck();
