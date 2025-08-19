const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log('=== CHECKING ACTUAL DATABASE STRUCTURE ===\n');
    
    // Try to get one record and see all its fields
    const oneOption = await prisma.customizationOption.findFirst();
    
    if (oneOption) {
      console.log('📋 Sample CustomizationOption record structure:');
      console.log(JSON.stringify(oneOption, null, 2));
      
      console.log('\n📊 Available fields:');
      Object.keys(oneOption).forEach(key => {
        console.log(`  - ${key}: ${typeof oneOption[key]} (${oneOption[key]})`);
      });
    } else {
      console.log('❌ No CustomizationOption records found');
    }
    
    // Count total records
    const totalCount = await prisma.customizationOption.count();
    console.log(`\n📈 Total CustomizationOption records: ${totalCount}`);
    
    // If there's a category field, let's check its values
    try {
      // This will fail if category field doesn't exist
      const categoryValues = await prisma.$queryRaw`
        SELECT DISTINCT category, COUNT(*) as count 
        FROM customization_options 
        GROUP BY category 
        ORDER BY count DESC
      `;
      console.log('\n🏷️  Category field analysis:');
      categoryValues.forEach(row => {
        console.log(`  "${row.category}": ${row.count} records`);
      });
    } catch (error) {
      console.log('\n❌ Category field does not exist in database');
      console.log('   Error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure();
