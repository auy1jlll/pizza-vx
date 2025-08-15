import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { CreateOrderSchema, validateSchema, createApiResponse, createApiError } from '@/lib/schemas';
import { OrderService } from '@/services';
import { orderRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting for order creation with error handling
  try {
    const rateLimitResult = await new Promise((resolve) => {
      orderRateLimit(request as any, {
        status: (code: number) => ({
          json: (data: any) => resolve({ error: true, status: code, data })
        })
      } as any, () => resolve({ error: false }));
    });

    if ((rateLimitResult as any).error) {
      return NextResponse.json(
        (rateLimitResult as any).data,
        { status: (rateLimitResult as any).status }
      );
    }
  } catch (rateLimitError) {
    console.warn('Rate limiting error:', rateLimitError);
    // Continue without rate limiting if there's an error
  }

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

    const { 
      items, 
      customer, 
      delivery, 
      orderType, 
      paymentMethod,
      subtotal, 
      deliveryFee, 
      tipAmount,
      tipPercentage,
      customTipAmount,
      tax, 
      total, 
      notes 
    } = validation.data;

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

    // Use OrderService
    const orderService = new OrderService();

    // Create order using service
    const order = await orderService.createOrder({
      items,
      customer,
      delivery: delivery || undefined,
      orderType,
      paymentMethod,
      subtotal,
      deliveryFee,
      tipAmount: tipAmount || undefined,
      tipPercentage: tipPercentage || undefined,
      customTipAmount: customTipAmount || undefined,
      tax,
      total,
      notes,
      userId: authenticatedUserId
    });

    console.log('Order creation result:', { order, orderExists: !!order, orderNumber: order?.orderNumber });

    // Check if order creation failed
    if (!order) {
      console.error('Order creation returned null/undefined');
      return NextResponse.json(
        createApiError('Failed to create order. Please try again.', 500),
        { status: 500 }
      );
    }

    // Get preparation time setting for estimated delivery  
    const prepTimeResult = await prisma.appSetting.findUnique({
      where: { key: 'preparationTime' }
    });
    const prepTime = parseInt(prepTimeResult?.value || '25');
    const estimatedTime = orderType === 'DELIVERY' 
      ? `${prepTime + 10}-${prepTime + 20} minutes` 
      : `${prepTime}-${prepTime + 10} minutes`;

    return NextResponse.json(
      createApiResponse({
        id: order?.id,
        orderNumber: order?.orderNumber,
        total: order?.total,
        estimatedTime
      }, 'Order placed successfully!')
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      createApiError('Failed to process order. Please try again.', 500),
      { status: 500 }
    );
  }
}
