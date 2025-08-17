const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleModifiers() {
  try {
    console.log('Creating sample modifiers...');

    const modifiers = [
      { name: 'Extra Cheese', type: 'TOPPING', price: 2.50 },
      { name: 'Pepperoni', type: 'TOPPING', price: 3.00 },
      { name: 'Mushrooms', type: 'TOPPING', price: 2.00 },
      { name: 'French Fries', type: 'SIDE', price: 4.99 },
      { name: 'Onion Rings', type: 'SIDE', price: 5.99 },
      { name: 'Ranch Dressing', type: 'DRESSING', price: 0.50 },
      { name: 'Caesar Dressing', type: 'DRESSING', price: 0.50 },
      { name: 'Ketchup', type: 'CONDIMENT', price: 0.00 },
      { name: 'Mustard', type: 'CONDIMENT', price: 0.00 },
      { name: 'Large', type: 'SIZE', price: 3.00 },
      { name: 'Medium', type: 'SIZE', price: 1.50 },
      { name: 'Small', type: 'SIZE', price: 0.00 },
    ];

    for (const modifier of modifiers) {
      const created = await prisma.modifier.create({
        data: modifier
      });
      console.log(`Created modifier: ${created.name} (${created.type})`);
    }

    console.log('Sample modifiers created successfully!');

  } catch (error) {
    console.error('Error creating modifiers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleModifiers();
