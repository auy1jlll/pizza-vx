import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for public store order displays - no authentication required
    console.log('📋 Store orders display API called');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause - get recent orders for display
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    // Get orders with customer and item details
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            // Pizza fields
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
                description: true,
                price: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            },
            // Customizations
            customizations: {
              include: {
                customizationOption: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
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
        createdAt: 'desc'
      },
      take: limit
    });

    console.log(`📋 Store orders: Found ${orders.length} orders`);

    // Transform orders to match expected format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || order.id,
      status: order.status,
      orderType: order.orderType || 'pickup',
      total: parseFloat(order.total?.toString() || '0'),
      subtotal: parseFloat(order.subtotal?.toString() || '0'),
      tax: parseFloat(order.tax?.toString() || '0'),
      tip: parseFloat(order.tip?.toString() || '0'),
      deliveryFee: parseFloat(order.deliveryFee?.toString() || '0'),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      scheduledTime: order.scheduledTime,
      notes: order.notes || '',
      
      // Customer information
      customer: order.user ? {
        id: order.user.id,
        name: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
        firstName: order.user.firstName || '',
        lastName: order.user.lastName || '',
        email: order.user.email || '',
        phone: order.user.phone || ''
      } : null,
      
      // Delivery information
      deliveryAddress: order.deliveryAddress || '',
      deliveryCity: order.deliveryCity || '',
      deliveryState: order.deliveryState || '',
      deliveryZip: order.deliveryZip || '',
      deliveryInstructions: order.deliveryInstructions || '',
      
      // Order items
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price?.toString() || '0'),
        specialInstructions: item.specialInstructions || '',
        
        // Pizza information
        pizzaSize: item.pizzaSize?.name || null,
        pizzaCrust: item.pizzaCrust?.name || null,
        pizzaSauce: item.pizzaSauce?.name || null,
        toppings: item.toppings?.map(t => ({
          name: t.pizzaTopping?.name || '',
          quantity: t.quantity || 1
        })) || [],
        
        // Menu item information
        menuItem: item.menuItem ? {
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description || '',
          price: parseFloat(item.menuItem.price?.toString() || '0'),
          category: item.menuItem.category?.name || ''
        } : null,
        
        // Customizations
        customizations: item.customizations?.map(c => ({
          id: c.id,
          quantity: c.quantity || 1,
          price: parseFloat(c.price?.toString() || '0'),
          option: {
            id: c.customizationOption?.id || '',
            name: c.customizationOption?.name || '',
            price: parseFloat(c.customizationOption?.price?.toString() || '0'),
            group: {
              id: c.customizationOption?.group?.id || '',
              name: c.customizationOption?.group?.name || ''
            }
          }
        })) || []
      }))
    }));

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      total: transformedOrders.length
    });

  } catch (error) {
    console.error('❌ Store orders display API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch store orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
