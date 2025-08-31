const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateSpecialtyPrices() {
  console.log('Updating specialty calzone and pizza prices...');

  try {
    // Update calzone sizes
    const smallCalzone = await prisma.pizzaSize.findFirst({
      where: { name: 'Small Calzone', productType: 'CALZONE' }
    });

    const largeCalzone = await prisma.pizzaSize.findFirst({
      where: { name: 'Large Calzone', productType: 'CALZONE' }
    });

    if (smallCalzone) {
      await prisma.pizzaSize.update({
        where: { id: smallCalzone.id },
        data: { basePrice: 23.0 }
      });
      console.log('Updated Small Calzone price to $23.00');
    }

    if (largeCalzone) {
      await prisma.pizzaSize.update({
        where: { id: largeCalzone.id },
        data: { basePrice: 29.99 }
      });
      console.log('Updated Large Calzone price to $29.99');
    }

    // Update pizza sizes
    const smallPizza = await prisma.pizzaSize.findFirst({
      where: { name: 'Small Pizza', productType: 'PIZZA' }
    });

    const largePizza = await prisma.pizzaSize.findFirst({
      where: { name: 'Large Pizza', productType: 'PIZZA' }
    });

    if (smallPizza) {
      await prisma.pizzaSize.update({
        where: { id: smallPizza.id },
        data: { basePrice: 16.5 }
      });
      console.log('Updated Small Pizza price to $16.50');
    }

    if (largePizza) {
      await prisma.pizzaSize.update({
        where: { id: largePizza.id },
        data: { basePrice: 23.5 }
      });
      console.log('Updated Large Pizza price to $23.50');
    }

    // Update all specialty calzone sizes to match the new base prices
    const specialtyCalzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    for (const calzone of specialtyCalzones) {
      for (const size of calzone.sizes) {
        if (size.pizzaSize && size.pizzaSize.name === 'Small Calzone') {
          await prisma.specialtyCalzoneSize.update({
            where: { id: size.id },
            data: { price: 23.0 }
          });
        } else if (size.pizzaSize && size.pizzaSize.name === 'Large Calzone') {
          await prisma.specialtyCalzoneSize.update({
            where: { id: size.id },
            data: { price: 29.99 }
          });
        }
      }
    }
    console.log('Updated all specialty calzone sizes');

    // Update all specialty pizza sizes to match the new base prices
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    for (const pizza of specialtyPizzas) {
      for (const size of pizza.sizes) {
        if (size.pizzaSize && size.pizzaSize.name === 'Small Pizza') {
          // Small specialty pizza: new base price + specialty premium
          const newPrice = 16.5 + (pizza.basePrice - 16.5); // Maintain the premium difference
          await prisma.specialtyPizzaSize.update({
            where: { id: size.id },
            data: { price: newPrice }
          });
        } else if (size.pizzaSize && size.pizzaSize.name === 'Large Pizza') {
          // Large specialty pizza: new base price + specialty premium
          const newPrice = 23.5 + (pizza.basePrice - 16.5); // Maintain the premium difference
          await prisma.specialtyPizzaSize.update({
            where: { id: size.id },
            data: { price: newPrice }
          });
        }
      }
    }
    console.log('Updated all specialty pizza sizes');

    console.log('All prices updated successfully!');

  } catch (error) {
    console.error('Error updating prices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateSpecialtyPrices()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
