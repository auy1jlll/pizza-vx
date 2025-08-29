import { NextRequest, NextResponse } from 'next/server';
import { gmailService } from '@/lib/gmail-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Send order confirmation email
export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail } = await request.json();

    if (!orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Order ID and customer email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if Gmail service is configured
    if (!gmailService.isConfigured()) {
      console.error('Gmail service not configured for order confirmation');
      return NextResponse.json(
        { 
          error: 'Email service not configured',
          details: 'Gmail SMTP credentials are missing.'
        },
        { status: 500 }
      );
    }

    // Get order details from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
            customizations: {
              include: {
                customizationOption: true
              }
            }
          }
        },
        user: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the email matches the order's customer
    if (order.user?.email !== customerEmail && order.customerEmail !== customerEmail) {
      return NextResponse.json(
        { error: 'Email does not match order customer' },
        { status: 403 }
      );
    }

    // Prepare order details for email
    const orderDetails = {
      id: order.id,
      orderNumber: order.orderNumber || order.id.slice(-8).toUpperCase(),
      total: order.total.toString(),
      items: order.orderItems.map((item: any) => ({
        name: item.menuItem?.name || 'Custom Item',
        quantity: item.quantity,
        price: item.totalPrice.toString(),
        customizations: item.customizations.map((c: any) => c.customizationOption?.name).filter(Boolean)
      })),
      customerName: order.user?.name || order.customerName || 'Valued Customer',
      orderType: order.orderType,
      status: order.status,
      createdAt: order.createdAt.toLocaleDateString(),
      estimatedDelivery: order.orderType === 'DELIVERY' ? '30-45 minutes' : '15-20 minutes'
    };

    // Send order confirmation email
    console.log(`📧 Sending order confirmation email for order ${order.id} to ${customerEmail}`);
    const emailSent = await gmailService.sendOrderConfirmationEmail(customerEmail, orderDetails);

    if (emailSent) {
      console.log(`✅ Order confirmation email sent successfully to: ${customerEmail}`);
      
      // Optionally log the email in database
      try {
        await prisma.emailLog.create({
          data: {
            to: customerEmail,
            subject: `Order Confirmation #${orderDetails.orderNumber}`,
            templateKey: 'ORDER_CONFIRMATION',
            status: 'SENT',
            sentAt: new Date()
          }
        });
      } catch (logError) {
        console.warn('Failed to log email:', logError);
        // Don't fail the request if logging fails
      }

      return NextResponse.json({
        message: 'Order confirmation email sent successfully!',
        orderId: order.id,
        orderNumber: orderDetails.orderNumber,
        recipient: customerEmail
      });
    } else {
      console.error(`❌ Failed to send order confirmation email to: ${customerEmail}`);
      return NextResponse.json(
        { 
          error: 'Failed to send order confirmation email',
          orderId: order.id,
          recipient: customerEmail
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Order confirmation email error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get email service status for order confirmations
export async function GET() {
  try {
    const serviceInfo = gmailService.getServiceInfo();
    
    return NextResponse.json({
      message: 'Order confirmation email service status',
      serviceInfo,
      features: {
        orderConfirmation: 'Send order confirmation emails to customers',
        emailLogging: 'Track email delivery status',
        templateEngine: 'Professional HTML email templates with branding'
      },
      usage: {
        test: 'POST /api/order-confirmation with { "orderId": "order_id", "customerEmail": "customer@email.com" }',
        integration: 'Called automatically when orders are placed'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get service status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
