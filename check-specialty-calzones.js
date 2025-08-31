const { PrismaClient } = require('@prisma/client');

async function checkSpecialtyCalzones() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking SpecialtyCalzone records...');
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: true
      }
    });

    console.log(`Found ${specialtyCalzones.length} SpecialtyCalzone records:`);
    specialtyCalzones.forEach(calzone => {
      console.log(`- ${calzone.calzoneName}: ${calzone.fillings}`);
      console.log(`  Sizes: ${calzone.sizes.length}`);
    });

    if (specialtyCalzones.length === 0) {
      console.log('No SpecialtyCalzone records found. Checking MenuItem records for calzones...');
      const menuItems = await prisma.menuItem.findMany({
        where: {
          category: {
            name: 'Calzones'
          }
        }
      });

      console.log(`Found ${menuItems.length} MenuItem calzone records:`);
      menuItems.forEach(item => {
        console.log(`- ${item.name}: ${item.description}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecialtyCalzones();
