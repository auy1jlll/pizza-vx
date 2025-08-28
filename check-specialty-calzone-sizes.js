const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSpecialtyCalzoneSizes() {
  try {
    console.log('=== SPECIALTY CALZONE SIZES ===');
    const calzoneSizes = await prisma.specialtyCalzoneSize.findMany({
      include: {
        specialtyCalzone: { select: { calzoneName: true } },
        pizzaSize: true
      }
    });
    
    console.log(`Found ${calzoneSizes.length} specialty calzone size entries:`);
    calzoneSizes.forEach(s => {
      console.log(`${s.specialtyCalzone.calzoneName}: ${s.pizzaSize.name} (${s.pizzaSize.diameter}) - $${s.price}`);
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkSpecialtyCalzoneSizes();
