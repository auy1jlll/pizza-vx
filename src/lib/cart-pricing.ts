import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma'; // Use singleton instance

// Ensure database connection with retry logic
async function ensureDatabaseConnection() {
  let retries = 3;
  
  while (retries > 0) {
    try {
      // Test the connection by making a simple query
      await prisma.$connect();
      console.log('🔌 Database connection established');
      return true;
    } catch (error) {
      console.error(`❌ Database connection failed (${retries} retries left):`, error);
      retries--;
      
      if (retries > 0) {
        // Wait and try to reconnect
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          await prisma.$disconnect();
        } catch {}
      } else {
        throw new Error('Database connection could not be established after multiple attempts');
      }
    }
  }
  return false;
}

// Wrapper for safe database operations
async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Engine is not yet connected')) {
      console.log('🔄 Database engine not connected, attempting to reconnect...');
      await ensureDatabaseConnection();
      return await operation();
    }
    throw error;
  }
}

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
    // Ensure database connection
    await ensureDatabaseConnection();
    
    let basePrice = 0;
    let toppingsPrice = 0;
    let customizationsPrice = 0;

    // Get size price - handle specialty pizzas specially
    if (pizzaData.size?.id) {
      try {
        // For specialty pizzas and calzones, use the size price from cart data (which contains specialty pricing)
        const isSpecialtyPizza = pizzaData.isSpecialty || pizzaData.specialtyId || pizzaData.specialtyPizzaName;
        const isSpecialtyCalzone = pizzaData.specialtyCalzoneName || (pizzaData.notes && pizzaData.notes.includes('Specialty Calzone:'));
        const isSpecialtyByNotes = pizzaData.notes && (pizzaData.notes.includes('Specialty Pizza:') || pizzaData.notes.includes('**'));

        // Enhanced detection: check if size price is significantly higher than typical sizes (specialty pricing)
        const hasSpecialtyPricing = pizzaData.size?.basePrice && pizzaData.size.basePrice > 20; // Specialty pizzas typically > $20
        
        console.log('🔍 SPECIALTY DETECTION DEBUG:', {
          itemId: pizzaData.id || 'unknown',
          notes: pizzaData.notes || 'no notes',
          sizeBasePrice: pizzaData.size?.basePrice,
          isSpecialty: !!pizzaData.isSpecialty,
          specialtyId: !!pizzaData.specialtyId,
          specialtyPizzaName: !!pizzaData.specialtyPizzaName,
          specialtyCalzoneName: !!pizzaData.specialtyCalzoneName,
          isSpecialtyPizza,
          isSpecialtyCalzone,
          isSpecialtyByNotes,
          hasSpecialtyPricing,
          finalDecision: isSpecialtyPizza || isSpecialtyCalzone || isSpecialtyByNotes || hasSpecialtyPricing
        });
        
        if (isSpecialtyPizza || isSpecialtyCalzone || isSpecialtyByNotes || hasSpecialtyPricing) {
          console.log('🍕 Specialty pizza/calzone detected, using cart size price:', pizzaData.size?.basePrice);
          basePrice += pizzaData.size?.basePrice || 0;
        } else {
          // For regular pizzas, fetch current size price from database
          const size = await safeDbOperation(() => 
            prisma.pizzaSize.findUnique({
              where: { id: pizzaData.size.id }
            })
          );
          basePrice += size?.basePrice || 0;
        }
      } catch (error) {
        console.error('Error fetching size data:', error);
        // Use size from cart data as fallback
        basePrice += pizzaData.size?.basePrice || 0;
      }
    }

    // Get crust price modifier
    if (pizzaData.crust?.id) {
      try {
        const crust = await safeDbOperation(() =>
          prisma.pizzaCrust.findUnique({
            where: { id: pizzaData.crust.id }
          })
        );
        basePrice += crust?.priceModifier || 0;
      } catch (error) {
        console.error('Error fetching crust data:', error);
        // Use crust from cart data as fallback
        basePrice += pizzaData.crust?.priceModifier || 0;
      }
    }

    // Get sauce price modifier
    if (pizzaData.sauce?.id) {
      try {
        const sauce = await safeDbOperation(() =>
          prisma.pizzaSauce.findUnique({
            where: { id: pizzaData.sauce.id }
          })
        );
        basePrice += sauce?.priceModifier || 0;
      } catch (error) {
        console.error('Error fetching sauce data:', error);
        // Use sauce from cart data as fallback
        basePrice += pizzaData.sauce?.priceModifier || 0;
      }
    }

    // Calculate toppings price
    if (pizzaData.toppings && Array.isArray(pizzaData.toppings)) {
      for (const topping of pizzaData.toppings) {
        try {
          const toppingData = await safeDbOperation(() =>
            prisma.pizzaTopping.findUnique({
              where: { id: topping.id }
            })
          );
          
          if (toppingData) {
            let toppingPrice = toppingData.price || 0;
            
            // Apply quantity multiplier
            if (topping.quantity && topping.quantity !== 1) {
              toppingPrice *= topping.quantity;
            }
            
            // Apply intensity multiplier (if not using quantity already)
            if (!topping.quantity && topping.intensity) {
              if (topping.intensity === 'LIGHT') {
                toppingPrice *= 0.75;
              } else if (topping.intensity === 'EXTRA') {
                toppingPrice *= 1.5;
              }
            }
            
            toppingsPrice += toppingPrice;
          }
        } catch (error) {
          console.error('Error fetching topping data:', error);
          // Use topping from cart data as fallback
          toppingsPrice += topping.price || 0;
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
    // Ensure database connection
    await ensureDatabaseConnection();
    
    let menuItem = null;
    
    // Try to find menu item by ID first, then by name
    if (item.menuItemId) {
      menuItem = await safeDbOperation(() =>
        prisma.menuItem.findUnique({
          where: { id: item.menuItemId }
        })
      );
    } else if (item.name) {
      menuItem = await safeDbOperation(() =>
        prisma.menuItem.findFirst({
          where: { name: item.name }
        })
      );
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
        const option = await safeDbOperation(() =>
          prisma.customizationOption.findUnique({
            where: { id: customization.optionId }
          })
        );
        if (option) {
          optionPrice = option.priceModifier * (customization.quantity || 1);
        }
      }
      
      // Method 2: If optionId didn't work, try to find by name and group
      if (optionPrice === 0 && customization.optionName && customization.groupName) {
        const option = await safeDbOperation(() =>
          prisma.customizationOption.findFirst({
            where: {
              name: customization.optionName,
              group: {
                name: customization.groupName
              }
            }
          })
        );
        if (option) {
          optionPrice = option.priceModifier * (customization.quantity || 1);
        }
      }
      
      // Method 3: Fallback to stored price modifier
      if (optionPrice === 0 && customization.priceModifier !== undefined) {
        optionPrice = customization.priceModifier * (customization.quantity || 1);
      }
      
      totalPrice += optionPrice;
    }

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
    // Ensure database connection before processing
    await ensureDatabaseConnection();
    
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
          // Add with zero price to maintain structure
          pizzaItems.push({
            id: pizza.id,
            currentPrice: {
              basePrice: 0,
              toppingsPrice: 0,
              customizationsPrice: 0,
              totalPrice: 0
            }
          });
        }
      }
    }

    // Process menu items with individual error handling
    if (cartData.menuItems && Array.isArray(cartData.menuItems)) {
      for (const menuItem of cartData.menuItems) {
        try {
          if (!menuItem || !menuItem.id) {
            console.warn('Skipping invalid menu item:', menuItem);
            continue;
          }
          
          const currentPrice = await calculateMenuItemPrice(menuItem, menuItem.customizations || []);
          menuItems.push({
            id: menuItem.id,
            currentPrice
          });
        } catch (error) {
          console.error(`Error calculating price for menu item ${menuItem.id}:`, error);
          // Add with stored price as fallback
          menuItems.push({
            id: menuItem.id,
            currentPrice: menuItem.price || 0
          });
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
    
    // Handle specific Prisma connection errors
    if (error instanceof Error) {
      if (error.message.includes('Engine is not yet connected')) {
        console.error('Database connection issue detected, attempting reconnection...');
        try {
          await prisma.$disconnect();
          await prisma.$connect();
          console.log('Database reconnection successful, but returning empty data for this request');
        } catch (reconnectError) {
          console.error('Database reconnection failed:', reconnectError);
        }
      }
    }
    
    return {
      pizzaItems: [],
      menuItems: []
    };
  } finally {
    // Don't disconnect in development to avoid breaking dev server
    // The prisma singleton handles connection management automatically
    if (process.env.NODE_ENV === 'production') {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.warn('Error during database disconnect:', disconnectError);
      }
    }
  }
}
