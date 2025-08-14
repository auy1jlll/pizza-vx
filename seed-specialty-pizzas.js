import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSpecialtyPizzas() {
  console.log('Seeding specialty pizzas...');

  const specialtyPizzas = [
    {
      name: 'Margherita Classic',
      description: 'Fresh mozzarella, tomato sauce, fresh basil, and olive oil drizzle',
      basePrice: 14.99,
      category: 'Classic',
      ingredients: ['Fresh Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'Pepperoni Supreme',
      description: 'Double pepperoni, mozzarella cheese, and our signature sauce',
      basePrice: 16.99,
      category: 'Classic',
      ingredients: ['Double Pepperoni', 'Mozzarella Cheese', 'Pizza Sauce'],
      isActive: true,
      sortOrder: 2
    },
    {
      name: 'Meat Lovers Deluxe',
      description: 'Pepperoni, sausage, bacon, ham, and ground beef with mozzarella',
      basePrice: 21.99,
      category: 'Meat Lovers',
      ingredients: ['Pepperoni', 'Italian Sausage', 'Bacon', 'Ham', 'Ground Beef', 'Mozzarella'],
      isActive: true,
      sortOrder: 3
    },
    {
      name: 'Veggie Garden',
      description: 'Fresh bell peppers, mushrooms, onions, tomatoes, and black olives',
      basePrice: 17.99,
      category: 'Vegetarian',
      ingredients: ['Bell Peppers', 'Mushrooms', 'Red Onions', 'Fresh Tomatoes', 'Black Olives', 'Mozzarella'],
      isActive: true,
      sortOrder: 4
    },
    {
      name: 'BBQ Chicken Ranch',
      description: 'Grilled chicken, BBQ sauce, red onions, cilantro, and ranch drizzle',
      basePrice: 19.99,
      category: 'Premium',
      ingredients: ['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Cilantro', 'Ranch Sauce', 'Mozzarella'],
      isActive: true,
      sortOrder: 5
    },
    {
      name: 'Hawaiian Paradise',
      description: 'Ham, pineapple, and mozzarella cheese with sweet sauce',
      basePrice: 16.99,
      category: 'Classic',
      ingredients: ['Ham', 'Pineapple', 'Mozzarella Cheese', 'Sweet Pizza Sauce'],
      isActive: true,
      sortOrder: 6
    }
  ];

  for (const pizza of specialtyPizzas) {
    try {
      await prisma.specialtyPizza.create({
        data: {
          ...pizza,
          ingredients: JSON.stringify(pizza.ingredients)
        }
      });
      console.log(`Created specialty pizza: ${pizza.name}`);
    } catch (error) {
      console.log(`Specialty pizza ${pizza.name} already exists or error:`, error.message);
    }
  }

  await prisma.$disconnect();
  console.log('Specialty pizzas seeding completed!');
}

seedSpecialtyPizzas().catch(console.error);
