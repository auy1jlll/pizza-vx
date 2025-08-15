import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { adminRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Apply rate limiting for admin endpoints
  const rateLimitResult = await new Promise((resolve) => {
    adminRateLimit(request as any, {
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

  try {
    // Require admin authentication
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
