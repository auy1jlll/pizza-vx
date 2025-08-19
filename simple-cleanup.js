const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('🧹 REMOVING DUPLICATE CUSTOMIZATIONS');
    
    // Step 1: Get all groups
    const allGroups = await prisma.customizationGroup.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    console.log(`Total groups before cleanup: ${allGroups.length}`);
    
    // Step 2: Find duplicates
    const nameMap = new Map();
    const duplicates = [];
    
    allGroups.forEach(group => {
      const key = group.name.trim().toLowerCase();
      if (nameMap.has(key)) {
        duplicates.push(group.id);
      } else {
        nameMap.set(key, group.id);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicate groups to delete`);
    
    // Step 3: Delete duplicates
    for (const groupId of duplicates) {
      // Delete options first
      await prisma.customizationOption.deleteMany({
        where: { groupId }
      });
      
      // Delete group
      await prisma.customizationGroup.delete({
        where: { id: groupId }
      });
      
      console.log(`Deleted group ID: ${groupId}`);
    }
    
    // Step 4: Verify
    const finalGroups = await prisma.customizationGroup.findMany();
    console.log(`Total groups after cleanup: ${finalGroups.length}`);
    console.log('✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
