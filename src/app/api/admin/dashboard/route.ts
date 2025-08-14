import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching dashboard stats...');

    // Get current date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total revenue (all time)
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        status: 'COMPLETED'
      }
    });

    // Today's orders
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfToday
        }
      }
    });

    // Active orders (pending, confirmed, preparing, ready)
    const activeOrders = await prisma.order.count({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
        }
      }
    });

    // Average order value
    const avgOrderResult = await prisma.order.aggregate({
      _avg: {
        total: true
      },
      where: {
        status: 'COMPLETED'
      }
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        orderItems: {
          include: {
            pizzaSize: true,
            toppings: {
              include: {
                pizzaTopping: true
              }
            }
          }
        }
      }
    });

    // Order status counts
    const orderStatusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Today's revenue
    const todayRevenueResult = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: startOfToday
        },
        status: 'COMPLETED'
      }
    });

    // This week's revenue
    const weekRevenueResult = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: startOfWeek
        },
        status: 'COMPLETED'
      }
    });

    // Component counts
    const componentCounts = await Promise.all([
      prisma.pizzaSize.count({ where: { isActive: true } }),
      prisma.pizzaCrust.count({ where: { isActive: true } }),
      prisma.pizzaSauce.count({ where: { isActive: true } }),
      prisma.pizzaTopping.count({ where: { isActive: true } })
    ]);

    const stats = {
      totalRevenue: totalRevenueResult._sum?.total || 0,
      todayOrders: todayOrders,
      activeOrders: activeOrders,
      averageOrderValue: avgOrderResult._avg?.total || 0,
      todayRevenue: todayRevenueResult._sum?.total || 0,
      weekRevenue: weekRevenueResult._sum?.total || 0,
      recentOrders: recentOrders,
      orderStatusCounts: orderStatusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      }, {} as Record<string, number>),
      componentCounts: {
        sizes: componentCounts[0],
        crusts: componentCounts[1],
        sauces: componentCounts[2],
        toppings: componentCounts[3]
      }
    };

    console.log('Dashboard stats fetched successfully');

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
