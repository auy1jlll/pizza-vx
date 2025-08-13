import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/cart - Add item to cart or create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone,
      sizeId, 
      crustId, 
      sauceId, 
      sauceIntensity = 'REGULAR',
      crustCookingLevel = 'REGULAR',
      toppings = [],
      notes 
    } = body;

    // Validation
    if (!customerName || !customerEmail || !sizeId || !crustId || !sauceId) {
      return NextResponse.json({ 
        error: 'Missing required fields: customerName, customerEmail, sizeId, crustId, sauceId' 
      }, { status: 400 });
    }

    // Calculate pricing
    const [size, crust, sauce, toppingList] = await Promise.all([
      prisma.pizzaSize.findUnique({ where: { id: sizeId } }),
      prisma.pizzaCrust.findUnique({ where: { id: crustId } }),
      prisma.pizzaSauce.findUnique({ where: { id: sauceId } }),
      toppings.length > 0 ? prisma.pizzaTopping.findMany({
        where: { id: { in: toppings.map((t: any) => t.toppingId) } }
      }) : []
    ]);

    if (!size || !crust || !sauce) {
      return NextResponse.json({ error: 'Invalid pizza components' }, { status: 400 });
    }

    // Calculate total price
    let totalPrice = crust.priceModifier + sauce.priceModifier;
    
    const toppingPrices = toppingList.reduce((sum, topping) => {
      const orderTopping = toppings.find((t: any) => t.toppingId === topping.id);
      const multiplier = orderTopping?.intensity === 'LIGHT' ? 0.75 : 
                        orderTopping?.intensity === 'EXTRA' ? 1.5 : 1;
      return sum + (topping.price * multiplier);
    }, 0);

    totalPrice += toppingPrices;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        totalAmount: totalPrice,
        status: 'PENDING',
        orderItems: {
          create: {
            quantity: 1,
            unitPrice: totalPrice,
            pizzaSize: { connect: { id: sizeId } },
            pizzaCrust: { connect: { id: crustId } },
            pizzaSauce: { connect: { id: sauceId } },
            sauceIntensity,
            crustCookingLevel,
            notes,
            orderItemToppings: {
              create: toppings.map((topping: any) => ({
                pizzaTopping: { connect: { id: topping.toppingId } },
                section: topping.section || 'WHOLE',
                intensity: topping.intensity || 'REGULAR'
              }))
            }
          }
        }
      },
      include: {
        orderItems: {
          include: {
            pizzaSize: true,
            pizzaCrust: true,
            pizzaSauce: true,
            orderItemToppings: {
              include: {
                pizzaTopping: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order,
      orderId: order.id,
      totalPrice: totalPrice.toFixed(2)
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/cart?orderId=xxx - Get order details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            pizzaSize: true,
            pizzaCrust: true,
            pizzaSauce: true,
            orderItemToppings: {
              include: {
                pizzaTopping: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
