import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { CreateOrderSchema, validateSchema, createApiResponse, createApiError } from '@/lib/schemas';
import { OrderService } from '@/services/order';
import { orderLimiter } from '@/lib/simple-rate-limit';
import { gmailService } from '@/lib/gmail-service';


// Add timeout protection to prevent 504 Gateway Timeout
const CHECKOUT_TIMEOUT = 25000; // 25 seconds (less than gateway timeout)

const createOrderWithTimeout = async (orderData, orderServiceInstance) => {
  return Promise.race([
    orderServiceInstance.createOrder(orderData),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Order creation timeout - please try again')), CHECKOUT_TIMEOUT)
    )
  ]);
};

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
    const order = await createOrderWithTimeout({
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
    }, orderService);

    console.log('Order creation result:', { order, orderExists: !!order, orderNumber: order?.orderNumber });

    // Check if order creation failed
    if (!order) {
      console.error('Order creation returned null/undefined');
      return NextResponse.json(
        createApiError('Failed to create order. Please try again.', 500),
        { status: 500 }
      );
    }

    // Send order confirmation email (non-blocking)
    process.nextTick(async () => {
      try {
        const emailNotificationsEnabled = await prisma.appSetting.findUnique({
          where: { key: 'emailNotifications' }
        });

        if (emailNotificationsEnabled?.value === 'true') {
          console.log('📧 Sending order confirmation email...');

          // Check if Gmail service is available
          if (!gmailService.isConfigured()) {
            console.warn('Gmail service not configured, skipping email');
            return;
          }

          // Get order details with items for email
          const orderWithDetails = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
              orderItems: {
                include: {
                  pizzaSize: true,
                  pizzaCrust: true,
                  pizzaSauce: true,
                  toppings: {
                    include: {
                      pizzaTopping: true
                    }
                  },
                  menuItem: true,
                  customizations: {
                    include: {
                      customizationOption: {
                        include: {
                          group: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (orderWithDetails) {
            const emailSent = await gmailService.sendOrderConfirmationEmail(orderWithDetails);
            if (emailSent) {
              console.log('✅ Order confirmation email sent successfully');
            } else {
              console.warn('⚠️ Order confirmation email failed to send');
            }
          }
        } else {
          console.log('📧 Email notifications disabled, skipping order confirmation email');
        }
      } catch (emailError) {
        console.error('❌ Failed to send order confirmation email:', emailError);
        // Email failure should not affect the order completion
      }
    });

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
    
    // Specific error handling for different error types
    let errorMessage = 'Failed to process order. Please try again.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid menu selection. Please refresh the page and try again.';
        statusCode = 400;
      } else if (error.message.includes('Invalid pizza size ID') ||
                 error.message.includes('Invalid pizza crust ID') ||
                 error.message.includes('Invalid pizza sauce ID')) {
        errorMessage = 'Invalid pizza configuration. Please rebuild your pizza and try again.';
        statusCode = 400;
      } else if (error.message.includes('Database connection')) {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
        statusCode = 503;
      }
    }
    
    const errorResponse = createApiError(errorMessage, statusCode);
    console.log('Sending error response:', JSON.stringify(errorResponse, null, 2));
    
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
