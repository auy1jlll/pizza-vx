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

    const { items, customer, delivery, orderType, subtotal, deliveryFee, tax, total, notes } = validation.data;

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

    // Use global settings for validation
    const configTaxRate = (settingsMap.taxRate || 8.25) / 100;
    const configDeliveryFee = settingsMap.deliveryFee || 3.99;
    const minimumOrderAmount = settingsMap.minimumOrder || 15.00;

    // Validate pricing calculations match our backend expectations
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
    const calculatedTax = +(calculatedSubtotal * configTaxRate).toFixed(2);
    const calculatedDeliveryFee = orderType === 'DELIVERY' && calculatedSubtotal < minimumOrderAmount ? configDeliveryFee : 0;
    const calculatedTotal = +(calculatedSubtotal + calculatedTax + calculatedDeliveryFee).toFixed(2);

    // Verify calculations match (within 1 cent for rounding)
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01 || 
        Math.abs(calculatedTax - tax) > 0.01 || 
        Math.abs(calculatedDeliveryFee - deliveryFee) > 0.01 ||
        Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        createApiError('Price calculation mismatch. Please refresh and try again.', 400),
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `BO${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: authenticatedUserId,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        orderType: orderType,
        deliveryAddress: delivery?.address,
        deliveryCity: delivery?.city,
        deliveryZip: delivery?.zip,
        deliveryInstructions: delivery?.instructions,
        subtotal: calculatedSubtotal,
        deliveryFee: calculatedDeliveryFee,
        tax: calculatedTax,
        total: calculatedTotal,
        status: 'PENDING',
        notes: notes || `Order placed via online pizza builder - ${items.length} item(s)${authenticatedUserId ? ' (Authenticated User)' : ' (Guest)'}`
      }
    });

    // Create order items
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          pizzaSizeId: item.size.id,
          pizzaCrustId: item.crust.id,
          pizzaSauceId: item.sauce.id,
          quantity: item.quantity,
          basePrice: item.basePrice,
          totalPrice: item.totalPrice * item.quantity,
          notes: item.notes || 'Custom Pizza'
        }
      });

      // Add toppings for this order item
      if (item.toppings && item.toppings.length > 0) {
        for (const topping of item.toppings) {
          await prisma.orderItemTopping.create({
            data: {
              orderItemId: orderItem.id,
              pizzaToppingId: topping.id,
              quantity: topping.quantity,
              section: topping.section,
              intensity: topping.intensity || 'REGULAR',
              price: topping.price
            }
          });
        }
      }
    }

    return NextResponse.json(
      createApiResponse({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        estimatedTime: '25-35 minutes'
      }, 'Order placed successfully!')
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      createApiError('Failed to process order. Please try again.', 500),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
