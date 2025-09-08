// Fix specialty calzones names in production
const { PrismaClient } = require('@prisma/client');

async function fixSpecialtyCalzoneNames() {
  const prisma = new PrismaClient();

  try {
    console.log('Fixing specialty calzone names...');

    // Get all specialty calzones with missing names
    const calzones = await prisma.specialtyCalzone.findMany({
      where: {
        OR: [
          { calzoneName: null },
          { calzoneName: '' }
        ]
      }
    });

    console.log(`Found ${calzones.length} calzones with missing names`);

    // Define proper names for the calzones
    const calzoneNames = [
      'Veggie Calzone',
      'Traditional Calzone', 
      'Ham & Cheese Calzone',
      'Chicken Parmesan Calzone',
      'Chicken Broccoli Alfredo Calzone',
      'Greek Calzone',
      'Meatball Calzone'
    ];

    // Update each calzone with proper names
    for (let i = 0; i < calzones.length; i++) {
      const calzone = calzones[i];
      const name = calzoneNames[i] || `Specialty Calzone ${i + 1}`;
      
      await prisma.specialtyCalzone.update({
        where: { id: calzone.id },
        data: {
          calzoneName: name,
          calzoneDescription: calzone.calzoneDescription || `Delicious ${name.toLowerCase()} with premium ingredients`
        }
      });

      console.log(`✅ Updated: ${name}`);
    }

    console.log('Specialty calzone names fixed successfully!');

  } catch (error) {
    console.error('Error fixing calzone names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecialtyCalzoneNames();
