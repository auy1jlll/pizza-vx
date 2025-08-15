import { BaseService } from './base';
import { CreateOrder, CartItem } from '../lib/schemas';
import { OrderStatus } from '@prisma/client';

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
  
  async createOrder(data: OrderCreationData) {
    console.log('📝 OrderService.createOrder called with data:', JSON.stringify(data, null, 2));
    
    try {
      return await this.withTransaction(async (tx) => {
        // Generate order number
        const orderNumber = `BO${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
        console.log('🔢 Generated order number:', orderNumber);

        // Create the order
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId: data.userId,
            customerName: data.customer.name,
            customerEmail: data.customer.email,
            customerPhone: data.customer.phone,
            orderType: data.orderType,
            // paymentMethod: data.paymentMethod, // Temporarily commented out due to type issue
            deliveryAddress: data.delivery?.address,
            deliveryCity: data.delivery?.city,
            deliveryZip: data.delivery?.zip,
            deliveryInstructions: data.delivery?.instructions,
            subtotal: data.subtotal,
            deliveryFee: data.deliveryFee,
            tipAmount: data.tipAmount,
            tipPercentage: data.tipPercentage,
            customTipAmount: data.customTipAmount,
            tax: data.tax,
            total: data.total,
            notes: data.notes,
            status: 'PENDING'
          }
        });

        // Create order items
        for (const item of data.items) {
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
          
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              pizzaSizeId: sizeId,
              pizzaCrustId: crustId,
              pizzaSauceId: sauceId,
              quantity: item.quantity,
              basePrice: item.basePrice,
              totalPrice: item.totalPrice,
              notes: this.generatePizzaDescription(item)
            }
          });
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
