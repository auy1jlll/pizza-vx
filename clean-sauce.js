const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('=== CLEANING UP BAD SAUCE DATA ===');
    
    // Delete the bad sauce "origina pizza"
    const deletedSauce = await prisma.pizzaSauce.deleteMany({
      where: {
        name: "origina pizza"
      }
    });
    
    console.log(`Deleted ${deletedSauce.count} bad sauce records`);
    
    // Check remaining sauces
    const remainingSauces = await prisma.pizzaSauce.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('Remaining sauces:');
    remainingSauces.forEach(sauce => {
      console.log(`- ${sauce.name} (ID: ${sauce.id})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
