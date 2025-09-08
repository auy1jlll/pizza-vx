import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for public kitchen displays - no authentication required
    console.log('🍕 Kitchen display API called');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause for active kitchen orders
    const whereClause: any = {
      status: {
        in: status 
          ? [status.toUpperCase()] 
          : ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
      }
    };

    // Get orders with all related data needed for kitchen display
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        },
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
                description: true,
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

    console.log(`🍕 Kitchen display: Found ${orders.length} orders`);

    // Transform orders to match the expected format for kitchen display
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || order.id,
      customerName: order.user?.name || 'Walk-in Customer',
      customerEmail: order.user?.email || '',
      customerPhone: order.user?.phone || '',
      status: order.status.toLowerCase(),
      orderType: order.orderType || 'pickup',
      deliveryAddress: order.deliveryAddress || '',
      deliveryCity: order.deliveryCity || '',
      deliveryZip: order.deliveryZip || '',
      deliveryInstructions: order.deliveryInstructions || '',
      scheduledTime: order.scheduledTime || '',
      total: parseFloat(order.total?.toString() || '0'),
      notes: order.notes || '',
      createdAt: order.createdAt.toISOString(),
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        totalPrice: parseFloat(item.price?.toString() || '0'),
        notes: item.specialInstructions || '',
        
        // Pizza fields
        pizzaSize: item.pizzaSize ? { name: item.pizzaSize.name, diameter: item.pizzaSize.diameter } : null,
        pizzaCrust: item.pizzaCrust ? { name: item.pizzaCrust.name } : null,
        pizzaSauce: item.pizzaSauce ? { name: item.pizzaSauce.name } : null,
        toppings: item.toppings?.map(t => ({
          pizzaTopping: { name: t.pizzaTopping?.name || '' },
          quantity: t.quantity || 1,
          section: t.section || undefined,
          intensity: t.intensity || undefined
        })) || [],
        
        // Menu item fields  
        menuItem: item.menuItem ? {
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description || '',
          category: {
            id: item.menuItem.category?.id || '',
            name: item.menuItem.category?.name || '',
            slug: item.menuItem.category?.slug || ''
          }
        } : null,
        
        // Customizations
        customizations: item.customizations?.map(c => ({
          id: c.id || '',
          quantity: c.quantity || 1,
          price: parseFloat(c.price?.toString() || '0'),
          customizationOption: {
            id: c.customizationOption?.id || '',
            name: c.customizationOption?.name || '',
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
      data: transformedOrders
    });

  } catch (error) {
    console.error('❌ Kitchen display API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch kitchen orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
