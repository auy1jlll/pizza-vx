/**
 * Menu System Validation Library
 * Comprehensive validation for all menu-related record creation
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface MenuCategoryData {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface MenuItemData {
  name: string;
  categoryId: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  sortOrder?: number;
  preparationTime?: number;
  allergens?: string;
  nutritionInfo?: string;
}

export interface CustomizationGroupData {
  name: string;
  categoryId?: string;
  description?: string;
  type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'QUANTITY_SELECT' | 'SPECIAL_LOGIC';
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CustomizationOptionData {
  name: string;
  groupId: string;
  description?: string;
  priceModifier?: number;
  priceType?: 'FLAT' | 'PERCENTAGE' | 'PER_UNIT';
  isDefault?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  maxQuantity?: number;
  nutritionInfo?: string;
  allergens?: string;
}

/**
 * Common validation utilities
 */
class ValidationUtils {
  static isValidString(value: any, minLength = 1, maxLength = 255): boolean {
    return typeof value === 'string' && 
           value.trim().length >= minLength && 
           value.trim().length <= maxLength;
  }

  static isValidNumber(value: any, min?: number, max?: number): boolean {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof num !== 'number' || isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  }

  static isValidPrice(value: any): boolean {
    return this.isValidNumber(value, 0) && Number(value) >= 0;
  }

  static sanitizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static isValidUrl(url: string): boolean {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidJSON(jsonString: string): boolean {
    if (!jsonString) return true; // Optional field
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Menu Category Validation
 */
export class MenuCategoryValidator {
  static validate(data: MenuCategoryData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field: name
    if (!data.name || !ValidationUtils.isValidString(data.name, 1, 100)) {
      errors.push('Category name is required and must be 1-100 characters long');
    } else {
      data.name = ValidationUtils.sanitizeName(data.name);
    }

    // Required field: slug
    if (!data.slug || !ValidationUtils.isValidString(data.slug, 1, 100)) {
      errors.push('Category slug is required and must be 1-100 characters long');
    } else {
      // Validate slug format
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(data.slug)) {
        errors.push('Category slug must contain only lowercase letters, numbers, and hyphens');
      }
    }

    // Optional but validated fields
    if (data.description && !ValidationUtils.isValidString(data.description, 0, 500)) {
      errors.push('Category description must be under 500 characters');
    }

    if (data.imageUrl && !ValidationUtils.isValidUrl(data.imageUrl)) {
      errors.push('Category image URL must be a valid URL');
    }

    if (data.sortOrder !== undefined && !ValidationUtils.isValidNumber(data.sortOrder, 0)) {
      errors.push('Category sort order must be a non-negative number');
    }

    // Warnings
    if (data.name && data.name.length < 3) {
      warnings.push('Category name is very short - consider a more descriptive name');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Menu Item Validation
 */
export class MenuItemValidator {
  static validate(data: MenuItemData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field: name
    if (!data.name || !ValidationUtils.isValidString(data.name, 1, 150)) {
      errors.push('Item name is required and must be 1-150 characters long');
    } else {
      data.name = ValidationUtils.sanitizeName(data.name);
    }

    // Required field: categoryId
    if (!data.categoryId || !ValidationUtils.isValidString(data.categoryId)) {
      errors.push('Category ID is required');
    }

    // Required field: basePrice
    if (data.basePrice === undefined || data.basePrice === null || !ValidationUtils.isValidPrice(data.basePrice)) {
      errors.push('Base price is required and must be a non-negative number');
    }

    // Optional but validated fields
    if (data.description && !ValidationUtils.isValidString(data.description, 0, 1000)) {
      errors.push('Item description must be under 1000 characters');
    }

    if (data.imageUrl && !ValidationUtils.isValidUrl(data.imageUrl)) {
      errors.push('Item image URL must be a valid URL');
    }

    if (data.preparationTime !== undefined && !ValidationUtils.isValidNumber(data.preparationTime, 1, 180)) {
      errors.push('Preparation time must be between 1 and 180 minutes');
    }

    if (data.sortOrder !== undefined && !ValidationUtils.isValidNumber(data.sortOrder, 0)) {
      errors.push('Item sort order must be a non-negative number');
    }

    if (data.allergens && !ValidationUtils.isValidJSON(data.allergens)) {
      errors.push('Allergens must be valid JSON format');
    }

    if (data.nutritionInfo && !ValidationUtils.isValidJSON(data.nutritionInfo)) {
      errors.push('Nutrition info must be valid JSON format');
    }

    // Warnings
    if (data.name && data.name.length < 3) {
      warnings.push('Item name is very short - consider a more descriptive name');
    }

    if (data.basePrice && data.basePrice > 100) {
      warnings.push('Item price is unusually high - please verify');
    }

    if (!data.description) {
      warnings.push('Consider adding a description to help customers understand the item');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Customization Group Validation
 */
export class CustomizationGroupValidator {
  static validate(data: CustomizationGroupData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field: name
    if (!data.name || !ValidationUtils.isValidString(data.name, 1, 100)) {
      errors.push('Customization group name is required and must be 1-100 characters long');
    } else {
      data.name = ValidationUtils.sanitizeName(data.name);
    }

    // Required field: type
    const validTypes = ['SINGLE_SELECT', 'MULTI_SELECT', 'QUANTITY_SELECT', 'SPECIAL_LOGIC'];
    if (!data.type || !validTypes.includes(data.type)) {
      errors.push('Customization group type is required and must be one of: ' + validTypes.join(', '));
    }

    // Optional but validated fields
    if (data.description && !ValidationUtils.isValidString(data.description, 0, 500)) {
      errors.push('Customization group description must be under 500 characters');
    }

    if (data.minSelections !== undefined && !ValidationUtils.isValidNumber(data.minSelections, 0)) {
      errors.push('Minimum selections must be a non-negative number');
    }

    if (data.maxSelections !== undefined && !ValidationUtils.isValidNumber(data.maxSelections, 1)) {
      errors.push('Maximum selections must be a positive number');
    }

    if (data.sortOrder !== undefined && !ValidationUtils.isValidNumber(data.sortOrder, 0)) {
      errors.push('Customization group sort order must be a non-negative number');
    }

    // Logic validation
    if (data.minSelections !== undefined && data.maxSelections !== undefined) {
      if (data.minSelections > data.maxSelections) {
        errors.push('Minimum selections cannot be greater than maximum selections');
      }
    }

    if (data.type === 'SINGLE_SELECT' && data.maxSelections !== undefined && data.maxSelections !== 1) {
      warnings.push('Single select groups typically have a maximum of 1 selection');
    }

    if (data.isRequired && data.minSelections === 0) {
      warnings.push('Required groups should have minimum selections > 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Customization Option Validation
 */
export class CustomizationOptionValidator {
  static validate(data: CustomizationOptionData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field: name
    if (!data.name || !ValidationUtils.isValidString(data.name, 1, 100)) {
      errors.push('Customization option name is required and must be 1-100 characters long');
    } else {
      data.name = ValidationUtils.sanitizeName(data.name);
    }

    // Required field: groupId
    if (!data.groupId || !ValidationUtils.isValidString(data.groupId)) {
      errors.push('Group ID is required');
    }

    // Optional but validated fields
    if (data.description && !ValidationUtils.isValidString(data.description, 0, 500)) {
      errors.push('Customization option description must be under 500 characters');
    }

    if (data.priceModifier !== undefined && !ValidationUtils.isValidNumber(data.priceModifier, -100, 100)) {
      errors.push('Price modifier must be between -100 and 100');
    }

    const validPriceTypes = ['FLAT', 'PERCENTAGE', 'PER_UNIT'];
    if (data.priceType && !validPriceTypes.includes(data.priceType)) {
      errors.push('Price type must be one of: ' + validPriceTypes.join(', '));
    }

    if (data.maxQuantity !== undefined && !ValidationUtils.isValidNumber(data.maxQuantity, 1)) {
      errors.push('Maximum quantity must be a positive number');
    }

    if (data.sortOrder !== undefined && !ValidationUtils.isValidNumber(data.sortOrder, 0)) {
      errors.push('Customization option sort order must be a non-negative number');
    }

    if (data.nutritionInfo && !ValidationUtils.isValidJSON(data.nutritionInfo)) {
      errors.push('Nutrition info must be valid JSON format');
    }

    if (data.allergens && !ValidationUtils.isValidJSON(data.allergens)) {
      errors.push('Allergens must be valid JSON format');
    }

    // Warnings
    if (data.name && data.name.length < 2) {
      warnings.push('Option name is very short - consider a more descriptive name');
    }

    if (data.priceModifier && Math.abs(data.priceModifier) > 20) {
      warnings.push('Price modifier is unusually high - please verify');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Main validator that combines all validation functions
 */
export class MenuValidator {
  static validateCategory(data: MenuCategoryData): ValidationResult {
    return MenuCategoryValidator.validate(data);
  }

  static validateItem(data: MenuItemData): ValidationResult {
    return MenuItemValidator.validate(data);
  }

  static validateCustomizationGroup(data: CustomizationGroupData): ValidationResult {
    return CustomizationGroupValidator.validate(data);
  }

  static validateCustomizationOption(data: CustomizationOptionData): ValidationResult {
    return CustomizationOptionValidator.validate(data);
  }

  static formatValidationResponse(result: ValidationResult, entity: string) {
    if (result.isValid) {
      const response: any = { success: true };
      if (result.warnings && result.warnings.length > 0) {
        response.warnings = result.warnings;
      }
      return response;
    } else {
      return {
        success: false,
        error: `${entity} validation failed`,
        details: result.errors,
        warnings: result.warnings
      };
    }
  }
}
