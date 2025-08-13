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
    // Use mock data temporarily
    const data = mockData;

    // Add aggressive caching headers
    const response = NextResponse.json(data);
    
    // Cache in browser and CDN
    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=86400`);
    
    // Add ETag for conditional requests
    const etag = `"${Date.now()}"`;
    response.headers.set('ETag', etag);
    
    return response;
  } catch (error) {
    console.error('Error fetching pizza data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pizza data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
