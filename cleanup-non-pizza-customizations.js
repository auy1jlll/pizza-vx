const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function cleanupNonPizzaCustomizations() {
  try {
    await testConnection();
    console.log('🔍 Analyzing current customization data...\n');
    
    // First, let's see what we have
    const allGroups = await prisma.customizationGroup.findMany({
      include: {
        category: true,
        options: true,
        menuItemCustomizations: true
      }
    });
    
    console.log('=== CURRENT CUSTOMIZATION GROUPS ===');
    allGroups.forEach(group => {
      const categoryName = group.category?.name || 'No Category';
      const isPizza = categoryName.toLowerCase().includes('pizza') || 
                     categoryName.toLowerCase().includes('gourmet') ||
                     categoryName.toLowerCase().includes('specialty');
      
      console.log(`${isPizza ? '🍕 KEEP' : '🗑️  DELETE'} - Group: "${group.name}" | Category: "${categoryName}" | Options: ${group.options.length} | Menu Items: ${group.menuItemCustomizations.length}`);
    });
    
    // Identify non-pizza groups
    const nonPizzaGroups = allGroups.filter(group => {
      const categoryName = group.category?.name || '';
      const isPizza = categoryName.toLowerCase().includes('pizza') || 
                     categoryName.toLowerCase().includes('gourmet') ||
                     categoryName.toLowerCase().includes('specialty');
      return !isPizza;
    });
    
    console.log(`\n📊 Found ${nonPizzaGroups.length} non-pizza customization groups to delete`);
    
    if (nonPizzaGroups.length === 0) {
      console.log('✅ No non-pizza customizations found. Nothing to clean up!');
      return;
    }
    
    console.log('\n🚀 Starting cleanup process...\n');
    
    // Step 1: Delete menu item customizations for non-pizza groups
    console.log('Step 1: Removing menu item customization associations...');
    const nonPizzaGroupIds = nonPizzaGroups.map(g => g.id);
    
    const deletedAssociations = await prisma.menuItemCustomization.deleteMany({
      where: {
        customizationGroupId: {
          in: nonPizzaGroupIds
        }
      }
    });
    console.log(`✅ Deleted ${deletedAssociations.count} menu item customization associations`);
    
    // Step 2: Delete customization options for non-pizza groups
    console.log('\nStep 2: Removing customization options...');
    const deletedOptions = await prisma.customizationOption.deleteMany({
      where: {
        groupId: {
          in: nonPizzaGroupIds
        }
      }
    });
    console.log(`✅ Deleted ${deletedOptions.count} customization options`);
    
    // Step 3: Delete the customization groups themselves
    console.log('\nStep 3: Removing customization groups...');
    const deletedGroups = await prisma.customizationGroup.deleteMany({
      where: {
        id: {
          in: nonPizzaGroupIds
        }
      }
    });
    console.log(`✅ Deleted ${deletedGroups.count} customization groups`);
    
    console.log('\n🎉 Cleanup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Menu item associations deleted: ${deletedAssociations.count}`);
    console.log(`   • Customization options deleted: ${deletedOptions.count}`);
    console.log(`   • Customization groups deleted: ${deletedGroups.count}`);
    
    // Verify what remains
    console.log('\n🔍 Verifying remaining data...');
    const remainingGroups = await prisma.customizationGroup.findMany({
      include: {
        category: true,
        _count: {
          select: { options: true }
        }
      }
    });
    
    console.log('\n=== REMAINING CUSTOMIZATION GROUPS ===');
    if (remainingGroups.length === 0) {
      console.log('No customization groups remaining.');
    } else {
      remainingGroups.forEach(group => {
        const categoryName = group.category?.name || 'No Category';
        console.log(`🍕 Group: "${group.name}" | Category: "${categoryName}" | Options: ${group._count.options}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupNonPizzaCustomizations()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
