const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // App Settings
  await prisma.appSetting.upsert({
    where: { key: 'taxRate' },
    update: {},
    create: { key: 'taxRate', value: '0.0825', type: 'NUMBER' },
  });

  // Pizza Sizes
  const sizes = [
    { name: 'Small', diameter: '10"', basePrice: 12.99, sortOrder: 1 },
    { name: 'Medium', diameter: '12"', basePrice: 15.99, sortOrder: 2 },
    { name: 'Large', diameter: '16"', basePrice: 18.99, sortOrder: 3 },
    { name: 'Extra Large', diameter: '18"', basePrice: 21.99, sortOrder: 4 },
  ];
  for (const size of sizes) {
    await prisma.pizzaSize.upsert({
      where: { name: size.name },
      update: {},
      create: size,
    });
  }

  // Pizza Crusts
  const crusts = [
    { name: 'Thin Crust', description: 'Crispy and light', priceModifier: 0, sortOrder: 1 },
    { name: 'Hand-Tossed', description: 'Classic, chewy crust', priceModifier: 0, sortOrder: 2 },
    { name: 'Stuffed Crust', description: 'Cheese-filled crust', priceModifier: 3.00, sortOrder: 3 },
    { name: 'Cauliflower Crust', description: 'Gluten-free option', priceModifier: 2.50, sortOrder: 4 },
  ];
  for (const crust of crusts) {
    await prisma.pizzaCrust.upsert({
      where: { name: crust.name },
      update: {},
      create: crust,
    });
  }

  // Pizza Sauces
  const sauces = [
    { name: 'Marinara', description: 'Classic tomato sauce', color: '#e53e3e', spiceLevel: 0, priceModifier: 0, sortOrder: 1 },
    { name: 'Alfredo', description: 'Creamy white sauce', color: '#f7fafc', spiceLevel: 0, priceModifier: 1.50, sortOrder: 2 },
    { name: 'BBQ Sauce', description: 'Smoky and sweet', color: '#8a380c', spiceLevel: 1, priceModifier: 1.00, sortOrder: 3 },
    { name: 'Pesto', description: 'Basil and garlic sauce', color: '#38a169', spiceLevel: 0, priceModifier: 1.50, sortOrder: 4 },
  ];
  for (const sauce of sauces) {
    await prisma.pizzaSauce.upsert({
      where: { name: sauce.name },
      update: {},
      create: sauce,
    });
  }

  // Pizza Toppings
  const toppings = [
    { name: 'Pepperoni', category: 'MEAT', price: 2.00, sortOrder: 1 },
    { name: 'Sausage', category: 'MEAT', price: 2.00, sortOrder: 2 },
    { name: 'Bacon', category: 'MEAT', price: 2.50, sortOrder: 3 },
    { name: 'Ham', category: 'MEAT', price: 2.00, sortOrder: 4 },
    { name: 'Chicken', category: 'MEAT', price: 2.50, sortOrder: 5 },
    { name: 'Mushrooms', category: 'VEGETABLE', price: 1.50, sortOrder: 10, isVegetarian: true, isVegan: true },
    { name: 'Onions', category: 'VEGETABLE', price: 1.00, sortOrder: 11, isVegetarian: true, isVegan: true },
    { name: 'Green Peppers', category: 'VEGETABLE', price: 1.50, sortOrder: 12, isVegetarian: true, isVegan: true },
    { name: 'Black Olives', category: 'VEGETABLE', price: 1.50, sortOrder: 13, isVegetarian: true, isVegan: true },
    { name: 'Tomatoes', category: 'VEGETABLE', price: 1.50, sortOrder: 14, isVegetarian: true, isVegan: true },
    { name: 'Spinach', category: 'VEGETABLE', price: 1.50, sortOrder: 15, isVegetarian: true, isVegan: true },
    { name: 'Extra Cheese', category: 'CHEESE', price: 2.00, sortOrder: 20, isVegetarian: true },
    { name: 'Feta Cheese', category: 'CHEESE', price: 2.50, sortOrder: 21, isVegetarian: true },
    { name: 'Goat Cheese', category: 'CHEESE', price: 3.00, sortOrder: 22, isVegetarian: true },
    { name: 'Pineapple', category: 'SPECIALTY', price: 1.50, sortOrder: 30, isVegetarian: true, isVegan: true },
    { name: 'Jalapeños', category: 'SPECIALTY', price: 1.50, sortOrder: 31, isVegetarian: true, isVegan: true },
  ];

  for (const topping of toppings) {
    await prisma.pizzaTopping.upsert({
      where: { name: topping.name },
      update: {},
      create: topping,
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
