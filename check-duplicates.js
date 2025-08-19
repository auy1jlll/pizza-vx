const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    console.log('🔍 CHECKING FOR DUPLICATE CUSTOMIZATIONS');
    console.log('=========================================\n');
    
    // Check CustomizationGroups
    const groups = await prisma.customizationGroup.findMany({
      include: {
        options: true,
        category: true
      }
    });
    
    console.log(`Total CustomizationGroups: ${groups.length}`);
    
    // Find duplicates by name
    const groupsByName = {};
    groups.forEach(group => {
      const key = group.name.trim().toLowerCase();
      if (!groupsByName[key]) {
        groupsByName[key] = [];
      }
      groupsByName[key].push(group);
    });
    
    const duplicates = Object.entries(groupsByName).filter(([name, groups]) => groups.length > 1);
    
    console.log(`\nDuplicate Groups Found: ${duplicates.length}`);
    duplicates.forEach(([name, groups]) => {
      console.log(`\n"${groups[0].name}" - ${groups.length} duplicates:`);
      groups.forEach(group => {
        console.log(`  ID: ${group.id} | Options: ${group.options.length} | Category: ${group.category?.name || 'NULL'} | Created: ${group.createdAt.toISOString().split('T')[0]}`);
      });
    });
    
    // Check for option duplicates within groups
    let totalOptionDuplicates = 0;
    console.log(`\n📋 Checking for duplicate options within groups...`);
    
    groups.forEach(group => {
      if (group.options.length <= 1) return;
      
      const optionsByName = {};
      group.options.forEach(option => {
        const key = option.name.trim().toLowerCase();
        if (!optionsByName[key]) {
          optionsByName[key] = [];
        }
        optionsByName[key].push(option);
      });
      
      const optionDuplicates = Object.entries(optionsByName).filter(([name, options]) => options.length > 1);
      
      if (optionDuplicates.length > 0) {
        console.log(`\nGroup "${group.name}" has duplicate options:`);
        optionDuplicates.forEach(([optionName, options]) => {
          console.log(`  "${optionName}": ${options.length} duplicates`);
          totalOptionDuplicates += options.length - 1; // Count extras
        });
      }
    });
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Groups: ${groups.length}`);
    console.log(`   Duplicate Group Names: ${duplicates.length}`);
    console.log(`   Groups to Delete: ${duplicates.reduce((sum, [name, groups]) => sum + groups.length - 1, 0)}`);
    console.log(`   Duplicate Options to Delete: ${totalOptionDuplicates}`);
    
    if (duplicates.length === 0 && totalOptionDuplicates === 0) {
      console.log('\n✅ No duplicates found! Data is clean.');
    } else {
      console.log('\n⚠️  Duplicates found - cleanup recommended.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();
