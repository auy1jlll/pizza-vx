import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cache for 5 minutes in development, 1 hour in production
const CACHE_DURATION = process.env.NODE_ENV === 'production' ? 3600 : 300;

// Temporary mock data until database schema is updated
const mockData = {
  sizes: [
    { id: '1', name: 'Small', diameter: '10"', basePrice: 12.99, isActive: true, sortOrder: 1 },
    { id: '2', name: 'Medium', diameter: '12"', basePrice: 15.99, isActive: true, sortOrder: 2 },
    { id: '3', name: 'Large', diameter: '14"', basePrice: 18.99, isActive: true, sortOrder: 3 },
    { id: '4', name: 'Extra Large', diameter: '16"', basePrice: 21.99, isActive: true, sortOrder: 4 }
  ],
  crusts: [
    { id: '1', name: 'Thin Crust', description: 'Crispy and light', priceModifier: 0, isActive: true, sortOrder: 1 },
    { id: '2', name: 'Regular Crust', description: 'Classic pizza crust', priceModifier: 0, isActive: true, sortOrder: 2 },
    { id: '3', name: 'Thick Crust', description: 'Extra thick and chewy', priceModifier: 2.00, isActive: true, sortOrder: 3 },
    { id: '4', name: 'Stuffed Crust', description: 'Cheese-filled crust', priceModifier: 3.00, isActive: true, sortOrder: 4 }
  ],
  sauces: [
    { id: '1', name: 'Marinara', description: 'Classic tomato sauce', color: '#e53e3e', spiceLevel: 0, priceModifier: 0, isActive: true, sortOrder: 1 },
    { id: '2', name: 'White Sauce', description: 'Creamy garlic base', color: '#f7fafc', spiceLevel: 0, priceModifier: 1.00, isActive: true, sortOrder: 2 },
    { id: '3', name: 'BBQ Sauce', description: 'Sweet and tangy', color: '#744210', spiceLevel: 1, priceModifier: 1.50, isActive: true, sortOrder: 3 },
    { id: '4', name: 'Spicy Marinara', description: 'Tomato sauce with heat', color: '#c53030', spiceLevel: 3, priceModifier: 0.50, isActive: true, sortOrder: 4 }
  ],
  toppings: [
    // Meats
    { id: '1', name: 'Pepperoni', category: 'MEAT', price: 1.50, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 1 },
    { id: '2', name: 'Italian Sausage', category: 'MEAT', price: 1.75, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 2 },
    { id: '3', name: 'Ham', category: 'MEAT', price: 1.50, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 3 },
    { id: '4', name: 'Bacon', category: 'MEAT', price: 2.00, isActive: true, isVegetarian: false, isVegan: false, sortOrder: 4 },
    
    // Vegetables
    { id: '5', name: 'Mushrooms', category: 'VEGETABLE', price: 1.00, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 5 },
    { id: '6', name: 'Bell Peppers', category: 'VEGETABLE', price: 1.00, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 6 },
    { id: '7', name: 'Red Onions', category: 'VEGETABLE', price: 0.75, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 7 },
    { id: '8', name: 'Black Olives', category: 'VEGETABLE', price: 1.25, isActive: true, isVegetarian: true, isVegan: true, sortOrder: 8 },
    
    // Cheese
    { id: '9', name: 'Extra Cheese', category: 'CHEESE', price: 2.00, isActive: true, isVegetarian: true, isVegan: false, sortOrder: 9 },
    { id: '10', name: 'Parmesan', category: 'CHEESE', price: 1.50, isActive: true, isVegetarian: true, isVegan: false, sortOrder: 10 },
    { id: '11', name: 'Feta Cheese', category: 'CHEESE', price: 1.75, isActive: true, isVegetarian: true, isVegan: false, sortOrder: 11 }
  ]
};

export async function GET() {
  try {
    console.log('Fetching pizza data from database...');
    
    // Fetch actual data from database
    const [sizes, crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaSize.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.pizzaCrust.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.pizzaSauce.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.pizzaTopping.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      })
    ]);

    // Transform data to match expected format
    const data = {
      timestamp: Date.now(), // Force cache bust
      sizes: sizes.map(size => ({
        id: size.id,
        name: size.name,
        diameter: size.diameter,
        basePrice: size.basePrice,
        isActive: size.isActive,
        sortOrder: size.sortOrder
      })),
      crusts: crusts.map(crust => ({
        id: crust.id,
        name: crust.name,
        description: crust.description,
        priceModifier: crust.priceModifier,
        isActive: crust.isActive,
        sortOrder: crust.sortOrder
      })),
      sauces: sauces.map(sauce => ({
        id: sauce.id,
        name: sauce.name,
        description: sauce.description,
        color: sauce.color,
        spiceLevel: sauce.spiceLevel,
        priceModifier: sauce.priceModifier,
        isActive: sauce.isActive,
        sortOrder: sauce.sortOrder
      })),
      toppings: toppings.map(topping => ({
        id: topping.id,
        name: topping.name,
        category: topping.category,
        price: topping.price,
        isActive: topping.isActive,
        isVegetarian: topping.isVegetarian,
        isVegan: topping.isVegan || false, // Default to false if not set
        sortOrder: topping.sortOrder
      }))
    };

    console.log('Database data fetched:', {
      sizes: data.sizes.length,
      crusts: data.crusts.length,
      sauces: data.sauces.length,
      toppings: data.toppings.length
    });

    // Add cache headers - disabled for debugging
    const response = NextResponse.json(data);
    
    // Disable caching to get fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching pizza data:', error);
    
    // Fallback to mock data if database fails
    console.log('Falling back to mock data...');
    const response = NextResponse.json(mockData);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } finally {
    await prisma.$disconnect();
  }
}
