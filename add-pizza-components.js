const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPizzaSaucesAndToppings() {
  try {
    console.log('🍕 ADDING PIZZA SAUCES AND TOPPINGS');
    console.log('===================================');

    // 1. ADD PIZZA SAUCES (all $0.00)
    console.log('\n🥄 Adding Pizza Sauces...');
    
    const sauces = [
      {
        name: 'Alfredo Sauce',
        description: 'Creamy white alfredo sauce',
        color: '#f7fafc',
        spiceLevel: 0,
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Garlic Butter Sauce',
        description: 'Rich garlic butter sauce',
        color: '#fefcbf',
        spiceLevel: 0,
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Pizza Sauce',
        description: 'Classic tomato pizza sauce',
        color: '#e53e3e',
        spiceLevel: 0,
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'White (No Sauce)',
        description: 'No sauce - just cheese and toppings',
        color: '#ffffff',
        spiceLevel: 0,
        priceModifier: 0.00,
        isActive: true,
        sortOrder: 4
      }
    ];

    for (const sauce of sauces) {
      const existing = await prisma.pizzaSauce.findUnique({
        where: { name: sauce.name }
      });

      if (existing) {
        console.log(`   ✅ ${sauce.name} already exists`);
      } else {
        await prisma.pizzaSauce.create({ data: sauce });
        console.log(`   ✅ Created ${sauce.name} (+$${sauce.priceModifier})`);
      }
    }

    // 2. ADD PIZZA TOPPINGS ($2.00)
    console.log('\n🧀 Adding Standard Toppings ($2.00)...');
    
    const standardToppings = [
      { name: 'Black Olives', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Broccoli', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Eggplant', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Extra Cheese', category: 'CHEESE', price: 2.00, isVegetarian: true, isVegan: false },
      { name: 'Feta', category: 'CHEESE', price: 2.00, isVegetarian: true, isVegan: false },
      { name: 'Fresh Mushrooms', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Fresh Onions', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Fresh Garlic', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Green Bell Peppers', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Grilled Onions', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Ham', category: 'MEAT', price: 2.00, isVegetarian: false, isVegan: false },
      { name: 'Hot Pepper Rings', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Jalapeños', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Meatballs', category: 'MEAT', price: 2.00, isVegetarian: false, isVegan: false },
      { name: 'Pepperoni', category: 'MEAT', price: 2.00, isVegetarian: false, isVegan: false },
      { name: 'Pineapple', category: 'SPECIALTY', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Ricotta Cheese', category: 'CHEESE', price: 2.00, isVegetarian: true, isVegan: false },
      { name: 'Roasted Bell Peppers', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Salami', category: 'MEAT', price: 2.00, isVegetarian: false, isVegan: false },
      { name: 'Sausage', category: 'MEAT', price: 2.00, isVegetarian: false, isVegan: false },
      { name: 'Spinach', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true },
      { name: 'Tomatoes', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true }
    ];

    let standardCount = 0;
    for (let i = 0; i < standardToppings.length; i++) {
      const topping = { ...standardToppings[i], sortOrder: i + 10, isActive: true };
      
      const existing = await prisma.pizzaTopping.findUnique({
        where: { name: topping.name }
      });

      if (existing) {
        console.log(`   ✅ ${topping.name} already exists`);
      } else {
        await prisma.pizzaTopping.create({ data: topping });
        console.log(`   ✅ Created ${topping.name} ($${topping.price})`);
        standardCount++;
      }
    }

    // 3. ADD PREMIUM TOPPINGS ($5.00)
    console.log('\n🥓 Adding Premium Toppings ($5.00)...');
    
    const premiumToppings = [
      { name: 'Bacon', category: 'MEAT', price: 5.00, isVegetarian: false, isVegan: false },
      { name: 'Chicken Fingers', category: 'MEAT', price: 5.00, isVegetarian: false, isVegan: false },
      { name: 'Grilled Chicken', category: 'MEAT', price: 5.00, isVegetarian: false, isVegan: false },
      { name: 'Roasted Chicken', category: 'MEAT', price: 5.00, isVegetarian: false, isVegan: false }
    ];

    let premiumCount = 0;
    for (let i = 0; i < premiumToppings.length; i++) {
      const topping = { ...premiumToppings[i], sortOrder: i + 50, isActive: true };
      
      const existing = await prisma.pizzaTopping.findUnique({
        where: { name: topping.name }
      });

      if (existing) {
        console.log(`   ✅ ${topping.name} already exists`);
      } else {
        await prisma.pizzaTopping.create({ data: topping });
        console.log(`   ✅ Created ${topping.name} ($${topping.price})`);
        premiumCount++;
      }
    }

    // 4. SUMMARY
    console.log('\n📊 FINAL SUMMARY');
    console.log('================');

    const finalSauces = await prisma.pizzaSauce.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    const finalToppings = await prisma.pizzaTopping.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n🥄 Pizza Sauces (${finalSauces.length} total):`);
    finalSauces.forEach(sauce => {
      console.log(`   ${sauce.name} (+$${sauce.priceModifier})`);
    });

    console.log(`\n🧀 Pizza Toppings (${finalToppings.length} total):`);
    const standardTops = finalToppings.filter(t => t.price === 2.00);
    const premiumTops = finalToppings.filter(t => t.price === 5.00);
    
    console.log(`\n   Standard Toppings ($2.00) - ${standardTops.length} items:`);
    standardTops.forEach(topping => {
      console.log(`     ${topping.name} (${topping.category})`);
    });

    console.log(`\n   Premium Toppings ($5.00) - ${premiumTops.length} items:`);
    premiumTops.forEach(topping => {
      console.log(`     ${topping.name} (${topping.category})`);
    });

    console.log(`\n✅ Pizza components are ready!`);
    console.log(`   - Added ${standardCount} new standard toppings`);
    console.log(`   - Added ${premiumCount} new premium toppings`);
    console.log(`   - All sauces are free ($0.00)`);
    console.log(`   - Standard toppings are $2.00 each`);
    console.log(`   - Premium toppings are $5.00 each`);

  } catch (error) {
    console.error('❌ Error adding pizza components:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPizzaSaucesAndToppings();
