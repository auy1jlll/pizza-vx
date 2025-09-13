import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyKitchenStaffToken } from '@/lib/auth';
import { configurableAdminLimiter } from '@/lib/configurable-rate-limit';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = await configurableAdminLimiter.check('admin-kitchen-orders-get', ip);
    if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    
    // Check kitchen staff authentication (ADMIN or EMPLOYEE)
    const user = await verifyKitchenStaffToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Kitchen staff access required' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
        }
      },
      include: {
        orderItems: {
          include: {
            // Pizza-related includes (existing)
            pizzaSize: true,
            pizzaCrust: true,
            pizzaSauce: true,
            toppings: {
              include: {
                pizzaTopping: true
              }
            },
            // Menu item includes (NEW - this was missing!)
            menuItem: {
              include: {
                category: true
              }
            },
            // Menu item customizations includes (NEW - fixed field name!)
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
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Transform the data to match frontend expectations
    const transformedOrders = orders.map(order => ({
      ...order,
      status: order.status.toLowerCase(),
      items: order.orderItems.map(item => ({
        ...item,
        toppings: item.toppings
      }))
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching kitchen orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
