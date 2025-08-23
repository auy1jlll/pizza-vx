/**
 * Enhanced Promotion Service with Database Integration
 * Handles various types of promotions including BOGO, percentage discounts, and more
 */

import prisma from '@/lib/prisma';

export interface PizzaItem {
  id: string;
  name?: string;
  basePrice: number;
  totalPrice: number;
  quantity: number;
  size?: {
    name: string;
    basePrice: number;
  };
}

export interface MenuItem {
  id: string;
  name?: string;
  basePrice: number;
  totalPrice: number;
  quantity: number;
}

export interface CartItem extends PizzaItem {
  type: 'pizza' | 'menu';
  menuItemId?: string;
  category?: string;
}

export interface PromotionResult {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  promotionApplied: string;
  discountDetails: DiscountDetail[];
  appliedPromotions?: AppliedPromotion[];
}

export interface DiscountDetail {
  itemId: string;
  itemName: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  reason: string;
}

export interface AppliedPromotion {
  id: string;
  name: string;
  discountAmount: number;
}

export interface DatabasePromotion {
  id: string;
  name: string;
  description?: string;
  type: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  minimumQuantity?: number;
  applicableCategories: string[];
  applicableItems: string[];
  requiresLogin: boolean;
  userGroupRestrictions: string[];
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  stackable: boolean;
  priority: number;
  terms?: string;
}

export type PromotionType = 
  | 'BOGO_HALF_OFF'           // Buy one get second half off
  | 'BOGO_FREE'               // Buy one get one free
  | 'PERCENTAGE_DISCOUNT'     // X% off total
  | 'FIXED_AMOUNT_DISCOUNT'   // $X off total
  | 'BUY_X_GET_Y_PERCENT'     // Buy X items get Y% off
  | 'PIZZA_COMBO'             // Special pizza combo pricing
  | 'CATEGORY_DISCOUNT'       // Discount on specific categories
  | 'ITEM_DISCOUNT'           // Discount on specific items
  | 'FREE_DELIVERY'           // Free delivery promotion
  | 'HAPPY_HOUR';             // Time-based discounts

class PromotionService {
  
  /**
   * Get active promotions from database
   */
  static async getActivePromotions(userRole?: string): Promise<DatabasePromotion[]> {
    const now = new Date();
    
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          },
          {
            OR: [
              { usageLimit: null },
              { usageCount: { lt: prisma.promotion.fields.usageLimit } }
            ]
          }
        ]
      },
      orderBy: { priority: 'desc' }
    });

    // Filter by user group if specified
    if (userRole) {
      return promotions.filter(promo => 
        promo.userGroupRestrictions.length === 0 || 
        promo.userGroupRestrictions.includes(userRole)
      );
    }

    return promotions;
  }

  /**
   * Apply the best promotion(s) to cart items
   */
  static async applyBestPromotions(items: CartItem[], userRole?: string): Promise<PromotionResult> {
    const activePromotions = await this.getActivePromotions(userRole);
    
    if (activePromotions.length === 0) {
      return {
        originalTotal: this.calculateTotal(items),
        discountAmount: 0,
        finalTotal: this.calculateTotal(items),
        promotionApplied: 'No active promotions',
        discountDetails: [],
        appliedPromotions: []
      };
    }

    let bestResult: PromotionResult = {
      originalTotal: this.calculateTotal(items),
      discountAmount: 0,
      finalTotal: this.calculateTotal(items),
      promotionApplied: 'No applicable promotions',
      discountDetails: [],
      appliedPromotions: []
    };

    // Try each promotion
    for (const promotion of activePromotions) {
      if (!this.isPromotionApplicable(promotion, items)) {
        continue;
      }

      const result = await this.applyPromotion(promotion, items);
      
      if (result.discountAmount > bestResult.discountAmount) {
        bestResult = result;
      }
    }

    return bestResult;
  }

  /**
   * Check if a promotion is applicable to the cart
   */
  static isPromotionApplicable(promotion: DatabasePromotion, items: CartItem[]): boolean {
    const total = this.calculateTotal(items);
    
    // Check minimum order amount
    if (promotion.minimumOrderAmount && total < promotion.minimumOrderAmount) {
      return false;
    }

    // Check minimum quantity
    if (promotion.minimumQuantity) {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      if (totalQuantity < promotion.minimumQuantity) {
        return false;
      }
    }

    // Check applicable categories
    if (promotion.applicableCategories.length > 0) {
      const hasApplicableItems = items.some(item => 
        promotion.applicableCategories.includes(item.category || item.type)
      );
      if (!hasApplicableItems) {
        return false;
      }
    }

    // Check applicable items
    if (promotion.applicableItems.length > 0) {
      const hasApplicableItems = items.some(item => 
        promotion.applicableItems.includes(item.id)
      );
      if (!hasApplicableItems) {
        return false;
      }
    }

    return true;
  }

  /**
   * Apply a specific promotion
   */
  static async applyPromotion(promotion: DatabasePromotion, items: CartItem[]): Promise<PromotionResult> {
    switch (promotion.type) {
      case 'BOGO_HALF_OFF':
        return this.applyBuyOneGetSecondHalfOff(items, promotion);
      case 'BOGO_FREE':
        return this.applyBuyOneGetOneFree(items, promotion);
      case 'PERCENTAGE_DISCOUNT':
        return this.applyPercentageDiscount(items, promotion);
      case 'FIXED_AMOUNT_DISCOUNT':
        return this.applyFixedAmountDiscount(items, promotion);
      case 'CATEGORY_DISCOUNT':
        return this.applyCategoryDiscount(items, promotion);
      case 'FREE_DELIVERY':
        return this.applyFreeDelivery(items, promotion);
      default:
        return {
          originalTotal: this.calculateTotal(items),
          discountAmount: 0,
          finalTotal: this.calculateTotal(items),
          promotionApplied: 'Unsupported promotion type',
          discountDetails: [],
          appliedPromotions: []
        };
    }
  }

  /**
   * Apply the "Buy One Get Second Half Off" promotion
   */
  static applyBuyOneGetSecondHalfOff(items: CartItem[], promotion: DatabasePromotion): PromotionResult {
    // Filter items based on applicable categories
    let applicableItems = items;
    if (promotion.applicableCategories.length > 0) {
      applicableItems = items.filter(item => 
        promotion.applicableCategories.includes(item.category || item.type)
      );
    }

    if (applicableItems.length < 2) {
      return {
        originalTotal: this.calculateTotal(items),
        discountAmount: 0,
        finalTotal: this.calculateTotal(items),
        promotionApplied: 'Need at least 2 applicable items',
        discountDetails: [],
        appliedPromotions: []
      };
    }

    // Expand items by quantity
    const expandedItems: CartItem[] = [];
    applicableItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          ...item,
          id: `${item.id}-${i}`,
          quantity: 1
        });
      }
    });

    // Sort by price (ascending) to find cheapest items first
    expandedItems.sort((a, b) => a.totalPrice - b.totalPrice);

    // Calculate number of discounts
    const numDiscounts = Math.floor(expandedItems.length / 2);
    
    const discountDetails: DiscountDetail[] = [];
    let totalDiscount = 0;

    // Apply 50% discount to the cheapest items
    for (let i = 0; i < numDiscounts && i < expandedItems.length; i++) {
      const item = expandedItems[i];
      const discount = item.totalPrice * 0.5;
      totalDiscount += discount;

      discountDetails.push({
        itemId: item.id,
        itemName: this.getItemName(item),
        originalPrice: item.totalPrice,
        discountAmount: discount,
        finalPrice: item.totalPrice - discount,
        reason: `50% off (${promotion.name})`
      });
    }

    // Apply maximum discount cap if set
    if (promotion.maximumDiscountAmount && totalDiscount > promotion.maximumDiscountAmount) {
      totalDiscount = promotion.maximumDiscountAmount;
    }

    const originalTotal = this.calculateTotal(items);
    
    return {
      originalTotal,
      discountAmount: totalDiscount,
      finalTotal: originalTotal - totalDiscount,
      promotionApplied: `${promotion.name} (${numDiscounts} discounts applied)`,
      discountDetails,
      appliedPromotions: [{
        id: promotion.id,
        name: promotion.name,
        discountAmount: totalDiscount
      }]
    };
  }

  /**
   * Apply percentage discount to entire order or categories
   */
  static applyPercentageDiscount(items: CartItem[], promotion: DatabasePromotion): PromotionResult {
    let applicableItems = items;
    
    // Filter by categories if specified
    if (promotion.applicableCategories.length > 0) {
      applicableItems = items.filter(item => 
        promotion.applicableCategories.includes(item.category || item.type)
      );
    }

    const applicableTotal = this.calculateTotal(applicableItems);
    let discountAmount = applicableTotal * (promotion.discountValue / 100);
    
    // Apply maximum discount cap if set
    if (promotion.maximumDiscountAmount && discountAmount > promotion.maximumDiscountAmount) {
      discountAmount = promotion.maximumDiscountAmount;
    }

    const discountDetails: DiscountDetail[] = [{
      itemId: 'applicable-total',
      itemName: promotion.applicableCategories.length > 0 ? 'Category Items' : 'Order Total',
      originalPrice: applicableTotal,
      discountAmount,
      finalPrice: applicableTotal - discountAmount,
      reason: `${promotion.discountValue}% off (${promotion.name})`
    }];

    const originalTotal = this.calculateTotal(items);

    return {
      originalTotal,
      discountAmount,
      finalTotal: originalTotal - discountAmount,
      promotionApplied: promotion.name,
      discountDetails,
      appliedPromotions: [{
        id: promotion.id,
        name: promotion.name,
        discountAmount
      }]
    };
  }

  /**
   * Apply fixed amount discount
   */
  static applyFixedAmountDiscount(items: CartItem[], promotion: DatabasePromotion): PromotionResult {
    const originalTotal = this.calculateTotal(items);
    const actualDiscount = Math.min(promotion.discountValue, originalTotal);

    const discountDetails: DiscountDetail[] = [{
      itemId: 'order-total',
      itemName: 'Order Total',
      originalPrice: originalTotal,
      discountAmount: actualDiscount,
      finalPrice: originalTotal - actualDiscount,
      reason: `$${promotion.discountValue} off (${promotion.name})`
    }];

    return {
      originalTotal,
      discountAmount: actualDiscount,
      finalTotal: originalTotal - actualDiscount,
      promotionApplied: promotion.name,
      discountDetails,
      appliedPromotions: [{
        id: promotion.id,
        name: promotion.name,
        discountAmount: actualDiscount
      }]
    };
  }

  /**
   * Apply buy one get one free promotion
   */
  static applyBuyOneGetOneFree(items: CartItem[], promotion: DatabasePromotion): PromotionResult {
    // Filter items based on applicable categories
    let applicableItems = items;
    if (promotion.applicableCategories.length > 0) {
      applicableItems = items.filter(item => 
        promotion.applicableCategories.includes(item.category || item.type)
      );
    }

    if (applicableItems.length < 2) {
      return {
        originalTotal: this.calculateTotal(items),
        discountAmount: 0,
        finalTotal: this.calculateTotal(items),
        promotionApplied: 'Need at least 2 applicable items',
        discountDetails: [],
        appliedPromotions: []
      };
    }

    // Expand items by quantity
    const expandedItems: CartItem[] = [];
    applicableItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          ...item,
          id: `${item.id}-${i}`,
          quantity: 1
        });
      }
    });

    // Sort by price (ascending) to give away cheapest items
    expandedItems.sort((a, b) => a.totalPrice - b.totalPrice);

    const numFreeItems = Math.floor(expandedItems.length / 2);
    
    const discountDetails: DiscountDetail[] = [];
    let totalDiscount = 0;

    // Apply 100% discount to cheapest items
    for (let i = 0; i < numFreeItems && i < expandedItems.length; i++) {
      const item = expandedItems[i];
      const discount = item.totalPrice;
      totalDiscount += discount;

      discountDetails.push({
        itemId: item.id,
        itemName: this.getItemName(item),
        originalPrice: item.totalPrice,
        discountAmount: discount,
        finalPrice: 0,
        reason: `Free item (${promotion.name})`
      });
    }

    // Apply maximum discount cap if set
    if (promotion.maximumDiscountAmount && totalDiscount > promotion.maximumDiscountAmount) {
      totalDiscount = promotion.maximumDiscountAmount;
    }

    const originalTotal = this.calculateTotal(items);
    
    return {
      originalTotal,
      discountAmount: totalDiscount,
      finalTotal: originalTotal - totalDiscount,
      promotionApplied: `${promotion.name} (${numFreeItems} free items)`,
      discountDetails,
      appliedPromotions: [{
        id: promotion.id,
        name: promotion.name,
        discountAmount: totalDiscount
      }]
    };
  }

  /**
   * Apply category-specific discount
   */
  static applyCategoryDiscount(items: CartItem[], promotion: DatabasePromotion): PromotionResult {
    const applicableItems = items.filter(item => 
      promotion.applicableCategories.includes(item.category || item.type)
    );

    if (applicableItems.length === 0) {
      return {
        originalTotal: this.calculateTotal(items),
        discountAmount: 0,
        finalTotal: this.calculateTotal(items),
        promotionApplied: 'No applicable category items',
        discountDetails: [],
        appliedPromotions: []
      };
    }

    const applicableTotal = this.calculateTotal(applicableItems);
    let discountAmount: number;

    if (promotion.discountType === 'PERCENTAGE') {
      discountAmount = applicableTotal * (promotion.discountValue / 100);
    } else {
      discountAmount = Math.min(promotion.discountValue, applicableTotal);
    }

    // Apply maximum discount cap if set
    if (promotion.maximumDiscountAmount && discountAmount > promotion.maximumDiscountAmount) {
      discountAmount = promotion.maximumDiscountAmount;
    }

    const discountDetails: DiscountDetail[] = [{
      itemId: 'category-items',
      itemName: `${promotion.applicableCategories.join(', ')} Items`,
      originalPrice: applicableTotal,
      discountAmount,
      finalPrice: applicableTotal - discountAmount,
      reason: `Category discount (${promotion.name})`
    }];

    const originalTotal = this.calculateTotal(items);

    return {
      originalTotal,
      discountAmount,
      finalTotal: originalTotal - discountAmount,
      promotionApplied: promotion.name,
      discountDetails,
      appliedPromotions: [{
        id: promotion.id,
        name: promotion.name,
        discountAmount
      }]
    };
  }

  /**
   * Apply free delivery promotion
   */
  static applyFreeDelivery(items: CartItem[], promotion: DatabasePromotion): PromotionResult {
    const originalTotal = this.calculateTotal(items);
    const deliveryFee = promotion.discountValue; // Assuming discountValue contains the delivery fee amount

    const discountDetails: DiscountDetail[] = [{
      itemId: 'delivery-fee',
      itemName: 'Delivery Fee',
      originalPrice: deliveryFee,
      discountAmount: deliveryFee,
      finalPrice: 0,
      reason: `Free delivery (${promotion.name})`
    }];

    return {
      originalTotal,
      discountAmount: deliveryFee,
      finalTotal: originalTotal - deliveryFee,
      promotionApplied: promotion.name,
      discountDetails,
      appliedPromotions: [{
        id: promotion.id,
        name: promotion.name,
        discountAmount: deliveryFee
      }]
    };
  }

  /**
   * Record promotion usage
   */
  static async recordPromotionUsage(promotionId: string): Promise<void> {
    await prisma.promotion.update({
      where: { id: promotionId },
      data: {
        usageCount: { increment: 1 }
      }
    });
  }

  /**
   * Calculate total price of items
   */
  private static calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
  }

  /**
   * Get display name for an item
   */
  private static getItemName(item: CartItem): string {
    if (item.name) return item.name;
    if (item.size?.name) return `${item.size.name} Pizza`;
    return 'Item';
  }

  /**
   * Format promotion result for display
   */
  static formatPromotionResult(result: PromotionResult): string {
    if (result.discountAmount === 0) {
      return `Total: $${result.finalTotal.toFixed(2)}`;
    }

    return `
Subtotal: $${result.originalTotal.toFixed(2)}
${result.promotionApplied}: -$${result.discountAmount.toFixed(2)}
Total: $${result.finalTotal.toFixed(2)}
    `.trim();
  }
}

export default PromotionService;
