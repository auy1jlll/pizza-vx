import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/customer/reorder - Reorder a specific item from order history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderItemId,
      customerName, 
      customerEmail, 
      customerPhone,
      orderType = 'PICKUP',
      deliveryAddress,
      deliveryCity, 
      deliveryZip,
      quantity = 1
    } = body;

    // Validation
    if (!orderItemId) {
      return NextResponse.json({ 
        error: 'Order item ID is required' 
      }, { status: 400 });
    }

    if (!customerName || !customerEmail) {
      return NextResponse.json({ 
        error: 'Customer name and email are required' 
      }, { status: 400 });
    }

    // Find the original order item
    const originalOrderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        pizzaSize: true,
        pizzaCrust: true,
        pizzaSauce: true,
        toppings: {
          include: {
            pizzaTopping: true
          }
        },
        order: {
          select: {
            customerEmail: true
          }
        }
      }
    });

    if (!originalOrderItem) {
      return NextResponse.json({ 
        error: 'Order item not found' 
      }, { status: 404 });
    }

    // Verify that the customer email matches the original order
    if (originalOrderItem.order.customerEmail?.toLowerCase() !== customerEmail.toLowerCase()) {
      return NextResponse.json({ 
        error: 'Access denied - email does not match original order' 
      }, { status: 403 });
    }

    // Calculate pricing for the reordered item
    const basePrice = originalOrderItem.pizzaSize.basePrice + 
                     originalOrderItem.pizzaCrust.priceModifier + 
                     originalOrderItem.pizzaSauce.priceModifier;
    
    const toppingsTotal = originalOrderItem.toppings.reduce((sum, topping) => 
      sum + topping.pizzaTopping.price, 0
    );
    
    const itemTotal = (basePrice + toppingsTotal) * quantity;
    const subtotal = itemTotal;
    const tax = subtotal * (8.25 / 100); // Should match database tax rate setting
    const deliveryFee = orderType === 'DELIVERY' ? 3.99 : 0;
    const finalTotal = subtotal + tax + deliveryFee;

    // Create new order with the reordered item
    const newOrder = await prisma.order.create({
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
          create: {
            quantity: quantity,
            basePrice: basePrice,
            totalPrice: itemTotal,
            pizzaSize: { connect: { id: originalOrderItem.pizzaSizeId } },
            pizzaCrust: { connect: { id: originalOrderItem.pizzaCrustId } },
            pizzaSauce: { connect: { id: originalOrderItem.pizzaSauceId } },
            notes: originalOrderItem.notes,
            toppings: {
              create: originalOrderItem.toppings.map(topping => ({
                pizzaTopping: { connect: { id: topping.pizzaToppingId } },
                quantity: topping.quantity,
                section: topping.section,
                intensity: topping.intensity,
                price: topping.price
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
      message: 'Item reordered successfully',
      order: newOrder,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalPrice: finalTotal.toFixed(2)
    });

  } catch (error) {
    console.error('Error reordering item:', error);
    return NextResponse.json({ 
      error: 'Failed to reorder item',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
