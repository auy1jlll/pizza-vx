import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { CreateOrderSchema, validateSchema, createApiResponse, createApiError } from '@/lib/schemas';
import { OrderService } from '@/services';
import { orderLimiter } from '@/lib/simple-rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Lightweight rate limiting (in-memory)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limitResult = orderLimiter.check('checkout', ip || undefined);
    if (!limitResult.allowed) {
      return NextResponse.json(
        createApiError('Too many orders from this IP. Please wait before trying again.', 429),
        { status: 429, headers: { 'Retry-After': Math.ceil((limitResult.resetAt - Date.now())/1000).toString() } }
      );
    }
    const requestData = await request.json();

    // Debug logging to see what data is being sent
    console.log('🛒 Checkout request received:');
    console.log('- Order type:', requestData.orderType);
    console.log('- Customer:', requestData.customer);
    console.log('- Items count:', requestData.items?.length);
    console.log('- Full request data:', JSON.stringify(requestData, null, 2));

    // Validate request data with Zod schema
    console.log('🔍 Starting validation...');
    const validation = validateSchema(CreateOrderSchema, requestData);
    console.log('🔍 Validation result:', validation.success ? 'SUCCESS' : 'FAILED');
    if (!validation.success) {
      console.log('❌ Validation failed:', validation.error);
      console.log('❌ Request data that failed validation:', JSON.stringify(requestData, null, 2));
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
      scheduleType,
      scheduledDate,
      scheduledTime,
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
      // Check for user-token (customer) first, then fallback to other tokens
      let token = request.cookies.get('user-token')?.value;
      
      // Fallback to other token names for compatibility
      if (!token) {
        token = request.cookies.get('token')?.value;
      }
      
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
      scheduleType: scheduleType || 'NOW',
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
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
        message: `Your order will be ready in approximately ${estimatedTime}.`,
        orderNumber: order.orderNumber,
        estimatedTime,
        orderId: order.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    
    const errorResponse = createApiError(
      error instanceof Error ? error.message : 'Failed to process order. Please try again.', 
      500
    );
    console.log('Sending error response:', JSON.stringify(errorResponse, null, 2));
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
