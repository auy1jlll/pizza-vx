const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('=== CURRENT SAUCES ===');
    const sauces = await prisma.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } });
    sauces.forEach(s => console.log(`ID: ${s.id}, Name: "${s.name}", SortOrder: ${s.sortOrder}`));
    
    console.log('\n=== FIXING BAD SAUCE ===');
    // Find the bad sauce
    const badSauce = sauces.find(s => s.name.includes('origina'));
    if (badSauce) {
      console.log(`Found bad sauce: "${badSauce.name}"`);
      
      // Delete the bad sauce since there's already a good one
      await prisma.pizzaSauce.delete({
        where: { id: badSauce.id }
      });
      console.log('Deleted bad sauce');
    } else {
      console.log('No bad sauce found');
    }
    
    console.log('\n=== FINAL SAUCES ===');
    const finalSauces = await prisma.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } });
    finalSauces.forEach(s => console.log(`- ${s.name}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
