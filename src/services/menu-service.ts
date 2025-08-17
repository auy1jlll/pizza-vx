// Service layer for menu customization operations
import { CustomizationEngine, MenuItemSelection, ValidationResult, PricingResult, FormattedCartItem } from '@/lib/customization-engine';

export class MenuService {
  private static instance: MenuService;
  private engine: CustomizationEngine;

  private constructor() {
    this.engine = new CustomizationEngine();
  }

  public static getInstance(): MenuService {
    if (!MenuService.instance) {
      MenuService.instance = new MenuService();
    }
    return MenuService.instance;
  }

  /**
   * Get all menu categories with their items and customization options
   */
  async getAllCategories() {
    try {
      return await this.engine.getCategories();
    } catch (error) {
      console.error('MenuService: Error fetching categories:', error);
      throw new Error('Failed to fetch menu categories');
    }
  }

  /**
   * Get menu items for a specific category
   */
  async getCategoryMenu(categorySlug: string) {
    try {
      const items = await this.engine.getMenuData(categorySlug);
      if (!items || items.length === 0) {
        return null;
      }
      
      return {
        category: items[0].category,
        items
      };
    } catch (error) {
      console.error(`MenuService: Error fetching category ${categorySlug}:`, error);
      throw new Error(`Failed to fetch menu for category: ${categorySlug}`);
    }
  }

  /**
   * Validate and price a menu item selection
   */
  async validateAndPrice(selection: MenuItemSelection): Promise<{
    validation: ValidationResult;
    pricing: PricingResult | null;
  }> {
    try {
      const validation = await this.engine.validateSelections(selection);
      let pricing = null;

      if (validation.isValid) {
        pricing = await this.engine.calculatePrice(selection);
      }

      return { validation, pricing };
    } catch (error) {
      console.error('MenuService: Error validating selection:', error);
      throw new Error('Failed to validate menu selection');
    }
  }

  /**
   * Add item to cart with proper formatting
   */
  async addToCart(selection: MenuItemSelection): Promise<FormattedCartItem> {
    try {
      // First validate
      const validation = await this.engine.validateSelections(selection);
      if (!validation.isValid) {
        throw new Error(`Invalid selection: ${validation.errors.join(', ')}`);
      }

      // Format for cart
      return await this.engine.formatForCart(selection);
    } catch (error) {
      console.error('MenuService: Error adding to cart:', error);
      throw error; // Re-throw to preserve specific error messages
    }
  }

  /**
   * Handle dinner plate sides selection with special logic
   */
  async processDinnerPlateSides(mainItemId: string, selectedSideIds: string[]) {
    try {
      return await this.engine.getDinnerPlateSides(mainItemId, selectedSideIds);
    } catch (error) {
      console.error('MenuService: Error processing dinner plate sides:', error);
      throw new Error('Failed to process dinner plate sides');
    }
  }

  /**
   * Get customization options for a specific group
   */
  async getCustomizationOptions(groupId: string) {
    try {
      // This could be expanded to get specific group options
      // For now, it's handled through the main menu data fetching
      return await this.engine.getMenuData();
    } catch (error) {
      console.error('MenuService: Error fetching customization options:', error);
      throw new Error('Failed to fetch customization options');
    }
  }

  /**
   * Calculate price for multiple items (cart total)
   */
  async calculateCartTotal(selections: MenuItemSelection[]): Promise<{
    items: PricingResult[];
    subtotal: number;
    itemCount: number;
  }> {
    try {
      const items: PricingResult[] = [];
      let subtotal = 0;

      for (const selection of selections) {
        const pricing = await this.engine.calculatePrice(selection);
        items.push(pricing);
        subtotal += pricing.totalPrice;
      }

      return {
        items,
        subtotal,
        itemCount: selections.length
      };
    } catch (error) {
      console.error('MenuService: Error calculating cart total:', error);
      throw new Error('Failed to calculate cart total');
    }
  }

  /**
   * Get popular customizations for recommendations
   */
  async getPopularCustomizations(categorySlug: string) {
    // This would typically query order history for popular combinations
    // For now, return default/recommended options
    try {
      const items = await this.engine.getMenuData(categorySlug);
      if (!items || items.length === 0) return [];

      const recommendations = [];
      
      for (const item of items) {
        const defaultCustomizations = [];
        
        for (const itemCustomization of item.customizationGroups) {
          const group = itemCustomization.customizationGroup;
          const defaultOption = group.options.find(opt => opt.isDefault);
          
          if (defaultOption) {
            defaultCustomizations.push({
              customizationOptionId: defaultOption.id
            });
          }
        }

        if (defaultCustomizations.length > 0) {
          recommendations.push({
            menuItemId: item.id,
            name: item.name,
            customizations: defaultCustomizations
          });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('MenuService: Error getting popular customizations:', error);
      return [];
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.engine) {
      await this.engine.disconnect();
    }
  }
}

// Export singleton instance
export const menuService = MenuService.getInstance();
export default menuService;
