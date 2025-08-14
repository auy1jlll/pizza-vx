import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { OrderItem, OrderItemTopping, PizzaSize, PizzaCrust, PizzaSauce, PizzaTopping } from '@prisma/client';

type OrderWithItems = {
  id: string;
  orderNumber: string;
  customerEmail: string | null;
  status: string;
  orderType: string;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryZip: string | null;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  scheduledTime: Date | null;
  orderItems: (OrderItem & {
    pizzaSize: PizzaSize;
    pizzaCrust: PizzaCrust;
    pizzaSauce: PizzaSauce;
    toppings: (OrderItemTopping & {
      pizzaTopping: PizzaTopping;
    })[];
  })[];
};

// GET /api/customer/orders?email=customer@example.com - Get customer order history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause: any = {};

    // Check if user is authenticated
    const token = request.cookies.get('user-token')?.value;
    
    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'fallback-secret'
        ) as any;

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { 
            id: decoded.userId,
            role: 'CUSTOMER'
          }
        });

        if (user) {
          // If authenticated, use user's email or provided email
          whereClause.customerEmail = email || user.email;
        } else if (email) {
          // If token invalid but email provided, use email
          whereClause.customerEmail = email;
        } else {
          return NextResponse.json({ 
            error: 'Email parameter is required' 
          }, { status: 400 });
        }
      } catch (tokenError) {
        // Token invalid, fall back to email parameter
        if (!email) {
          return NextResponse.json({ 
            error: 'Email parameter is required' 
          }, { status: 400 });
        }
        whereClause.customerEmail = email;
      }
    } else {
      // No token, require email parameter
      if (!email) {
        return NextResponse.json({ 
          error: 'Email parameter is required' 
        }, { status: 400 });
      }
      whereClause.customerEmail = email;
    }

    // Fetch customer orders with pagination
    const orders = await prisma.order.findMany({
      where: whereClause,
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
        createdAt: 'desc' // Most recent orders first
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where: whereClause
    });

    // Transform order data for better frontend usage
    const transformedOrders = orders.map((order: OrderWithItems) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      orderType: order.orderType,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryZip: order.deliveryZip,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      scheduledTime: order.scheduledTime,
      itemCount: order.orderItems.length,
      items: order.orderItems.map((item: OrderWithItems['orderItems'][0]) => ({
        id: item.id,
        quantity: item.quantity,
        basePrice: item.basePrice,
        totalPrice: item.totalPrice,
        notes: item.notes,
        size: {
          id: item.pizzaSize.id,
          name: item.pizzaSize.name,
          diameter: item.pizzaSize.diameter
        },
        crust: {
          id: item.pizzaCrust.id,
          name: item.pizzaCrust.name,
          description: item.pizzaCrust.description
        },
        sauce: {
          id: item.pizzaSauce.id,
          name: item.pizzaSauce.name,
          description: item.pizzaSauce.description
        },
        toppings: item.toppings.map((topping: OrderWithItems['orderItems'][0]['toppings'][0]) => ({
          id: topping.pizzaTopping.id,
          name: topping.pizzaTopping.name,
          section: topping.section,
          intensity: topping.intensity,
          price: topping.price
        }))
      }))
    }));

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        total: totalOrders,
        limit,
        offset,
        hasMore: offset + limit < totalOrders
      }
    });

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
