import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyManagementToken } from '@/lib/auth';
import { adminLimiter } from '@/lib/simple-rate-limit';

export async function GET(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = adminLimiter.check('admin-orders-get', ip);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
  const user = await verifyManagementToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.log('Fetching orders...');

    const orders = await prisma.order.findMany({
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${orders.length} orders`);

    return NextResponse.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = adminLimiter.check('admin-orders-patch', ip);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
  const user = await verifyManagementToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    console.log(`Updating order ${orderId} to status: ${status}`);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
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
            }
          }
        }
      }
    });

    console.log(`Order ${orderId} updated successfully`);

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = adminLimiter.check('admin-orders-delete', ip);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
  const user = await verifyManagementToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const clearAll = searchParams.get('clearAll');

    if (clearAll === 'true') {
      // Clear all orders
      console.log('Clearing all orders...');
      
      // First delete all order item toppings
      await prisma.orderItemTopping.deleteMany();
      
      // Then delete all order items
      await prisma.orderItem.deleteMany();
      
      // Finally delete all orders
      const result = await prisma.order.deleteMany();
      
      console.log(`Cleared ${result.count} orders`);
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${result.count} orders`
      });
    } else if (orderId) {
      // Delete specific order
      console.log(`Deleting order ${orderId}...`);
      
      // First delete order item toppings
      await prisma.orderItemTopping.deleteMany({
        where: {
          orderItem: {
            orderId: orderId
          }
        }
      });
      
      // Then delete order items
      await prisma.orderItem.deleteMany({
        where: { orderId: orderId }
      });
      
      // Finally delete the order
      await prisma.order.delete({
        where: { id: orderId }
      });
      
      console.log(`Order ${orderId} deleted successfully`);
      
      return NextResponse.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Order ID or clearAll parameter is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error deleting order(s):', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete order(s)',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
