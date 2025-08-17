// API route to fetch fresh prices for cart items
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { cartItems } = await request.json();
    
    const updatedItems = [];
    
    for (const item of cartItems) {
      if (item.type === 'pizza') {
        // Fetch current pizza component prices
        const [size, crust, sauce, toppings] = await Promise.all([
          item.sizeId ? prisma.pizzaSize.findUnique({ where: { id: item.sizeId } }) : null,
          item.crustId ? prisma.pizzaCrust.findUnique({ where: { id: item.crustId } }) : null,
          item.sauceId ? prisma.pizzaSauce.findUnique({ where: { id: item.sauceId } }) : null,
          item.toppingIds ? prisma.pizzaTopping.findMany({ 
            where: { id: { in: item.toppingIds } } 
          }) : []
        ]);

        // Calculate current pizza price
        const basePrice = size?.basePrice || 0;
        const crustPrice = crust?.priceModifier || 0;
        const saucePrice = sauce?.priceModifier || 0;
        const toppingsPrice = toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
        
        const currentPrice = basePrice + crustPrice + saucePrice + toppingsPrice;
        
        updatedItems.push({
          ...item,
          currentPrice,
          size: size ? { id: size.id, name: size.name, basePrice: size.basePrice } : null,
          crust: crust ? { id: crust.id, name: crust.name, priceModifier: crust.priceModifier } : null,
          sauce: sauce ? { id: sauce.id, name: sauce.name, priceModifier: sauce.priceModifier } : null,
          toppings: toppings.map(t => ({ id: t.id, name: t.name, price: t.price }))
        });
        
      } else if (item.type === 'menu') {
        // Fetch current menu item price
        const menuItem = await prisma.menuItem.findUnique({ 
          where: { id: item.menuItemId },
          include: {
            category: true,
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: {
                    options: true
                  }
                }
              }
            }
          }
        });

        if (menuItem) {
          let currentPrice = menuItem.basePrice;
          
          // Calculate customization costs
          if (item.customizations) {
            for (const customization of item.customizations) {
              const option = await prisma.customizationOption.findUnique({
                where: { id: customization.optionId }
              });
              if (option) {
                currentPrice += (option.priceModifier || 0) * (customization.quantity || 1);
              }
            }
          }
          
          updatedItems.push({
            ...item,
            currentPrice,
            name: menuItem.name,
            category: menuItem.category.name,
            basePrice: menuItem.basePrice
          });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      items: updatedItems 
    });
    
  } catch (error) {
    console.error('Error fetching cart prices:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch current prices' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
