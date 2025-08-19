import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PriceCalculation {
  basePrice: number;
  toppingsPrice: number;
  customizationsPrice: number;
  totalPrice: number;
}

export interface CartPriceData {
  pizzaItems: Array<{
    id: string;
    currentPrice: PriceCalculation;
  }>;
  menuItems: Array<{
    id: string;
    currentPrice: number;
  }>;
}

/**
 * Calculate current price for a pizza based on current database prices
 */
export async function calculatePizzaPrice(pizzaData: any): Promise<PriceCalculation> {
  try {
    let basePrice = 0;
    let toppingsPrice = 0;
    let customizationsPrice = 0;

    // Get size price
    if (pizzaData.size?.id) {
      const size = await prisma.pizzaSize.findUnique({
        where: { id: pizzaData.size.id }
      });
      basePrice += size?.basePrice || 0;
    }

    // Get crust price modifier
    if (pizzaData.crust?.id) {
      const crust = await prisma.pizzaCrust.findUnique({
        where: { id: pizzaData.crust.id }
      });
      basePrice += crust?.priceModifier || 0;
    }

    // Get sauce price modifier  
    if (pizzaData.sauce?.id) {
      const sauce = await prisma.pizzaSauce.findUnique({
        where: { id: pizzaData.sauce.id }
      });
      basePrice += sauce?.priceModifier || 0;
    }

    // Calculate toppings price
    if (pizzaData.toppings && Array.isArray(pizzaData.toppings)) {
      for (const topping of pizzaData.toppings) {
        if (topping.id) {
          const toppingData = await prisma.pizzaTopping.findUnique({
            where: { id: topping.id }
          });
          if (toppingData) {
            const quantity = topping.quantity || 1;
            toppingsPrice += (toppingData.price * quantity);
          }
        }
      }
    }

    const totalPrice = basePrice + toppingsPrice + customizationsPrice;

    return {
      basePrice,
      toppingsPrice,
      customizationsPrice,
      totalPrice
    };

  } catch (error) {
    console.error('Error calculating pizza price:', error);
    return {
      basePrice: 0,
      toppingsPrice: 0,
      customizationsPrice: 0,
      totalPrice: 0
    };
  }
}

/**
 * Calculate current price for a menu item based on current database prices
 */
export async function calculateMenuItemPrice(item: any, customizations: any[] = []): Promise<number> {
  try {
    let menuItem = null;
    
    // Try to find menu item by ID first, then by name
    if (item.menuItemId) {
      menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });
    } else if (item.name) {
      menuItem = await prisma.menuItem.findFirst({
        where: { name: item.name }
      });
    }

    if (!menuItem) {
      console.warn(`Menu item not found: ${item.name || item.menuItemId || 'unknown'}`);
      return item.price || 0; // fallback to stored price
    }

    let totalPrice = menuItem.basePrice;

    // Add customization prices - try multiple approaches to find options
    for (const customization of customizations) {
      let optionPrice = 0;
      
      // Method 1: Try to find by optionId if it's a real database ID
      if (customization.optionId) {
        const option = await prisma.customizationOption.findUnique({
          where: { id: customization.optionId }
        });
        if (option) {
          optionPrice = option.priceModifier || 0;
        }
      }
      
      // Method 2: If not found and we have priceModifier, use it directly (from frontend)
      if (optionPrice === 0 && customization.priceModifier !== undefined) {
        optionPrice = customization.priceModifier;
        console.log(`Using stored priceModifier for ${customization.optionName}: $${optionPrice}`);
      }
      
      // Method 3: Try to find by option name if we have groupName and optionName
      if (optionPrice === 0 && customization.groupName && customization.optionName) {
        const option = await prisma.customizationOption.findFirst({
          where: {
            name: customization.optionName,
            group: {
              name: customization.groupName
            }
          }
        });
        if (option) {
          optionPrice = option.priceModifier || 0;
          console.log(`Found option by name ${customization.optionName}: $${optionPrice}`);
        }
      }
      
      totalPrice += optionPrice;
      console.log(`Added customization ${customization.optionName || customization.optionId}: +$${optionPrice} (total: $${totalPrice.toFixed(2)})`);
    }

    // Fix floating-point precision issues by rounding to 2 decimal places
    return Math.round(totalPrice * 100) / 100;

  } catch (error) {
    console.error('Error calculating menu item price:', error);
    return item.price || 0; // fallback to stored price
  }
}

/**
 * Get current prices for all items in cart
 */
export async function refreshCartPrices(cartData: any): Promise<CartPriceData> {
  try {
    console.log('Refreshing prices for cart data:', {
      pizzaItemsCount: cartData.pizzaItems?.length || 0,
      menuItemsCount: cartData.menuItems?.length || 0
    });

    const pizzaItems = [];
    const menuItems = [];

    // Process pizza items with individual error handling
    if (cartData.pizzaItems && Array.isArray(cartData.pizzaItems)) {
      for (const pizza of cartData.pizzaItems) {
        try {
          if (!pizza || !pizza.id) {
            console.warn('Skipping invalid pizza item:', pizza);
            continue;
          }
          
          const currentPrice = await calculatePizzaPrice(pizza);
          pizzaItems.push({
            id: pizza.id,
            currentPrice
          });
        } catch (error) {
          console.error(`Error calculating price for pizza ${pizza.id}:`, error);
          // Continue processing other items instead of failing completely
        }
      }
    }

    // Process menu items with individual error handling
    if (cartData.menuItems && Array.isArray(cartData.menuItems)) {
      for (const item of cartData.menuItems) {
        try {
          if (!item || !item.id) {
            console.warn('Skipping invalid menu item:', item);
            continue;
          }

          const currentPrice = await calculateMenuItemPrice(item, item.customizations || []);
          menuItems.push({
            id: item.id,
            currentPrice
          });
        } catch (error) {
          console.error(`Error calculating price for menu item ${item.id}:`, error);
          // Continue processing other items instead of failing completely
        }
      }
    }

    console.log('Price refresh completed:', {
      pizzaItemsProcessed: pizzaItems.length,
      menuItemsProcessed: menuItems.length
    });

    return {
      pizzaItems,
      menuItems
    };

  } catch (error) {
    console.error('Error refreshing cart prices:', error);
    return {
      pizzaItems: [],
      menuItems: []
    };
  } finally {
    await prisma.$disconnect();
  }
}
