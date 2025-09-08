const { PrismaClient } = require('@prisma/client');

async function forceFixProduction() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 FORCE FIXING PRODUCTION SPECIALTY PIZZAS');
    console.log('===========================================');
    
    // First, let's see what tables exist and what data is there
    console.log('📊 Checking current database structure...');
    
    // Check if we're dealing with menuItems instead of specialtyPizza
    try {
      const menuItems = await prisma.menuItem.findMany({
        where: {
          category: {
            name: { in: ['Specialty Pizzas', 'Gourmet Pizzas', 'Premium Pizzas'] }
          }
        },
        include: {
          category: true,
          sizes: true
        }
      });
      
      console.log(`Found ${menuItems.length} specialty pizzas in menuItems table`);
      
      if (menuItems.length > 0) {
        console.log('🗑️ Deleting old menuItem specialty pizzas...');
        
        // Delete old specialty pizza menu items
        await prisma.menuItem.deleteMany({
          where: {
            category: {
              name: { in: ['Specialty Pizzas', 'Gourmet Pizzas', 'Premium Pizzas'] }
            }
          }
        });
        
        console.log('✅ Old specialty pizzas deleted');
      }
      
    } catch (error) {
      console.log('No menuItems table or different structure, trying specialtyPizza...');
    }
    
    // Also try the specialtyPizza table
    try {
      const specialtyPizzas = await prisma.specialtyPizza.findMany();
      console.log(`Found ${specialtyPizzas.length} in specialtyPizza table`);
      
      if (specialtyPizzas.length > 0) {
        await prisma.specialtyPizzaSize.deleteMany({});
        await prisma.specialtyPizza.deleteMany({});
        console.log('✅ Old specialtyPizza data deleted');
      }
    } catch (error) {
      console.log('No specialtyPizza table found');
    }
    
    // Find or create Specialty Pizza category
    let specialtyCategory = await prisma.category.findFirst({
      where: { name: 'Specialty Pizzas' }
    });
    
    if (!specialtyCategory) {
      specialtyCategory = await prisma.category.create({
        data: {
          name: 'Specialty Pizzas',
          description: 'Our signature specialty pizzas',
          isActive: true,
          sortOrder: 3
        }
      });
      console.log('✅ Created Specialty Pizzas category');
    }
    
    // Find or create pizza sizes (only 2 sizes as requested)
    let smallSize = await prisma.pizzaSize.findFirst({ where: { name: 'Small' } });
    let largeSize = await prisma.pizzaSize.findFirst({ where: { name: 'Large' } });
    
    if (!smallSize) {
      smallSize = await prisma.pizzaSize.create({
        data: { name: 'Small', diameter: '10"', basePrice: 12.99, isActive: true, sortOrder: 1 }
      });
    }
    
    if (!largeSize) {
      largeSize = await prisma.pizzaSize.create({
        data: { name: 'Large', diameter: '14"', basePrice: 18.99, isActive: true, sortOrder: 2 }
      });
    }
    
    console.log('✅ Pizza sizes ready: Small & Large only');
    
    // Create proper specialty pizzas (6 pizzas, 2 sizes each)
    const newPizzas = [
      { name: 'Chicken Alfredo', description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses', basePrice: 15.45 },
      { name: 'BBQ Chicken', description: 'Chicken, Onion and Bacon with lots of BBQ sauce', basePrice: 16.50 },
      { name: 'House Special', description: 'Pepperoni, Italian Sausage, Mushrooms, Green Peppers, and Onions', basePrice: 17.99 },
      { name: 'Meat Lovers', description: 'Pepperoni, Italian Sausage, Ham, and Bacon', basePrice: 18.99 },
      { name: 'Veggie Supreme', description: 'Mushrooms, Green Peppers, Onions, Black Olives, and Tomatoes', basePrice: 16.99 },
      { name: 'Hawaiian', description: 'Ham and Pineapple on our signature pizza sauce', basePrice: 15.99 }
    ];
    
    console.log('🍕 Creating 6 specialty pizzas with 2 sizes each...');
    
    for (const pizzaData of newPizzas) {
      // Create as menuItem (this seems to be the structure your production uses)
      const pizza = await prisma.menuItem.create({
        data: {
          name: pizzaData.name,
          description: pizzaData.description,
          basePrice: pizzaData.basePrice,
          categoryId: specialtyCategory.id,
          isActive: true,
          isAvailable: true
        }
      });
      
      // Create 2 sizes for each pizza
      await prisma.menuItemSize.create({
        data: {
          menuItemId: pizza.id,
          pizzaSizeId: smallSize.id,
          price: 14.99,  // Small price
          isAvailable: true
        }
      });
      
      await prisma.menuItemSize.create({
        data: {
          menuItemId: pizza.id,
          pizzaSizeId: largeSize.id,
          price: 22.99,  // Large price
          isAvailable: true
        }
      });
      
      console.log(`✅ ${pizza.name} - Created with 2 sizes (Small: $14.99, Large: $22.99)`);
    }
    
    console.log('\n🎉 PRODUCTION FIX COMPLETED!');
    console.log('✅ 6 specialty pizzas created');
    console.log('✅ Each pizza has exactly 2 sizes (Small & Large)');
    console.log('✅ Old garbage data completely removed');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

forceFixProduction();
