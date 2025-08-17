import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { CreateOrderSchema, validateSchema, createApiResponse, createApiError } from '@/lib/schemas';

import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    // Validate request data with Zod schema
    const validation = validateSchema(CreateOrderSchema, requestData);
    if (!validation.success) {
      return NextResponse.json(
        createApiError(`Validation error: ${validation.error}`, 400),
        { status: 400 }
      );
    }

  const { items, customer, delivery, orderType, notes } = validation.data;

    // Check if user is authenticated
    let authenticatedUserId = null;
    try {
      const token = request.cookies.get('token')?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        authenticatedUserId = decoded.userId;
      }
    } catch (error) {
      // Not authenticated, continue as guest checkout
      console.log('Guest checkout - no valid token');
    }

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

  if (!customer || !customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Get global settings for pricing calculations
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['taxRate', 'deliveryFee', 'minimumOrder']
        }
      }
    });

    // Convert settings to object
    const settingsMap = settings.reduce((acc, setting) => {
      let value: any = setting.value;
      if (setting.type === 'NUMBER') {
        value = parseFloat(setting.value);
      }
      acc[setting.key] = value;
      return acc;
    }, {} as Record<string, any>);

    // Use global settings or fallback to defaults
    const taxRate = (settingsMap.taxRate || 8.25) / 100; // Convert percentage to decimal
    const deliveryFeeAmount = settingsMap.deliveryFee || 3.99;
    const minimumOrderAmount = settingsMap.minimumOrder || 15.00;

    // Calculate totals using global settings
  const subtotal = items.reduce((t: number, item: any) => t + (item.price * item.quantity), 0);
  const tax = +(subtotal * taxRate).toFixed(2); // Apply global tax rate
  const deliveryFee = subtotal < minimumOrderAmount ? deliveryFeeAmount : 0; // Use global minimum order and delivery fee
  const total = +(subtotal + tax + deliveryFee).toFixed(2);

    // Generate order number
    const orderNumber = `BO${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: authenticatedUserId, // Associate with user if authenticated
  customerName: customer.name,
  customerEmail: customer.email,
  customerPhone: customer.phone,
  orderType: orderType || 'DELIVERY',
  deliveryAddress: delivery?.address || null,
  deliveryCity: delivery?.city || null,
  deliveryZip: delivery?.zip || null,
  deliveryInstructions: delivery?.instructions || null,
        subtotal,
        deliveryFee,
        tax,
        total,
        status: 'PENDING',
        notes: `Order placed via online pizza builder - ${items.length} item(s)${authenticatedUserId ? ' (Authenticated User)' : ' (Guest)'}`
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

    // Create order items
    for (const item of items) {
      // Conform to current CartItem schema: item.size, item.crust, item.sauce, item.toppings
      if (!item.size?.id || !item.crust?.id || !item.sauce?.id) {
        return NextResponse.json({ error: 'Missing size/crust/sauce in cart item' }, { status: 400 });
      }

      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          pizzaSizeId: item.size.id,
            pizzaCrustId: item.crust.id,
            pizzaSauceId: item.sauce.id,
            quantity: item.quantity || 1,
            basePrice: item.basePrice,
            totalPrice: item.totalPrice,
            notes: item.notes || 'Custom Pizza'
        }
      });

      if (item.toppings && item.toppings.length > 0) {
        for (const topping of item.toppings) {
          await prisma.orderItemTopping.create({
            data: {
              orderItemId: orderItem.id,
              pizzaToppingId: topping.id,
              quantity: 1,
              section: topping.section,
              intensity: topping.intensity || 'REGULAR',
              price: topping.price
            }
          });
        }
      }
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
    // Do not disconnect shared prisma
  }
}
