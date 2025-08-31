import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminToken(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause
    const whereClause: any = {
      status: {
        in: status 
          ? [status] 
          : ['pending', 'confirmed', 'preparing', 'ready']
      }
    };

    // Get orders with all related data
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            // Pizza-specific fields
            pizzaSize: {
              select: {
                name: true,
                diameter: true
              }
            },
            pizzaCrust: {
              select: {
                name: true
              }
            },
            pizzaSauce: {
              select: {
                name: true
              }
            },
            toppings: {
              include: {
                pizzaTopping: {
                  select: {
                    name: true
                  }
                }
              }
            },
            // Menu item fields
            menuItem: {
              select: {
                id: true,
                name: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            },
            // Menu item customizations
            customizations: {
              include: {
                customizationOption: {
                  include: {
                    group: {
                      select: {
                        id: true,
                        name: true
                      }
                    }
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

    return NextResponse.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Kitchen orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}