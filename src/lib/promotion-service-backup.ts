/**
 * Promotion Service
 * Handles various types of promotions including BOGO, percentage discounts, and more
 */

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
}

export interface PromotionResult {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  promotionApplied: string;
  discountDetails: DiscountDetail[];
}

export interface DiscountDetail {
  itemId: string;
  itemName: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  reason: string;
}

export type PromotionType = 
  | 'BOGO_HALF_OFF'           // Buy one get second half off
  | 'BOGO_FREE'               // Buy one get one free
  | 'PERCENTAGE_OFF'          // X% off total
  | 'FIXED_AMOUNT_OFF'        // $X off total
  | 'BUY_X_GET_Y_PERCENT'     // Buy X items get Y% off
  | 'PIZZA_COMBO'             // Special pizza combo pricing
  | 'HAPPY_HOUR';             // Time-based discounts

export interface Promotion {
  id: string;
  name: string;
  type: PromotionType;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  minimumOrderAmount?: number;
  minimumItemCount?: number;
  maxDiscountAmount?: number;
  discountValue: number; // Percentage (0.5 = 50%) or fixed amount
  applicableItemTypes?: ('pizza' | 'menu')[];
  description: string;
  termsAndConditions?: string;
}

class PromotionService {
  
  /**
   * Apply the "Buy One Get Second Half Off" promotion to pizza items
   * For every 2 pizzas, discount the cheaper one by 50%
   * Examples: 2 pizzas = 1 discount, 3 pizzas = 1 discount, 4 pizzas = 2 discounts, 10 pizzas = 5 discounts
   */
  static applyBuyOneGetSecondHalfOff(items: CartItem[]): PromotionResult {
    const pizzaItems = items.filter(item => item.type === 'pizza');
    
    if (pizzaItems.length < 2) {
      return {
        originalTotal: this.calculateTotal(items),
        discountAmount: 0,
        finalTotal: this.calculateTotal(items),
        promotionApplied: 'None - Need at least 2 pizzas',
        discountDetails: []
      };
    }

    // Expand items by quantity for proper counting
    const expandedPizzas: CartItem[] = [];
    pizzaItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedPizzas.push({
          ...item,
          id: `${item.id}-${i}`,
          quantity: 1
        });
      }
    });

    // Sort by price (ascending) to find cheapest items first
    expandedPizzas.sort((a, b) => a.totalPrice - b.totalPrice);

    // Calculate number of discounts: floor(total pizzas / 2)
    const numDiscounts = Math.floor(expandedPizzas.length / 2);
    
    const discountDetails: DiscountDetail[] = [];
    let totalDiscount = 0;

    // Apply 50% discount to the cheapest pizzas (up to numDiscounts)
    for (let i = 0; i < numDiscounts && i < expandedPizzas.length; i++) {
      const pizza = expandedPizzas[i];
      const discount = pizza.totalPrice * 0.5; // 50% off
      totalDiscount += discount;

      discountDetails.push({
        itemId: pizza.id,
        itemName: this.getItemName(pizza),
        originalPrice: pizza.totalPrice,
        discountAmount: discount,
        finalPrice: pizza.totalPrice - discount,
        reason: `50% off (Buy One Get Second Half Off - Pizza #${i + 1})`
      });
    }

    const originalTotal = this.calculateTotal(items);
    
    return {
      originalTotal,
      discountAmount: totalDiscount,
      finalTotal: originalTotal - totalDiscount,
      promotionApplied: `Buy One Get Second Half Off (${numDiscounts} discounts applied)`,
      discountDetails
    };
  }

  /**
   * Apply percentage discount to entire order
   */
  static applyPercentageDiscount(items: CartItem[], percentage: number, maxDiscount?: number): PromotionResult {
    const originalTotal = this.calculateTotal(items);
    let discountAmount = originalTotal * (percentage / 100);
    
    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }

    const discountDetails: DiscountDetail[] = [{
      itemId: 'order-total',
      itemName: 'Order Total',
      originalPrice: originalTotal,
      discountAmount,
      finalPrice: originalTotal - discountAmount,
      reason: `${percentage}% off entire order`
    }];

    return {
      originalTotal,
      discountAmount,
      finalTotal: originalTotal - discountAmount,
      promotionApplied: `${percentage}% Off Entire Order`,
      discountDetails
    };
  }

  /**
   * Apply fixed amount discount
   */
  static applyFixedAmountDiscount(items: CartItem[], discountAmount: number): PromotionResult {
    const originalTotal = this.calculateTotal(items);
    const actualDiscount = Math.min(discountAmount, originalTotal);

    const discountDetails: DiscountDetail[] = [{
      itemId: 'order-total',
      itemName: 'Order Total',
      originalPrice: originalTotal,
      discountAmount: actualDiscount,
      finalPrice: originalTotal - actualDiscount,
      reason: `$${discountAmount} off order`
    }];

    return {
      originalTotal,
      discountAmount: actualDiscount,
      finalTotal: originalTotal - actualDiscount,
      promotionApplied: `$${discountAmount} Off`,
      discountDetails
    };
  }

  /**
   * Apply Buy X Get Y Percent Off promotion
   * When you buy X or more items, get Y% off
   */
  static applyBuyXGetYPercent(
    items: CartItem[], 
    minimumQuantity: number, 
    discountPercentage: number
  ): PromotionResult {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalQuantity < minimumQuantity) {
      return {
        originalTotal: this.calculateTotal(items),
        discountAmount: 0,
        finalTotal: this.calculateTotal(items),
        promotionApplied: `None - Need ${minimumQuantity} items (have ${totalQuantity})`,
        discountDetails: []
      };
    }

    return this.applyPercentageDiscount(items, discountPercentage);
  }

  /**
   * Main function to apply the best available promotion
   */
  static applyBestPromotion(items: CartItem[], availablePromotions: Promotion[] = []): PromotionResult {
    if (items.length === 0) {
      return {
        originalTotal: 0,
        discountAmount: 0,
        finalTotal: 0,
        promotionApplied: 'No items',
        discountDetails: []
      };
    }

    // Default promotions if none provided
    if (availablePromotions.length === 0) {
      availablePromotions = this.getDefaultPromotions();
    }

    const results: PromotionResult[] = [];
    const originalTotal = this.calculateTotal(items);

    // Try each applicable promotion
    for (const promotion of availablePromotions) {
      if (!promotion.isActive) continue;

      // Check minimum order amount
      if (promotion.minimumOrderAmount && originalTotal < promotion.minimumOrderAmount) {
        continue;
      }

      // Check minimum item count
      if (promotion.minimumItemCount) {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity < promotion.minimumItemCount) continue;
      }

      let result: PromotionResult;

      switch (promotion.type) {
        case 'BOGO_HALF_OFF':
          result = this.applyBuyOneGetSecondHalfOff(items);
          break;
        case 'PERCENTAGE_OFF':
          result = this.applyPercentageDiscount(items, promotion.discountValue, promotion.maxDiscountAmount);
          break;
        case 'FIXED_AMOUNT_OFF':
          result = this.applyFixedAmountDiscount(items, promotion.discountValue);
          break;
        case 'BUY_X_GET_Y_PERCENT':
          result = this.applyBuyXGetYPercent(items, promotion.minimumItemCount || 2, promotion.discountValue);
          break;
        default:
          continue;
      }

      result.promotionApplied = promotion.name;
      results.push(result);
    }

    // Return the promotion with the highest discount
    if (results.length === 0) {
      return {
        originalTotal,
        discountAmount: 0,
        finalTotal: originalTotal,
        promotionApplied: 'No applicable promotions',
        discountDetails: []
      };
    }

    return results.reduce((best, current) => 
      current.discountAmount > best.discountAmount ? current : best
    );
  }

  /**
   * Get default promotions
   */
  static getDefaultPromotions(): Promotion[] {
    return [
      {
        id: 'bogo-half-off',
        name: 'Buy One Pizza Get 2nd Half Off',
        type: 'BOGO_HALF_OFF',
        isActive: true,
        discountValue: 50,
        applicableItemTypes: ['pizza'],
        description: 'Buy any pizza and get the second pizza at 50% off. Discount applies to the lower-priced pizza.',
        termsAndConditions: 'Valid on regular menu price pizzas. Cannot be combined with other offers.'
      },
      {
        id: 'pizza-combo-20',
        name: '20% Off 3+ Pizzas',
        type: 'BUY_X_GET_Y_PERCENT',
        isActive: true,
        minimumItemCount: 3,
        discountValue: 20,
        applicableItemTypes: ['pizza'],
        description: 'Get 20% off when you order 3 or more pizzas',
        termsAndConditions: 'Applies to pizza items only. Minimum 3 pizzas required.'
      }
    ];
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
    return 'Pizza';
  }

  /**
   * Validate promotion dates
   */
  static isPromotionValid(promotion: Promotion): boolean {
    if (!promotion.isActive) return false;
    
    const now = new Date();
    
    if (promotion.startDate && now < promotion.startDate) return false;
    if (promotion.endDate && now > promotion.endDate) return false;
    
    return true;
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
