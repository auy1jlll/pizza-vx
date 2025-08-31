const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateSpecialtyCalzones() {
  console.log('Populating specialty calzones...');

  try {
    // Get calzone sizes for connecting specialty calzones
    const calzoneSizes = await prisma.pizzaSize.findMany({
      where: { productType: 'CALZONE' }
    });

    const smallCalzoneSize = calzoneSizes.find(s => s.name === 'Small Calzone');
    const largeCalzoneSize = calzoneSizes.find(s => s.name === 'Large Calzone');

    if (!smallCalzoneSize || !largeCalzoneSize) {
      throw new Error('Calzone sizes not found');
    }

    // Specialty calzones data from backup
    const specialtyCalzones = [
      {
        calzoneName: 'Veggie Calzone',
        calzoneDescription: 'Fresh vegetable calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Roasted peppers","roasted onions","grilled tomatoes","mushrooms and broccoli"]',
        sortOrder: 1
      },
      {
        calzoneName: 'Traditional Calzone',
        calzoneDescription: 'Classic pepperoni calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Pepperoni","ricotta cheese","sauce and our blends of mozzarella cheese"]',
        sortOrder: 2
      },
      {
        calzoneName: 'Ham & Cheese Calzone',
        calzoneDescription: 'Ham and cheese calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Sauce","a blend of our cheese and ham and american cheese"]',
        sortOrder: 3
      },
      {
        calzoneName: 'Chicken Parmesan Calzone',
        calzoneDescription: 'Chicken parmesan calzone with marinara',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Chicken parmesan","ricotta cheese with marinara sauce"]',
        sortOrder: 4
      },
      {
        calzoneName: 'Chicken Broccoli Alfredo Calzone',
        calzoneDescription: 'Chicken and broccoli with alfredo sauce',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Chicken","broccoli and onions with white alfredo sauce"]',
        sortOrder: 5
      },
      {
        calzoneName: 'Greek Calzone',
        calzoneDescription: 'Mediterranean style calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Feta","spinach and tomatoes"]',
        sortOrder: 6
      },
      {
        calzoneName: 'Meatball Calzone',
        calzoneDescription: 'Hearty meatball calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: '["Meatballs with marinara sauce and mozzarella cheese"]',
        sortOrder: 7
      }
    ];

    for (const calzone of specialtyCalzones) {
      // Check if specialty calzone already exists
      const existingCalzone = await prisma.specialtyCalzone.findUnique({
        where: { calzoneName: calzone.calzoneName }
      });

      let specialtyCalzone;
      if (existingCalzone) {
        // Update existing calzone
        specialtyCalzone = await prisma.specialtyCalzone.update({
          where: { id: existingCalzone.id },
          data: calzone
        });
        console.log(`Updated specialty calzone: ${calzone.calzoneName}`);
      } else {
        // Create new specialty calzone
        specialtyCalzone = await prisma.specialtyCalzone.create({
          data: calzone
        });
        console.log(`Created specialty calzone: ${calzone.calzoneName}`);
      }

      // Create or update specialty calzone sizes
      const sizes = [
        {
          pizzaSizeId: smallCalzoneSize.id,
          price: smallCalzoneSize.basePrice // Small calzone base price
        },
        {
          pizzaSizeId: largeCalzoneSize.id,
          price: largeCalzoneSize.basePrice // Large calzone base price
        }
      ];

      for (const size of sizes) {
        await prisma.specialtyCalzoneSize.upsert({
          where: {
            specialtyCalzoneId_pizzaSizeId: {
              specialtyCalzoneId: specialtyCalzone.id,
              pizzaSizeId: size.pizzaSizeId
            }
          },
          update: size,
          create: {
            specialtyCalzoneId: specialtyCalzone.id,
            ...size
          }
        });
      }
    }

    console.log('Specialty calzones populated successfully!');

  } catch (error) {
    console.error('Error populating specialty calzones:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateSpecialtyCalzones()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
