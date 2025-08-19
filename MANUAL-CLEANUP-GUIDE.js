// DUPLICATE CLEANUP - MANUAL APPROACH
// If Node scripts aren't working, use these SQL commands directly in your database

/*
STEP 1: Check current duplicate situation
*/
const checkQuery = `
SELECT 
  name,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as all_ids
FROM "CustomizationGroup" 
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
`;

/*
STEP 2: Delete duplicate options first (foreign key constraint)
*/
const deleteOptionsQuery = `
DELETE FROM "CustomizationOption" 
WHERE "groupId" IN (
  SELECT cg.id 
  FROM "CustomizationGroup" cg
  INNER JOIN (
    SELECT LOWER(TRIM(name)) as normalized_name, MIN(id) as keep_id
    FROM "CustomizationGroup"
    GROUP BY LOWER(TRIM(name))
  ) keepers ON LOWER(TRIM(cg.name)) = keepers.normalized_name
  WHERE cg.id != keepers.keep_id
);
`;

/*
STEP 3: Delete duplicate groups (keep oldest = lowest ID)
*/
const deleteGroupsQuery = `
DELETE FROM "CustomizationGroup" 
WHERE id IN (
  SELECT cg.id 
  FROM "CustomizationGroup" cg
  INNER JOIN (
    SELECT LOWER(TRIM(name)) as normalized_name, MIN(id) as keep_id
    FROM "CustomizationGroup"
    GROUP BY LOWER(TRIM(name))
  ) keepers ON LOWER(TRIM(cg.name)) = keepers.normalized_name
  WHERE cg.id != keepers.keep_id
);
`;

/*
STEP 4: Verify cleanup
*/
const verifyQuery = `
SELECT 
  'Groups' as type,
  COUNT(*) as total_count
FROM "CustomizationGroup"
UNION ALL
SELECT 
  'Options' as type,
  COUNT(*) as total_count
FROM "CustomizationOption";
`;

console.log('🛠️  MANUAL CLEANUP INSTRUCTIONS');
console.log('================================');
console.log('');
console.log('1. Open your database tool (pgAdmin, TablePlus, etc.)');
console.log('2. Connect to your PostgreSQL database');
console.log('3. Run these SQL commands in order:');
console.log('');
console.log('-- Check duplicates first:');
console.log(checkQuery);
console.log('');
console.log('-- Delete duplicate options:');
console.log(deleteOptionsQuery);
console.log('');
console.log('-- Delete duplicate groups:');
console.log(deleteGroupsQuery);
console.log('');
console.log('-- Verify cleanup:');
console.log(verifyQuery);
console.log('');
console.log('4. Refresh your admin page at http://localhost:3005/admin/menu-manager/customizations');
console.log('');
console.log('✅ This will remove all duplicate customization records while keeping the oldest version of each!');

// Alternative: Try Prisma directly one more time
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function tryCleanup() {
  try {
    const groups = await prisma.customizationGroup.findMany();
    console.log(`\n📊 Current status: ${groups.length} total customization groups`);
    
    // Quick duplicate check
    const names = groups.map(g => g.name.trim().toLowerCase());
    const uniqueNames = new Set(names);
    const duplicateCount = names.length - uniqueNames.size;
    
    if (duplicateCount > 0) {
      console.log(`⚠️  Found ${duplicateCount} duplicate records that need cleanup`);
      console.log('💡 Use the SQL commands above to clean them up');
    } else {
      console.log('✅ No duplicates found - data is clean!');
    }
    
  } catch (error) {
    console.log(`❌ Database check failed: ${error.message}`);
    console.log('💡 Use the SQL commands above as a manual fallback');
  } finally {
    await prisma.$disconnect();
  }
}

tryCleanup();
