const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// This script contains your essential restaurant data that should always be available
// Even if you lose your database, running this will restore core functionality

async function seedEssentialData() {
  console.log('🌱 Seeding essential restaurant data...');

  try {
    // Pizza Sizes (Essential)
    const pizzaSizes = [
      { id: 'cm5v8k7l8000001jk8k7l8000', name: 'Personal', diameter: '8"', basePrice: 8.99, isActive: true, sortOrder: 1 },
      { id: 'cm5v8k7l8000002jk8k7l8001', name: 'Small', diameter: '10"', basePrice: 12.99, isActive: true, sortOrder: 2 },
      { id: 'cm5v8k7l8000003jk8k7l8002', name: 'Medium', diameter: '12"', basePrice: 15.99, isActive: true, sortOrder: 3 },
      { id: 'cm5v8k7l8000004jk8k7l8003', name: 'Large', diameter: '14"', basePrice: 18.99, isActive: true, sortOrder: 4 }
    ];

    for (const size of pizzaSizes) {
      await prisma.pizzaSize.upsert({
        where: { id: size.id },
        update: size,
        create: size
      });
    }

    // Pizza Crusts (Essential)
    const pizzaCrusts = [
      { id: 'cm5v8k7l8000005jk8k7l8004', name: 'Traditional Hand Tossed', description: 'Our classic hand-tossed crust', priceModifier: 0, isActive: true, sortOrder: 1 },
      { id: 'cm5v8k7l8000006jk8k7l8005', name: 'Thin Crust', description: 'Crispy thin crust', priceModifier: 0, isActive: true, sortOrder: 2 },
      { id: 'cm5v8k7l8000007jk8k7l8006', name: 'Thick Crust', description: 'Extra thick and fluffy', priceModifier: 2, isActive: true, sortOrder: 3 }
    ];

    for (const crust of pizzaCrusts) {
      await prisma.pizzaCrust.upsert({
        where: { id: crust.id },
        update: crust,
        create: crust
      });
    }

    // Pizza Sauces (Essential)
    const pizzaSauces = [
      { id: 'cm5v8k7l8000008jk8k7l8007', name: 'Traditional Marinara', description: 'Classic tomato sauce', color: '#DC2626', spiceLevel: 0, priceModifier: 0, isActive: true, sortOrder: 1 },
      { id: 'cm5v8k7l8000009jk8k7l8008', name: 'White Sauce', description: 'Creamy garlic white sauce', color: '#F3F4F6', spiceLevel: 0, priceModifier: 1, isActive: true, sortOrder: 2 },
      { id: 'cm5v8k7l8000010jk8k7l8009', name: 'BBQ Sauce', description: 'Sweet and tangy BBQ', color: '#92400E', spiceLevel: 0, priceModifier: 1, isActive: true, sortOrder: 3 },
      { id: 'cm5v8k7l8000011jk8k7l8010', name: 'Spicy Arrabbiata', description: 'Spicy tomato sauce with herbs', color: '#DC2626', spiceLevel: 3, priceModifier: 1, isActive: true, sortOrder: 4 },
      { id: 'cm5v8k7l8000012jk8k7l8011', name: 'Pesto', description: 'Fresh basil pesto sauce', color: '#059669', spiceLevel: 0, priceModifier: 2, isActive: true, sortOrder: 5 }
    ];

    for (const sauce of pizzaSauces) {
      await prisma.pizzaSauce.upsert({
        where: { id: sauce.id },
        update: sauce,
        create: sauce
      });
    }

    // Essential Pizza Toppings
    const essentialToppings = [
      // Meats
      { name: 'Pepperoni', category: 'MEAT', price: 2.50, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Italian Sausage', category: 'MEAT', price: 2.50, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Ground Beef', category: 'MEAT', price: 2.50, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Ham', category: 'MEAT', price: 2.50, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Bacon', category: 'MEAT', price: 3.00, isVegetarian: false, isVegan: false, isGlutenFree: false },
      { name: 'Canadian Bacon', category: 'MEAT', price: 2.75, isVegetarian: false, isVegan: false, isGlutenFree: false },

      // Vegetables
      { name: 'Mushrooms', category: 'VEGETABLE', price: 1.50, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Bell Peppers', category: 'VEGETABLE', price: 1.50, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Red Onions', category: 'VEGETABLE', price: 1.25, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Black Olives', category: 'VEGETABLE', price: 1.75, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Green Olives', category: 'VEGETABLE', price: 1.75, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Jalapeños', category: 'VEGETABLE', price: 1.50, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Tomatoes', category: 'VEGETABLE', price: 1.50, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Spinach', category: 'VEGETABLE', price: 2.00, isVegetarian: true, isVegan: true, isGlutenFree: true },

      // Cheese
      { name: 'Extra Mozzarella', category: 'CHEESE', price: 2.00, isVegetarian: true, isVegan: false, isGlutenFree: true },
      { name: 'Cheddar Cheese', category: 'CHEESE', price: 2.25, isVegetarian: true, isVegan: false, isGlutenFree: true },
      { name: 'Parmesan', category: 'CHEESE', price: 2.50, isVegetarian: true, isVegan: false, isGlutenFree: true },
      { name: 'Feta Cheese', category: 'CHEESE', price: 2.75, isVegetarian: true, isVegan: false, isGlutenFree: true },

      // Premium
      { name: 'Pineapple', category: 'PREMIUM', price: 2.00, isVegetarian: true, isVegan: true, isGlutenFree: true },
      { name: 'Anchovies', category: 'PREMIUM', price: 3.00, isVegetarian: false, isVegan: false, isGlutenFree: true }
    ];

    let toppingOrder = 1;
    for (const topping of essentialToppings) {
      await prisma.pizzaTopping.upsert({
        where: { name: topping.name },
        update: { ...topping, sortOrder: toppingOrder++ },
        create: { ...topping, sortOrder: toppingOrder++, isActive: true }
      });
    }

    // Essential App Settings
    const essentialSettings = [
      { key: 'restaurant_name', value: 'Greenland Famous Pizza', type: 'STRING', category: 'GENERAL', description: 'Restaurant name' },
      { key: 'restaurant_phone', value: '(555) 123-PIZZA', type: 'STRING', category: 'CONTACT', description: 'Restaurant phone number' },
      { key: 'restaurant_email', value: 'info@greenlandfamous.com', type: 'STRING', category: 'CONTACT', description: 'Restaurant email' },
      { key: 'delivery_fee', value: '3.99', type: 'NUMBER', category: 'PRICING', description: 'Standard delivery fee' },
      { key: 'minimum_order', value: '15.00', type: 'NUMBER', category: 'PRICING', description: 'Minimum order amount' },
      { key: 'tax_rate', value: '0.08', type: 'NUMBER', category: 'PRICING', description: 'Tax rate (8%)' },
      { key: 'store_hours', value: '{"monday":"11:00-22:00","tuesday":"11:00-22:00","wednesday":"11:00-22:00","thursday":"11:00-22:00","friday":"11:00-23:00","saturday":"11:00-23:00","sunday":"12:00-21:00"}', type: 'JSON', category: 'OPERATIONS', description: 'Store operating hours' }
    ];

    for (const setting of essentialSettings) {
      await prisma.appSetting.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting
      });
    }

    console.log('✅ Essential data seeded successfully!');
    console.log('📊 Seeded:');
    console.log(`   - Pizza Sizes: ${pizzaSizes.length}`);
    console.log(`   - Pizza Crusts: ${pizzaCrusts.length}`);
    console.log(`   - Pizza Sauces: ${pizzaSauces.length}`);
    console.log(`   - Pizza Toppings: ${essentialToppings.length}`);
    console.log(`   - App Settings: ${essentialSettings.length}`);

  } catch (error) {
    console.error('❌ Essential data seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedEssentialData().catch(console.error);
}

module.exports = { seedEssentialData };
