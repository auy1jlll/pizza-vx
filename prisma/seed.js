// Simple database seeding script for development
// This can be run with: node prisma/seed.js

// Mock data that matches the API
const mockData = {
  sizes: [
    { name: 'Small', diameter: '10"', basePrice: 12.99, isActive: true, sortOrder: 1 },
    { name: 'Medium', diameter: '12"', basePrice: 15.99, isActive: true, sortOrder: 2 },
    { name: 'Large', diameter: '14"', basePrice: 18.99, isActive: true, sortOrder: 3 },
    { name: 'Extra Large', diameter: '16"', basePrice: 21.99, isActive: true, sortOrder: 4 }
  ],
  crusts: [
    { name: 'Thin Crust', description: 'Crispy and light', priceModifier: 0, isActive: true, sortOrder: 1 },
    { name: 'Regular Crust', description: 'Classic pizza crust', priceModifier: 0, isActive: true, sortOrder: 2 },
    { name: 'Thick Crust', description: 'Extra thick and chewy', priceModifier: 2.00, isActive: true, sortOrder: 3 },
    { name: 'Stuffed Crust', description: 'Cheese-filled crust', priceModifier: 3.00, isActive: true, sortOrder: 4 }
  ],
  sauces: [
    { name: 'Marinara', description: 'Classic tomato sauce', color: '#e53e3e', spiceLevel: 0, priceModifier: 0, isActive: true, sortOrder: 1 },
    { name: 'White Sauce', description: 'Creamy garlic base', color: '#f7fafc', spiceLevel: 0, priceModifier: 1.00, isActive: true, sortOrder: 2 },
    { name: 'BBQ Sauce', description: 'Sweet and tangy', color: '#744210', spiceLevel: 1, priceModifier: 1.50, isActive: true, sortOrder: 3 },
    { name: 'Spicy Marinara', description: 'Tomato sauce with heat', color: '#c53030', spiceLevel: 3, priceModifier: 0.50, isActive: true, sortOrder: 4 }
  ],
  toppings: [
    // Meats
    { name: 'Pepperoni', category: 'MEAT', price: 1.50, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 1 },
    { name: 'Italian Sausage', category: 'MEAT', price: 1.75, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 2 },
    { name: 'Ham', category: 'MEAT', price: 1.50, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 3 },
    { name: 'Bacon', category: 'MEAT', price: 2.00, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 4 },
    
    // Vegetables
    { name: 'Mushrooms', category: 'VEGETABLE', price: 1.00, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 5 },
    { name: 'Bell Peppers', category: 'VEGETABLE', price: 1.00, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 6 },
    { name: 'Red Onions', category: 'VEGETABLE', price: 0.75, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 7 },
    { name: 'Black Olives', category: 'VEGETABLE', price: 1.25, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 8 },
    
    // Cheese
    { name: 'Extra Cheese', category: 'CHEESE', price: 2.00, isActive: true, isVegetarian: true, isVegan: false, sortOrder: 9 },
    { name: 'Parmesan', category: 'CHEESE', price: 1.50, isActive: true, isVegetarian: true, isVegan: false, sortOrder: 10 },
    { name: 'Feta Cheese', category: 'CHEESE', price: 1.75, isActive: true, isVegetarian: true, isVegan: false, sortOrder: 11 }
  ]
};

console.log('Pizza Builder Database Seed Data');
console.log('==================================');
console.log('This seed data is currently used in the API mock data.');
console.log('When you set up a real database, replace the mock data in');
console.log('src/app/api/pizza-builder/route.ts with Prisma database calls.');
console.log('');
console.log('Data Summary:');
console.log(-  Pizza Sizes);
console.log(-  Crust Types);
console.log(-  Sauce Options);
console.log(-  Toppings Available);
console.log('');
console.log('To integrate with a real database:');
console.log('1. Update your .env file with a real DATABASE_URL');
console.log('2. Run: npx prisma migrate dev');
console.log('3. Replace the API mock data with Prisma queries');
console.log('4. Import and use this seed data in your database');

module.exports = mockData;
