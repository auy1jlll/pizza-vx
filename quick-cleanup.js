const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickCleanup() {
  console.log('Starting duplicate cleanup...');
  
  // Get all customization groups
  const groups = await prisma.customizationGroup.findMany({
    orderBy: { createdAt: 'asc' } // Keep the oldest
  });
  
  console.log(`Found ${groups.length} total groups`);
  
  // Track names we've seen
  const seenNames = new Set();
  const toDelete = [];
  
  for (const group of groups) {
    const normalizedName = group.name.trim().toLowerCase();
    
    if (seenNames.has(normalizedName)) {
      toDelete.push(group.id);
      console.log(`Marking for deletion: "${group.name}" (ID: ${group.id})`);
    } else {
      seenNames.add(normalizedName);
      console.log(`Keeping: "${group.name}" (ID: ${group.id})`);
    }
  }
  
  console.log(`\nDeleting ${toDelete.length} duplicate groups...`);
  
  // Delete the options first, then the groups
  for (const groupId of toDelete) {
    await prisma.customizationOption.deleteMany({
      where: { groupId: groupId }
    });
    
    await prisma.customizationGroup.delete({
      where: { id: groupId }
    });
  }
  
  console.log('Cleanup complete!');
  
  // Verify
  const finalGroups = await prisma.customizationGroup.findMany();
  console.log(`Final count: ${finalGroups.length} groups`);
  
  await prisma.$disconnect();
}

quickCleanup().catch(console.error);
