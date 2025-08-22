const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSpecialtyCalzones() {
  try {
    console.log('🥟 Creating specialty calzones...');

    // First, clear existing specialty pizzas that might conflict
    await prisma.specialtyPizza.deleteMany({
      where: {
        name: {
          in: [
            'Veggie Calzone',
            'Traditional Calzone', 
            'Ham & Cheese Calzone',
            'Chicken Parmesan Calzone',
            'Chicken Broccoli Alfredo Calzone',
            'Greek Calzone',
            'Meatball Calzone'
          ]
        }
      }
    });

    const specialtyCalzones = [
      {
        name: 'Veggie Calzone',
        description: 'Fresh vegetable calzone',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Roasted peppers, roasted onions, grilled tomatoes, mushrooms and broccoli',
        isActive: true
      },
      {
        name: 'Traditional Calzone',
        description: 'Classic pepperoni calzone',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Pepperoni, ricotta cheese, sauce and our blends of mozzarella cheese',
        isActive: true
      },
      {
        name: 'Ham & Cheese Calzone',
        description: 'Ham and cheese calzone',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Sauce, a blend of our cheese and ham and american cheese',
        isActive: true
      },
      {
        name: 'Chicken Parmesan Calzone',
        description: 'Chicken parmesan calzone with marinara',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Chicken parmesan, ricotta cheese with marinara sauce',
        isActive: true
      },
      {
        name: 'Chicken Broccoli Alfredo Calzone',
        description: 'Chicken and broccoli with alfredo sauce',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Chicken, broccoli and onions with white alfredo sauce',
        isActive: true
      },
      {
        name: 'Greek Calzone',
        description: 'Mediterranean style calzone',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Feta, spinach and tomatoes',
        isActive: true
      },
      {
        name: 'Meatball Calzone',
        description: 'Hearty meatball calzone',
        basePrice: 21.50,
        category: 'CALZONE',
        ingredients: 'Meatballs with marinara sauce and mozzarella cheese',
        isActive: true
      }
    ];

    console.log('\n📝 Creating calzone entries...');
    
    for (const calzone of specialtyCalzones) {
      const created = await prisma.specialtyPizza.create({
        data: calzone
      });
      console.log(`✅ Created: ${created.name}`);
    }

    // Get calzone sizes for creating specialty pizza sizes
    const calzoneSizes = await prisma.pizzaSize.findMany({
      where: {
        productType: 'CALZONE'
      }
    });

    if (calzoneSizes.length > 0) {
      console.log('\n📏 Creating size associations...');
      
      const allCalzones = await prisma.specialtyPizza.findMany({
        where: {
          category: 'CALZONE'
        }
      });

      for (const calzone of allCalzones) {
        for (const size of calzoneSizes) {
          await prisma.specialtyPizzaSize.create({
            data: {
              specialtyPizzaId: calzone.id,
              pizzaSizeId: size.id,
              price: size.basePrice, // Use the calzone size base price
              isAvailable: true
            }
          });
        }
        console.log(`   Added sizes for ${calzone.name}`);
      }
    }

    console.log('\n🎉 Specialty calzones created successfully!');
    
    // Show summary
    const calzoneCount = await prisma.specialtyPizza.count({
      where: {
        category: 'CALZONE'
      }
    });
    
    console.log(`\n📊 Summary: ${calzoneCount} specialty calzones available`);

  } catch (error) {
    console.error('❌ Error creating specialty calzones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSpecialtyCalzones();
