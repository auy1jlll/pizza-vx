const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('=== CHECKING FOR ORPHANED DATA ===');
    
    // Check for any specialty pizza sizes that reference non-existent pizza sizes
    const allSpecialtyPizzaSizes = await prisma.specialtyPizzaSize.findMany({
      include: {
        pizzaSize: true,
        specialtyPizza: true
      }
    });
    
    console.log('All specialty pizza size relationships:');
    allSpecialtyPizzaSizes.forEach(sps => {
      if (!sps.pizzaSize) {
        console.log(`ORPHANED: SpecialtyPizzaSize ${sps.id} references non-existent pizzaSize ${sps.pizzaSizeId}`);
      } else {
        console.log(`OK: ${sps.specialtyPizza.name} -> ${sps.pizzaSize.name} ($${sps.price})`);
      }
    });
    
    // Check for any sizes that might have similar names to "ddd"
    const sizes = await prisma.pizzaSize.findMany();
    console.log('\n=== SEARCHING FOR SUSPICIOUS SIZES ===');
    sizes.forEach(size => {
      if (size.name.toLowerCase().includes('ddd') || size.description.toLowerCase().includes('ddd')) {
        console.log(`SUSPICIOUS: ${size.id}: "${size.name}" - ${size.description}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
