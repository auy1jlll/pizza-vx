const { PrismaClient } = require('@prisma/client');

async function populateComponents() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting to populate pizza components...');
    
    // Add basic crusts
    console.log('Adding crusts...');
    const crusts = [
      { name: 'THIN CRUST', description: 'Crispy and light', priceModifier: 0 },
      { name: 'REGULAR CRUST', description: 'Classic hand-tossed', priceModifier: 1.00 },
      { name: 'THICK CRUST', description: 'Deep dish style', priceModifier: 2.00 }
    ];
    
    let crustCount = 0;
    for (const crust of crusts) {
      try {
        await prisma.pizzaCrust.create({ data: crust });
        crustCount++;
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Crust ${crust.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log('✅ Added crusts:', crustCount);

    // Add basic sauces
    console.log('Adding sauces...');
    const sauces = [
      { name: 'ORIGINAL PIZZA', description: 'Classic tomato sauce', color: '#CC0000', spiceLevel: 1, priceModifier: 0 },
      { name: 'BBQ SAUCE', description: 'Smoky barbecue', color: '#8B4513', spiceLevel: 2, priceModifier: 0.50 },
      { name: 'WHITE SAUCE', description: 'Creamy garlic', color: '#FFFFFF', spiceLevel: 0, priceModifier: 0.75 }
    ];
    
    let sauceCount = 0;
    for (const sauce of sauces) {
      try {
        await prisma.pizzaSauce.create({ data: sauce });
        sauceCount++;
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Sauce ${sauce.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log('✅ Added sauces:', sauceCount);

    // Add basic toppings
    console.log('Adding toppings...');
    const toppings = [
      { name: 'EXTRA CHEESE', category: 'CHEESE', price: 2.00, isVegetarian: true },
      { name: 'PEPPERONI', category: 'MEAT', price: 2.50, isVegetarian: false },
      { name: 'MUSHROOMS', category: 'VEGETABLE', price: 1.50, isVegetarian: true },
      { name: 'ITALIAN SAUSAGE', category: 'MEAT', price: 2.75, isVegetarian: false },
      { name: 'GREEN PEPPERS', category: 'VEGETABLE', price: 1.25, isVegetarian: true }
    ];
    
    let toppingCount = 0;
    for (const topping of toppings) {
      try {
        await prisma.pizzaTopping.create({ data: topping });
        toppingCount++;
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Topping ${topping.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log('✅ Added toppings:', toppingCount);

    console.log('🎉 All pizza components populated successfully!');
    
  } catch (error) {
    console.error('❌ Error populating components:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateComponents();
