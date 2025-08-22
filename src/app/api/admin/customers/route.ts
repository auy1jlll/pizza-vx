import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// GET - Get all customers (admin only)
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyAdminToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await prisma.user.findMany({
      where: { 
        role: 'CUSTOMER',
        isActive: true
      },
      include: {
        customerProfile: true,
        customerAddresses: {
          where: {
            isActive: true
          }
        },
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get last 5 orders for overview
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate customer stats
    const customersWithStats = customers.map(customer => {
      const orders = customer.orders || [];
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      return {
        ...customer,
        customerProfile: customer.customerProfile ? {
          ...customer.customerProfile,
          totalOrders,
          totalSpent
        } : null,
        orders: undefined // Remove orders from response to keep it clean
      };
    });

    return NextResponse.json({ customers: customersWithStats });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
