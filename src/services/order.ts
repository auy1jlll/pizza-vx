import { BaseService } from './base';
import { CreateOrder, CartItem } from '../lib/schemas';
import { OrderStatus } from '@prisma/client';
import { SettingsService } from './settings';

export interface OrderCreationData {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery?: {
    address: string;
    city: string;
    zip: string;
    instructions?: string;
  };
  orderType: 'PICKUP' | 'DELIVERY';
  scheduleType?: 'NOW' | 'LATER';
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  paymentMethod?: string;
  subtotal: number;
  deliveryFee: number;
  tipAmount?: number;
  tipPercentage?: number;
  customTipAmount?: number;
  tax: number;
  total: number;
  notes?: string;
  userId?: string;
}

export interface OrderSearchFilters {
  status?: string[];
  orderType?: 'PICKUP' | 'DELIVERY';
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class OrderService extends BaseService {
  
  // Helper function to generate detailed pizza description
  private generatePizzaDescription(item: any): string {
    const parts: string[] = [];
    
    // Basic pizza info
    parts.push(`${item.size?.name || 'Pizza'} ${item.crust?.name || 'crust'}`);
    
    // Crust cooking level
    if (item.crustCookingLevel && item.crustCookingLevel !== 'REGULAR') {
      parts.push(`(${item.crustCookingLevel.toLowerCase()} baked)`);
    }
    
    // Sauce info with intensity
    const sauceIntensity = item.sauceIntensity || 'REGULAR';
    if (sauceIntensity === 'LIGHT') {
      parts.push(`with light ${item.sauce?.name || 'sauce'}`);
    } else if (sauceIntensity === 'EXTRA') {
      parts.push(`with extra ${item.sauce?.name || 'sauce'}`);
    } else {
      parts.push(`with ${item.sauce?.name || 'sauce'}`);
    }
    
    // Toppings with placement and intensity
    if (item.toppings && item.toppings.length > 0) {
      const toppingDetails: string[] = [];
      
      // Group toppings by placement
      const wholePizza = item.toppings.filter((t: any) => t.section === 'WHOLE' || !t.section);
      const leftSide = item.toppings.filter((t: any) => t.section === 'LEFT');
      const rightSide = item.toppings.filter((t: any) => t.section === 'RIGHT');
      
      if (wholePizza.length > 0) {
        const wholeToppings = wholePizza.map((t: any) => {
          const intensity = t.intensity || 'REGULAR';
          const prefix = intensity === 'LIGHT' ? 'light ' : intensity === 'EXTRA' ? 'extra ' : '';
          return `${prefix}${t.name?.toLowerCase()}`;
        });
        toppingDetails.push(`whole: ${wholeToppings.join(', ')}`);
      }
      
      if (leftSide.length > 0) {
        const leftToppings = leftSide.map((t: any) => {
          const intensity = t.intensity || 'REGULAR';
          const prefix = intensity === 'LIGHT' ? 'light ' : intensity === 'EXTRA' ? 'extra ' : '';
          return `${prefix}${t.name?.toLowerCase()}`;
        });
        toppingDetails.push(`left: ${leftToppings.join(', ')}`);
      }
      
      if (rightSide.length > 0) {
        const rightToppings = rightSide.map((t: any) => {
          const intensity = t.intensity || 'REGULAR';
          const prefix = intensity === 'LIGHT' ? 'light ' : intensity === 'EXTRA' ? 'extra ' : '';
          return `${prefix}${t.name?.toLowerCase()}`;
        });
        toppingDetails.push(`right: ${rightToppings.join(', ')}`);
      }
      
      if (toppingDetails.length > 0) {
        parts.push(`| Toppings: ${toppingDetails.join(' | ')}`);
      }
    }
    
    // Special notes
    if (item.specialtyPizzaName) {
      parts.unshift(`**${item.specialtyPizzaName}**`);
    }
    
    return parts.join(' ');
  }
  
  private generateMenuItemDescription(item: any): string {
    const parts = [`**${item.name}**`];
    
    if (item.category) {
      parts.push(`(${item.category})`);
    }
    
    // Add customizations - handle both string and object formats
    if (Array.isArray(item.customizations) && item.customizations.length > 0) {
      const customizationDetails = item.customizations.map((customization: any) => {
        // Handle string format (legacy from bulk import)
        if (typeof customization === 'string') {
          return customization;
        }
        
        // Handle object format (proper structure from formatForCart API)
        if (customization.groupName && customization.selections) {
          return customization.selections.map((selection: any) => {
            const modifier = selection.price > 0 ? ` (+$${selection.price.toFixed(2)})` : 
                            selection.price < 0 ? ` (-$${Math.abs(selection.price).toFixed(2)})` : '';
            const quantity = selection.quantity > 1 ? ` (${selection.quantity})` : '';
            return `${customization.groupName}: ${selection.optionName}${quantity}${modifier}`;
          }).join(', ');
        }
        
        // Handle legacy object format (groupName, optionName at top level)
        if (customization.groupName && customization.optionName) {
          const modifier = customization.priceModifier > 0 ? ` (+$${customization.priceModifier.toFixed(2)})` : 
                          customization.priceModifier < 0 ? ` (-$${Math.abs(customization.priceModifier).toFixed(2)})` : '';
          return `${customization.groupName}: ${customization.optionName}${modifier}`;
        }
        
        // Fallback for unknown format
        return 'Customization';
      }).filter(Boolean);
      
      if (customizationDetails.length > 0) {
        parts.push(`| ${customizationDetails.join(' | ')}`);
      }
    }
    
    return parts.join(' ');
  }
  
  async createOrder(data: OrderCreationData) {
    console.log('📝 OrderService.createOrder called with data:', JSON.stringify(data, null, 2));
    
    try {
      return await this.withTransaction(async (tx) => {
        // Generate order number
        const orderNumber = `BO${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
        console.log('🔢 Generated order number:', orderNumber);

        // Create the order
  let order;
  let normalizedItems: any[] = [];
  try {
  const start = Date.now();
        // --- Server-side pricing integrity ---
        // Recompute subtotal from authoritative item composition to avoid client tampering.
        let recomputedSubtotal = 0;
        normalizedItems = data.items.map((item: any) => {
          let unitPrice = 0;
          
          // Handle different item types
          if (item.type === 'menu') {
            // Menu item (sandwich, salad, etc.)
            const basePrice = Number(item.basePrice || 0);
            const customizationsTotal = (item.customizations || []).reduce((sum: number, customization: any) => {
              return sum + Number(customization.priceModifier || 0);
            }, 0);
            unitPrice = basePrice + customizationsTotal;
          } else {
            // Pizza item (legacy format)
            const sizeBase = Number(item.size?.basePrice || 0);
            const crustMod = Number(item.crust?.priceModifier || 0);
            const sauceMod = Number(item.sauce?.priceModifier || 0);
            const toppingsTotal = (item.toppings || []).reduce((sum: number, t: any) => {
              const qty = Number(t.quantity || 1);
              const price = Number(t.price || 0);
              return sum + (price * qty);
            }, 0);
            unitPrice = sizeBase + crustMod + sauceMod + toppingsTotal;
          }
          
          const extended = unitPrice * (item.quantity || 1);
          recomputedSubtotal += extended;
          
          return {
            ...item,
            // Normalize pizza toppings if present
            ...(item.toppings ? {
              toppings: item.toppings.map((t: any) => ({
                ...t,
                section: (t.section || 'WHOLE').toUpperCase(),
                intensity: (t.intensity || 'REGULAR').toUpperCase()
              }))
            } : {}),
            _serverUnitPrice: unitPrice,
            _serverExtended: extended
          };
        });

        // Get authoritative pricing settings
        const settingsService = new SettingsService();
        const [taxRate, deliveryFeeSetting] = await Promise.all([
          settingsService.getTaxRate(),
          settingsService.getDeliveryFee()
        ]);
        const deliveryFee = data.orderType === 'DELIVERY' ? deliveryFeeSetting : 0;
        const tipAmount = data.tipAmount ?? null;
        const tipPercentage = data.tipPercentage ?? null;
        const customTipAmount = data.customTipAmount ?? null;

        // Simple tax recompute (if mismatch) using provided tax and client subtotal ratio
        // In future we can fetch taxRate from settings.
        const providedSubtotal = data.subtotal;
        const subtotalDelta = Math.abs(recomputedSubtotal - providedSubtotal);
        if (subtotalDelta > 0.01) {
          console.warn('⚠ Subtotal mismatch. Using server recomputed subtotal.', { providedSubtotal, recomputedSubtotal });
        }
        const authoritativeSubtotal = recomputedSubtotal;
  const authoritativeTax = +(authoritativeSubtotal * (taxRate / 100)).toFixed(2);
        const authoritativeTotal = authoritativeSubtotal + deliveryFee + authoritativeTax + (tipAmount || 0);

        // Create scheduled time if needed
        let scheduledDateTime = null;
        if (data.scheduleType === 'LATER' && data.scheduledDate && data.scheduledTime) {
          try {
            scheduledDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
          } catch (error) {
            console.warn('Invalid scheduled date/time provided:', { scheduledDate: data.scheduledDate, scheduledTime: data.scheduledTime });
          }
        }

        order = await tx.order.create({
          // Cast to any to allow optional nullable pricing fields present in schema but blocked by narrowed type inference
          data: {
            orderNumber,
            userId: data.userId,
            customerName: data.customer.name,
            customerEmail: data.customer.email,
            customerPhone: data.customer.phone,
            orderType: data.orderType,
            scheduleType: data.scheduleType || 'NOW',
            scheduledTime: scheduledDateTime,
            // Assign paymentMethod only if provided to satisfy narrowed type; cast due to prisma type inference issue
            ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {}),
            deliveryAddress: data.delivery?.address,
            deliveryCity: data.delivery?.city,
            deliveryZip: data.delivery?.zip,
            deliveryInstructions: data.delivery?.instructions,
            subtotal: authoritativeSubtotal,
            deliveryFee: deliveryFee,
            // Pricing add-ons (already normalized above)
            tipAmount,
            tipPercentage,
            customTipAmount,
            tax: authoritativeTax,
            total: authoritativeTotal,
            notes: data.notes,
            status: 'PENDING'
          } as any
        });
        console.log('Order prisma create duration ms', Date.now()-start);
        } catch (e:any) {
          console.error('Prisma order.create failed', e);
          throw e;
        }

        // Create order items - unified approach
        for (const originalItem of normalizedItems) {
          const item = originalItem as any; // Type assertion for mixed item types
          
          if (item.type === 'menu') {
            // Handle menu items (sandwiches, salads, etc.) - NEW UNIFIED APPROACH

            // First, try to find the menu item by ID
            let menuItem = null;
            if (item.menuItemId) {
              menuItem = await tx.menuItem.findUnique({
                where: { id: item.menuItemId }
              });
            }

            // If not found by ID, try to find by name
            if (!menuItem && item.name) {
              menuItem = await tx.menuItem.findFirst({
                where: { 
                  name: {
                    contains: item.name,
                    mode: 'insensitive'
                  }
                }
              });
            }

            // If still not found, skip this item (log error)
            if (!menuItem) {
              console.error(`Menu item not found for checkout: ${item.name || item.menuItemId || 'unknown'}`);
              continue; // Skip this item instead of failing the entire order
            }

            const createdItem = await tx.orderItem.create({
              data: {
                orderId: order.id,
                menuItemId: menuItem.id, // Use the found menu item's ID
                quantity: item.quantity,
                basePrice: item._serverUnitPrice,
                totalPrice: item._serverExtended,
                notes: this.generateMenuItemDescription(item)
              }
            });
            
            // Create unified customizations for menu items
            if (Array.isArray(item.customizations) && item.customizations.length) {
              for (const customization of item.customizations) {
                if (customization.optionId) {
                  // Check if the customization option exists
                  const optionExists = await tx.customizationOption.findUnique({
                    where: { id: customization.optionId }
                  });
                  
                  if (optionExists) {
                    await tx.orderItemCustomization.create({
                      data: {
                        orderItemId: createdItem.id,
                        customizationOptionId: customization.optionId,
                        quantity: customization.quantity || 1,
                        price: customization.priceModifier || 0
                      }
                    });
                  } else {
                    console.warn(`Skipping invalid customization option: ${customization.optionId} for item ${item.name || item.id}`);
                  }
                }
              }
            }
          } else {
            // Handle pizza items - EXISTING LOGIC UNCHANGED
            // Get fallback IDs from database if item IDs are missing
            let sizeId: string | undefined = item.size?.id;
            let crustId: string | undefined = item.crust?.id;  
            let sauceId: string | undefined = item.sauce?.id;

            // If any required ID is missing, fetch defaults from database
            if (!sizeId || !crustId || !sauceId) {
              const [defaultSize, defaultCrust, defaultSauce] = await Promise.all([
                !sizeId ? tx.pizzaSize.findFirst({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }) : null,
                !crustId ? tx.pizzaCrust.findFirst({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }) : null,
                !sauceId ? tx.pizzaSauce.findFirst({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }) : null
              ]);

              sizeId = sizeId || defaultSize?.id || undefined;
              crustId = crustId || defaultCrust?.id || undefined;
              sauceId = sauceId || defaultSauce?.id || undefined;

              console.log('Using fallback IDs:', { sizeId, crustId, sauceId });
            }

            // Ensure we have all required IDs
            if (!sizeId || !crustId || !sauceId) {
              throw new Error(`Missing required pizza component IDs: size=${!!sizeId}, crust=${!!crustId}, sauce=${!!sauceId}`);
            }
            
            const createdItem = await tx.orderItem.create({
              data: {
                orderId: order.id,
                pizzaSizeId: sizeId,
                pizzaCrustId: crustId,
                pizzaSauceId: sauceId,
                quantity: item.quantity,
                basePrice: item._serverUnitPrice,
                totalPrice: item._serverExtended,
                notes: this.generatePizzaDescription(item)
              }
            });
            
            // Persist toppings with placement/intensity for kitchen display if present - EXISTING LOGIC
            if (Array.isArray(item.toppings) && item.toppings.length) {
              const toppingRows = item.toppings
                .filter((t: any) => t && t.id)
                .map((t: any) => ({
                  orderItemId: createdItem.id,
                  pizzaToppingId: t.id,
                  quantity: Number(t.quantity) || 1,
                  section: t.section || 'WHOLE',
                  intensity: (t.intensity || 'REGULAR').toUpperCase(),
                  price: Number(t.price) || 0
                }));
              if (toppingRows.length) {
                try {
                  await tx.orderItemTopping.createMany({ data: toppingRows });
                } catch (e) {
                  console.warn('Bulk topping persistence failed, retrying individually', e);
                  for (const row of toppingRows) {
                    try { await tx.orderItemTopping.create({ data: row }); } catch {/* ignore */}
                  }
                }
              }
            }
          }
        }

        console.log('✅ Order created successfully:', { id: order.id, orderNumber: order.orderNumber });
        return order;
      });
      
    } catch (error) {
      console.error('❌ OrderService.createOrder error:', error);
      throw error;
    }
  }

  async getOrderById(id: string) {
    console.log('OrderService.getOrderById called with id:', id);
    
    try {
      const order = await this.db.order.findUnique({
        where: { id },
        include: {
          orderItems: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      this.handleError(error, 'GetOrderById');
    }
  }

  async getOrdersByUser(userId: string, filters?: OrderSearchFilters) {
    console.log('OrderService.getOrdersByUser called', { userId, filters });
    
    try {
      const where: any = { userId };
      
      if (filters?.status?.length) {
        where.status = { in: filters.status };
      }
      
      if (filters?.orderType) {
        where.orderType = filters.orderType;
      }
      
      if (filters?.startDate && filters?.endDate) {
        where.createdAt = {
          gte: filters.startDate,
          lte: filters.endDate
        };
      }

      const orders = await this.db.order.findMany({
        where,
        include: {
          orderItems: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return orders;
    } catch (error) {
      this.handleError(error, 'GetOrdersByUser');
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    console.log('OrderService.updateOrderStatus called', { id, status });
    
    try {
      const order = await this.db.order.update({
        where: { id },
        data: { status },
        include: {
          orderItems: true
        }
      });

      console.log('Order status updated:', { id, status });
      return order;
    } catch (error) {
      this.handleError(error, 'UpdateOrderStatus');
    }
  }
}
