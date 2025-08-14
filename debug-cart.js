const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('=== CHECKING SPECIALTY PIZZA vs REGULAR SIZES ===\n');
    
    // Get the specialty pizza
    const specialty = await prisma.specialtyPizza.findUnique({
      where: { id: 'cmeawfum10000vky8ky7a97km' },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });
    
    if (specialty) {
      console.log(`Specialty Pizza: ${specialty.name}`);
      console.log('Available sizes from specialty pizza:');
      specialty.sizes.forEach(s => {
        console.log(`- ID: ${s.pizzaSize.id}, Name: "${s.pizzaSize.name}", Price: $${s.price}`);
      });
    }
    
    console.log('\nAll pizza sizes in database:');
    const allSizes = await prisma.pizzaSize.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    allSizes.forEach(size => {
      console.log(`- ID: ${size.id}, Name: "${size.name}", BasePrice: $${size.basePrice}`);
    });
    
    console.log('\nAll crusts:');
    const allCrusts = await prisma.pizzaCrust.findMany();
    allCrusts.forEach(crust => {
      console.log(`- ID: ${crust.id}, Name: "${crust.name}"`);
    });
    
    console.log('\nAll sauces:');
    const allSauces = await prisma.pizzaSauce.findMany();
    allSauces.forEach(sauce => {
      console.log(`- ID: ${sauce.id}, Name: "${sauce.name}"`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
