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
  subtotal: number;
  deliveryFee: number;
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
            deliveryAddress: data.delivery?.address,
            deliveryCity: data.delivery?.city,
            deliveryZip: data.delivery?.zip,
            deliveryInstructions: data.delivery?.instructions,
            subtotal: data.subtotal,
            deliveryFee: data.deliveryFee,
            tax: data.tax,
            total: data.total,
            notes: data.notes,
            status: 'PENDING'
          }
        });

        // Create order items
        for (const item of data.items) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              name: item.name,
              quantity: item.quantity,
              basePrice: item.basePrice,
              totalPrice: item.totalPrice,
              pizzaDetails: item.type === 'custom' ? {
                size: item.size?.name || '',
                crust: item.crust?.name || '',
                sauce: item.sauce?.name || '',
                toppings: item.toppings?.map(t => t.name).join(', ') || '',
                notes: item.notes || ''
              } : null
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
          items: true,
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
          items: true
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
          items: true
        }
      });

      console.log('Order status updated:', { id, status });
      return order;
    } catch (error) {
      this.handleError(error, 'UpdateOrderStatus');
    }
  }
}
