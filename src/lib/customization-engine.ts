// Generic Customization Engine for Menu Categories
// Handles validation, pricing, and business logic for all menu types

import { PrismaClient } from '@prisma/client';

// Types for the customization engine
export interface CustomizationSelection {
  customizationOptionId: string;
  quantity?: number;
}

export interface MenuItemSelection {
  menuItemId: string;
  customizations: CustomizationSelection[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PricingResult {
  basePrice: number;
  customizationPrice: number;
  totalPrice: number;
  breakdown: PriceBreakdownItem[];
}

export interface PriceBreakdownItem {
  name: string;
  price: number;
  type: 'base' | 'customization';
  quantity?: number;
}

export interface FormattedCartItem {
  menuItemId: string;
  menuItemName: string;
  categoryName: string;
  basePrice: number;
  totalPrice: number;
  customizations: FormattedCustomization[];
  notes?: string;
}

export interface FormattedCustomization {
  groupName: string;
  selections: Array<{
    optionName: string;
    price: number;
    quantity?: number;
  }>;
}

export class CustomizationEngine {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get all available menu items with their customization options
   */
  async getMenuData(categorySlug?: string) {
    const where = categorySlug ? { 
      category: { 
        slug: categorySlug,
        isActive: true 
      } 
    } : {};

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        isActive: true,
        isAvailable: true,
        ...where
      },
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return menuItems;
  }

  /**
   * Get all categories with their customization groups
   */
  async getCategories() {
    return await this.prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        customizationGroups: {
          include: {
            options: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { sortOrder: 'asc' }
        },
        subcategories: {
          where: { isActive: true },
          include: {
            _count: {
              select: { menuItems: true }
            }
          },
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
  }

  /**
   * Get specific category by slug
   */
  async getCategoryBySlug(slug: string) {
    return await this.prisma.menuCategory.findUnique({
      where: { slug: slug, isActive: true }
    });
  }

  /**
   * Validate customization selections for a menu item
   */
  async validateSelections(selection: MenuItemSelection): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Get menu item with customization requirements
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: selection.menuItemId },
        include: {
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  options: { where: { isActive: true } }
                }
              }
            }
          }
        }
      });

      if (!menuItem) {
        errors.push('Menu item not found');
        return { isValid: false, errors, warnings };
      }

      // Validate each customization group
      for (const itemCustomization of menuItem.customizationGroups) {
        const group = itemCustomization.customizationGroup;
        const groupSelections = selection.customizations.filter(c => 
          group.options.some(opt => opt.id === c.customizationOptionId)
        );

        // Check required groups
        if (itemCustomization.isRequired && groupSelections.length === 0) {
          errors.push(`${group.name} is required`);
          continue;
        }

        // Check minimum selections
        if (group.minSelections > 0 && groupSelections.length < group.minSelections) {
          errors.push(`${group.name} requires at least ${group.minSelections} selection${group.minSelections > 1 ? 's' : ''}`);
        }

        // Check maximum selections
        if (group.maxSelections && groupSelections.length > group.maxSelections) {
          errors.push(`${group.name} allows maximum ${group.maxSelections} selection${group.maxSelections > 1 ? 's' : ''}`);
        }

        // Special logic for dinner plates "2 of 3" sides
        if (group.type === 'SPECIAL_LOGIC' && group.name.includes('Choose 2 of 3')) {
          if (groupSelections.length !== 2) {
            errors.push('You must choose exactly 2 sides for dinner plates');
          }
          
          // Ensure no duplicate selections
          const uniqueSelections = new Set(groupSelections.map(s => s.customizationOptionId));
          if (uniqueSelections.size !== groupSelections.length) {
            errors.push('Cannot select the same side twice');
          }
        }

        // Validate individual options
        for (const sel of groupSelections) {
          const option = group.options.find(opt => opt.id === sel.customizationOptionId);
          if (!option) {
            errors.push(`Invalid customization option selected in ${group.name}`);
            continue;
          }

          // Check quantity limits
          if (option.maxQuantity && sel.quantity && sel.quantity > option.maxQuantity) {
            errors.push(`${option.name} maximum quantity is ${option.maxQuantity}`);
          }

          // Validate quantity for quantity-based options
          if (group.type === 'QUANTITY_SELECT') {
            if (!sel.quantity || sel.quantity < 1) {
              errors.push(`${option.name} requires a quantity of at least 1`);
            }
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        errors: ['An error occurred during validation'],
        warnings
      };
    }
  }

  /**
   * Calculate total price including all customizations
   */
  async calculatePrice(selection: MenuItemSelection): Promise<PricingResult> {
    try {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: selection.menuItemId }
      });

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      const breakdown: PriceBreakdownItem[] = [
        {
          name: menuItem.name,
          price: menuItem.basePrice,
          type: 'base'
        }
      ];

      let customizationPrice = 0;

      // Calculate customization costs
      for (const customization of selection.customizations) {
        const option = await this.prisma.customizationOption.findUnique({
          where: { id: customization.customizationOptionId }
        });

        if (!option) continue;

        const quantity = customization.quantity || 1;
        let optionPrice = 0;

        switch (option.priceType) {
          case 'FLAT':
            optionPrice = option.priceModifier * quantity;
            break;
          case 'PERCENTAGE':
            optionPrice = (menuItem.basePrice * option.priceModifier / 100) * quantity;
            break;
          case 'PER_UNIT':
            optionPrice = option.priceModifier * quantity;
            break;
        }

        customizationPrice += optionPrice;

        if (optionPrice !== 0) {
          breakdown.push({
            name: option.name,
            price: optionPrice,
            type: 'customization',
            quantity: quantity > 1 ? quantity : undefined
          });
        }
      }

      return {
        basePrice: menuItem.basePrice,
        customizationPrice,
        totalPrice: menuItem.basePrice + customizationPrice,
        breakdown
      };

    } catch (error) {
      console.error('Pricing calculation error:', error);
      throw new Error('Failed to calculate price');
    }
  }

  /**
   * Format customizations for cart display
   */
  async formatForCart(selection: MenuItemSelection): Promise<FormattedCartItem> {
    try {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: selection.menuItemId },
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

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      const pricing = await this.calculatePrice(selection);
      const customizations: FormattedCustomization[] = [];

      // Group customizations by their groups
      const groupMap = new Map<string, FormattedCustomization>();

      for (const customization of selection.customizations) {
        // Find which group this option belongs to
        let foundGroup = null;
        let foundOption = null;

        for (const itemCustomization of menuItem.customizationGroups) {
          const group = itemCustomization.customizationGroup;
          const option = group.options.find(opt => opt.id === customization.customizationOptionId);
          if (option) {
            foundGroup = group;
            foundOption = option;
            break;
          }
        }

        if (!foundGroup || !foundOption) continue;

        if (!groupMap.has(foundGroup.id)) {
          groupMap.set(foundGroup.id, {
            groupName: foundGroup.name,
            selections: []
          });
        }

        const formattedGroup = groupMap.get(foundGroup.id)!;
        const quantity = customization.quantity || 1;
        let optionPrice = 0;

        switch (foundOption.priceType) {
          case 'FLAT':
            optionPrice = foundOption.priceModifier * quantity;
            break;
          case 'PERCENTAGE':
            optionPrice = (menuItem.basePrice * foundOption.priceModifier / 100) * quantity;
            break;
          case 'PER_UNIT':
            optionPrice = foundOption.priceModifier * quantity;
            break;
        }

        formattedGroup.selections.push({
          optionName: foundOption.name,
          price: optionPrice,
          quantity: quantity > 1 ? quantity : undefined
        });
      }

      customizations.push(...Array.from(groupMap.values()));

      return {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        categoryName: menuItem.category.name,
        basePrice: menuItem.basePrice,
        totalPrice: pricing.totalPrice,
        customizations
      };

    } catch (error) {
      console.error('Format for cart error:', error);
      throw new Error('Failed to format item for cart');
    }
  }

  /**
   * Get dinner plate sides with special "2 of 3" logic
   */
  async getDinnerPlateSides(mainItemId: string, selectedSideIds: string[]) {
    try {
      // Get the dinner plate item
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: mainItemId },
        include: {
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  options: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                  }
                }
              }
            }
          }
        }
      });

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      // Find the sides customization group
      const sidesGroup = menuItem.customizationGroups.find(
        ic => ic.customizationGroup.type === 'SPECIAL_LOGIC'
      );

      if (!sidesGroup) {
        throw new Error('No sides customization found for this dinner plate');
      }

      const availableSides = sidesGroup.customizationGroup.options;
      const selectedSides = availableSides.filter(side => 
        selectedSideIds.includes(side.id)
      );

      return {
        availableSides,
        selectedSides,
        remainingSelections: Math.max(0, 2 - selectedSides.length),
        isComplete: selectedSides.length === 2,
        isValid: selectedSides.length <= 2 && new Set(selectedSideIds).size === selectedSideIds.length
      };

    } catch (error) {
      console.error('Get dinner plate sides error:', error);
      throw new Error('Failed to process dinner plate sides');
    }
  }

  /**
   * Cleanup resources
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

export default CustomizationEngine;
