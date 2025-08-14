const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Cleaning up bad data...');
    
    // Delete any sizes with "ddd" in the name
    const badSizes = await prisma.pizzaSize.deleteMany({
      where: {
        OR: [
          { name: { contains: 'ddd' } },
          { name: { contains: 'DDD' } }
        ]
      }
    });
    console.log(`Deleted ${badSizes.count} bad sizes`);
    
    // Update any sauces with "origina" to correct name
    const badSauceUpdate = await prisma.pizzaSauce.updateMany({
      where: {
        OR: [
          { name: { contains: 'origina' } },
          { name: { contains: 'ORIGINA' } }
        ]
      },
      data: {
        name: 'ORIGINAL PIZZA'
      }
    });
    console.log(`Updated ${badSauceUpdate.count} bad sauces`);
    
    // Check remaining data
    console.log('\n=== Remaining Data ===');
    const sizes = await prisma.pizzaSize.findMany({ orderBy: { sortOrder: 'asc' } });
    console.log('Sizes:');
    sizes.forEach(s => console.log(`- ${s.name}`));
    
    const sauces = await prisma.pizzaSauce.findMany({ orderBy: { sortOrder: 'asc' } });
    console.log('\nSauces:');
    sauces.forEach(s => console.log(`- ${s.name}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
