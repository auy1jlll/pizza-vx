import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ToppingInput {
  toppingId: string;
  section?: string;
  intensity?: 'LIGHT' | 'REGULAR' | 'EXTRA';
}

// POST /api/cart - Add item to cart or create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone,
      orderType = 'PICKUP',
      deliveryAddress,
      deliveryCity, 
      deliveryZip,
      items = [] // Array of cart items
    } = body;

    // Validation
    if (!customerName || !customerEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: customerName, customerEmail' 
      }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ 
        error: 'No items in cart' 
      }, { status: 400 });
    }

    // Process each cart item and calculate totals
    let orderTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const { sizeId, crustId, sauceId, sauceIntensity = 'REGULAR', crustCookingLevel = 'REGULAR', toppings = [], notes } = item;
      
      if (!sizeId || !crustId || !sauceId) {
        return NextResponse.json({ 
          error: 'Missing required fields in cart item: sizeId, crustId, sauceId' 
        }, { status: 400 });
      }

      // Calculate pricing for this item
      const [size, crust, sauce, toppingList] = await Promise.all([
        prisma.pizzaSize.findUnique({ where: { id: sizeId } }),
        prisma.pizzaCrust.findUnique({ where: { id: crustId } }),
        prisma.pizzaSauce.findUnique({ where: { id: sauceId } }),
        toppings.length > 0 ? prisma.pizzaTopping.findMany({
          where: { id: { in: toppings.map((t: ToppingInput) => t.toppingId) } }
        }) : []
      ]);

      if (!size || !crust || !sauce) {
        return NextResponse.json({ 
          error: 'Invalid pizza components in cart item' 
        }, { status: 400 });
      }

      // Calculate item total
      let itemTotal = size.basePrice + crust.priceModifier + sauce.priceModifier;
      const toppingsTotal = toppingList.reduce((sum, topping) => sum + topping.price, 0);
      itemTotal += toppingsTotal;

      orderTotal += itemTotal;

      // Prepare order item data
      orderItemsData.push({
        quantity: 1,
        basePrice: size.basePrice,
        totalPrice: itemTotal,
        pizzaSize: { connect: { id: sizeId } },
        pizzaCrust: { connect: { id: crustId } },
        pizzaSauce: { connect: { id: sauceId } },
        notes,
        toppings: {
          create: toppings.map((topping: ToppingInput) => ({
            pizzaTopping: { connect: { id: topping.toppingId } },
            quantity: 1,
            section: topping.section || 'WHOLE',
            intensity: topping.intensity || 'REGULAR',
            price: toppingList.find(t => t.id === topping.toppingId)?.price || 0
          }))
        }
      });
    }

    // Calculate tax and final total using dynamic settings
    const settings = await prisma.appSetting.findMany({
      where: {
        key: { in: ['taxRate', 'deliveryFee', 'minimumOrder'] }
      }
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    const taxRate = (parseFloat(settingsMap.taxRate || '8.25')) / 100;
    const deliveryFeeAmount = parseFloat(settingsMap.deliveryFee || '3.99');
    const minimumOrderAmount = parseFloat(settingsMap.minimumOrder || '15.00');

    const subtotal = orderTotal;
    const deliveryFee = orderType === 'DELIVERY' && subtotal < minimumOrderAmount ? deliveryFeeAmount : 0;
    const tax = +(subtotal * taxRate).toFixed(2);
    const finalTotal = +(subtotal + tax + deliveryFee).toFixed(2);

    // Create order with all items
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerName,
        customerEmail,
        customerPhone,
        orderType,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : null,
        deliveryCity: orderType === 'DELIVERY' ? deliveryCity : null,
        deliveryZip: orderType === 'DELIVERY' ? deliveryZip : null,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: finalTotal,
        status: 'PENDING',
        orderItems: {
          create: orderItemsData
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
      }
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order,
      orderId: order.id,
      totalPrice: finalTotal.toFixed(2)
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
            toppings: {
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
