import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { cacheService, CACHE_KEYS } from '@/lib/cache-service';
import prisma from '@/lib/prisma';

// GET /api/admin/toppings - Fetch all toppings (with caching)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Try to get from cache first
    const cachedToppings = cacheService.get('toppings', 'all-admin');
    if (cachedToppings) {
      return NextResponse.json(cachedToppings);
    }
    
    // If not in cache, fetch from database
    const toppings = await prisma.pizzaTopping.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Cache the result for 15 minutes
    cacheService.set('toppings', 'all-admin', toppings);
    
    return NextResponse.json(toppings);
  } catch (error) {
    console.error('Error fetching toppings:', error);
    return NextResponse.json({ error: 'Failed to fetch toppings' }, { status: 500 });
  }
}

// POST /api/admin/toppings - Create new topping
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, category, price, isVegetarian, isVegan, isGlutenFree } = await request.json();
    
    // Validate required fields
    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const topping = await prisma.pizzaTopping.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        isVegetarian: Boolean(isVegetarian),
        isVegan: Boolean(isVegan),
        isGlutenFree: Boolean(isGlutenFree)
      }
    });
    
    // Invalidate toppings cache
    cacheService.invalidate('toppings');
    
    return NextResponse.json(topping, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A topping with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    console.error('Error creating topping:', error);
    return NextResponse.json({ error: 'Failed to create topping' }, { status: 500 });
  }
}

// PUT /api/admin/toppings - Update topping
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id, name, category, price, isVegetarian, isVegan, isGlutenFree } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Topping ID is required' }, { status: 400 });
    }

    const topping = await prisma.pizzaTopping.update({
      where: { id },
      data: { 
        name, 
        category, 
        price: parseFloat(price),
        isVegetarian: Boolean(isVegetarian),
        isVegan: Boolean(isVegan),
        isGlutenFree: Boolean(isGlutenFree)
      }
    });
    
    return NextResponse.json(topping);
  } catch (error) {
    console.error('Error updating topping:', error);
    return NextResponse.json({ error: 'Failed to update topping' }, { status: 500 });
  }
}

// DELETE /api/admin/toppings - Delete topping
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Topping ID is required' }, { status: 400 });
    }

    await prisma.pizzaTopping.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Topping deleted successfully' });
  } catch (error) {
    console.error('Error deleting topping:', error);
    return NextResponse.json({ error: 'Failed to delete topping' }, { status: 500 });
  }
}
