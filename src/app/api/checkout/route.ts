import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo } = await request.json();

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0875; // 8.75% tax (typical Boston rate)
    const deliveryFee = subtotal < 25 ? 3.99 : 0; // Free delivery over $25
    const total = subtotal + tax + deliveryFee;

    // Generate order number
    const orderNumber = `BO${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        orderType: customerInfo.orderType || 'DELIVERY',
        deliveryAddress: customerInfo.address,
        deliveryCity: customerInfo.city,
        deliveryZip: customerInfo.zip,
        deliveryInstructions: customerInfo.instructions,
        subtotal,
        deliveryFee,
        tax,
        total,
        status: 'PENDING',
        notes: `Order placed via online pizza builder - ${items.length} item(s)`
      }
    });

    // Create order items (simplified for specialty pizzas)
    // First, get default size, crust, and sauce for specialty pizzas
    const defaultSize = await prisma.pizzaSize.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    const defaultCrust = await prisma.pizzaCrust.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    const defaultSauce = await prisma.pizzaSauce.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    if (!defaultSize || !defaultCrust || !defaultSauce) {
      return NextResponse.json(
        { error: 'Default pizza components not found. Please contact support.' },
        { status: 500 }
      );
    }

    for (const item of items) {
      if (item.type === 'specialty') {
        // For specialty pizzas, use default components
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            pizzaSizeId: defaultSize.id,
            pizzaCrustId: defaultCrust.id,
            pizzaSauceId: defaultSauce.id,
            quantity: item.quantity,
            basePrice: item.price,
            totalPrice: item.price * item.quantity,
            notes: `Specialty Pizza: ${item.name} (ID: ${item.specialtyPizzaId})`
          }
        });
      }
      // Add handling for custom pizzas here when pizza builder is integrated
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        estimatedTime: '25-35 minutes'
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
