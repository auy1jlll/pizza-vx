const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicateCustomizations() {
  console.log('🧹 CLEANING UP DUPLICATE CUSTOMIZATION RECORDS');
  console.log('================================================\n');
  
  let totalDeleted = 0;
  let errorsEncountered = [];
  
  try {
    // PHASE 1: Analyze CustomizationGroups
    console.log('📊 PHASE 1: Analyzing CustomizationGroup Duplicates');
    console.log('---------------------------------------------------');
    
    const allGroups = await prisma.customizationGroup.findMany({
      include: {
        category: true,
        options: true
      }
    });
    
    console.log(`Found ${allGroups.length} total CustomizationGroups`);
    
    // Find duplicates based on name
    const groupsByName = {};
    allGroups.forEach(group => {
      const key = group.name.trim().toLowerCase();
      if (!groupsByName[key]) {
        groupsByName[key] = [];
      }
      groupsByName[key].push(group);
    });
    
    const duplicateGroups = Object.entries(groupsByName).filter(([name, groups]) => groups.length > 1);
    
    console.log(`Found ${duplicateGroups.length} duplicate group names:`);
    duplicateGroups.forEach(([name, groups]) => {
      console.log(`  "${groups[0].name}": ${groups.length} records`);
    });
    
    // Clean up duplicate groups
    for (const [name, groups] of duplicateGroups) {
      try {
        // Sort by creation date, keep the oldest (most likely to have proper relationships)
        const sortedGroups = groups.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const keepGroup = sortedGroups[0];
        const deleteGroups = sortedGroups.slice(1);
        
        console.log(`\n🎯 Processing "${keepGroup.name}"`);
        console.log(`   Keeping: ID ${keepGroup.id} (created ${keepGroup.createdAt.toISOString().split('T')[0]})`);
        
        for (const deleteGroup of deleteGroups) {
          console.log(`   Deleting: ID ${deleteGroup.id} (created ${deleteGroup.createdAt.toISOString().split('T')[0]})`);
          
          // First, delete associated CustomizationOptions
          const deletedOptions = await prisma.customizationOption.deleteMany({
            where: { groupId: deleteGroup.id }
          });
          
          console.log(`     Deleted ${deletedOptions.count} associated options`);
          
          // Then delete the group
          await prisma.customizationGroup.delete({
            where: { id: deleteGroup.id }
          });
          
          totalDeleted++;
        }
        
      } catch (error) {
        console.log(`❌ Error processing "${name}": ${error.message}`);
        errorsEncountered.push(`Group "${name}": ${error.message}`);
      }
    }
    
    // PHASE 2: Analyze CustomizationOptions
    console.log('\n📊 PHASE 2: Analyzing CustomizationOption Duplicates');
    console.log('----------------------------------------------------');
    
    const remainingGroups = await prisma.customizationGroup.findMany({
      include: {
        options: true
      }
    });
    
    let totalOptionDeleted = 0;
    
    for (const group of remainingGroups) {
      if (group.options.length <= 1) continue;
      
      // Find duplicate options within each group
      const optionsByName = {};
      group.options.forEach(option => {
        const key = option.name.trim().toLowerCase();
        if (!optionsByName[key]) {
          optionsByName[key] = [];
        }
        optionsByName[key].push(option);
      });
      
      const duplicateOptions = Object.entries(optionsByName).filter(([name, options]) => options.length > 1);
      
      if (duplicateOptions.length > 0) {
        console.log(`\n🎯 Group "${group.name}" has duplicate options:`);
        
        for (const [optionName, options] of duplicateOptions) {
          try {
            // Sort by creation date, keep the oldest
            const sortedOptions = options.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const keepOption = sortedOptions[0];
            const deleteOptions = sortedOptions.slice(1);
            
            console.log(`   "${keepOption.name}": keeping ID ${keepOption.id}, deleting ${deleteOptions.length} duplicates`);
            
            for (const deleteOption of deleteOptions) {
              await prisma.customizationOption.delete({
                where: { id: deleteOption.id }
              });
              totalOptionDeleted++;
            }
            
          } catch (error) {
            console.log(`   ❌ Error processing option "${optionName}": ${error.message}`);
            errorsEncountered.push(`Option "${optionName}" in group "${group.name}": ${error.message}`);
          }
        }
      }
    }
    
    // PHASE 3: Final Verification
    console.log('\n✅ PHASE 3: Post-Cleanup Verification');
    console.log('--------------------------------------');
    
    const finalGroups = await prisma.customizationGroup.findMany({
      include: {
        options: true,
        category: true
      }
    });
    
    const finalGroupNames = {};
    finalGroups.forEach(group => {
      const key = group.name.trim().toLowerCase();
      finalGroupNames[key] = (finalGroupNames[key] || 0) + 1;
    });
    
    const stillDuplicateGroups = Object.entries(finalGroupNames).filter(([name, count]) => count > 1);
    
    let totalOptions = 0;
    finalGroups.forEach(group => {
      totalOptions += group.options.length;
    });
    
    console.log(`📊 Final Statistics:`);
    console.log(`   CustomizationGroups: ${finalGroups.length}`);
    console.log(`   CustomizationOptions: ${totalOptions}`);
    console.log(`   Groups deleted: ${totalDeleted}`);
    console.log(`   Options deleted: ${totalOptionDeleted}`);
    
    if (stillDuplicateGroups.length === 0) {
      console.log('✅ No duplicate groups remaining!');
    } else {
      console.log(`⚠️  Still ${stillDuplicateGroups.length} duplicate group names:`);
      stillDuplicateGroups.forEach(([name, count]) => {
        console.log(`   "${name}": ${count} records`);
      });
    }
    
    // Show sample of cleaned data
    console.log('\n📋 Sample of Cleaned Groups:');
    finalGroups.slice(0, 10).forEach(group => {
      console.log(`   "${group.name}" (${group.options.length} options) → ${group.category?.name || 'GLOBAL'}`);
    });
    
    console.log('\n🎉 CLEANUP COMPLETE!');
    console.log('====================');
    console.log(`✅ Removed ${totalDeleted} duplicate groups`);
    console.log(`✅ Removed ${totalOptionDeleted} duplicate options`);
    console.log(`✅ Admin interface should now show clean data`);
    
    if (errorsEncountered.length > 0) {
      console.log(`⚠️  ${errorsEncountered.length} errors encountered:`);
      errorsEncountered.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No errors encountered during cleanup');
    }
    
    return {
      success: true,
      groupsDeleted: totalDeleted,
      optionsDeleted: totalOptionDeleted,
      finalGroupCount: finalGroups.length,
      finalOptionCount: totalOptions,
      stillDuplicates: stillDuplicateGroups.length,
      errorsEncountered
    };
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR during cleanup:', error);
    return {
      success: false,
      error: error.message,
      groupsDeleted: totalDeleted,
      errorsEncountered
    };
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed');
  }
}

// Execute the cleanup immediately
cleanupDuplicateCustomizations()
  .then(result => {
    if (result.success) {
      console.log('\n🎊 MISSION ACCOMPLISHED! Your customization records are now clean and unique.');
      console.log('   💡 Refresh the admin page to see the cleaned data.');
    } else {
      console.log('\n💥 Cleanup failed, but we tried our best!');
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });
