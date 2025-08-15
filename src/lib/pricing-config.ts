// Dynamic Pricing Configuration Utility
// Replaces hardcoded pricing values with database-driven settings

export interface PricingConfig {
  // Tax & Fees
  taxRate: number;
  deliveryFee: number;
  minimumOrder: number;
  
  // Timing
  preparationTime: number;
  deliveryTimeBuffer: number;
  
  // Intensity Multipliers
  intensityLightMultiplier: number;
  intensityRegularMultiplier: number;
  intensityExtraMultiplier: number;
  
  // Business Logic
  removalCreditPercentage: number;
  
  // Features
  showPricingBreakdown: boolean;
  allowRemovalCredits: boolean;
}

// Default fallback values (used if database settings are unavailable)
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  taxRate: 8.25,
  deliveryFee: 3.99,
  minimumOrder: 15.00,
  preparationTime: 25,
  deliveryTimeBuffer: 10,
  intensityLightMultiplier: 0.75,
  intensityRegularMultiplier: 1.0,
  intensityExtraMultiplier: 1.5,
  removalCreditPercentage: 0.5,
  showPricingBreakdown: true,
  allowRemovalCredits: true
};

// Cache for pricing config to avoid repeated database calls
let cachedConfig: PricingConfig | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Load pricing configuration from database with caching
 */
export async function loadPricingConfig(): Promise<PricingConfig> {
  // Return cached config if still valid
  if (cachedConfig && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/api/admin/settings');
    if (response.ok) {
      const data = await response.json();
      const settings = data.settings || {};
      
      const config: PricingConfig = {
        taxRate: parseFloat(settings.taxRate || DEFAULT_PRICING_CONFIG.taxRate.toString()),
        deliveryFee: parseFloat(settings.deliveryFee || DEFAULT_PRICING_CONFIG.deliveryFee.toString()),
        minimumOrder: parseFloat(settings.minimumOrder || DEFAULT_PRICING_CONFIG.minimumOrder.toString()),
        preparationTime: parseInt(settings.preparationTime || DEFAULT_PRICING_CONFIG.preparationTime.toString()),
        deliveryTimeBuffer: parseInt(settings.deliveryTimeBuffer || DEFAULT_PRICING_CONFIG.deliveryTimeBuffer.toString()),
        intensityLightMultiplier: parseFloat(settings.intensityLightMultiplier || DEFAULT_PRICING_CONFIG.intensityLightMultiplier.toString()),
        intensityRegularMultiplier: parseFloat(settings.intensityRegularMultiplier || DEFAULT_PRICING_CONFIG.intensityRegularMultiplier.toString()),
        intensityExtraMultiplier: parseFloat(settings.intensityExtraMultiplier || DEFAULT_PRICING_CONFIG.intensityExtraMultiplier.toString()),
        removalCreditPercentage: parseFloat(settings.removalCreditPercentage || DEFAULT_PRICING_CONFIG.removalCreditPercentage.toString()),
        showPricingBreakdown: settings.showPricingBreakdown === 'true',
        allowRemovalCredits: settings.allowRemovalCredits === 'true'
      };
      
      // Cache the config
      cachedConfig = config;
      cacheTimestamp = Date.now();
      
      return config;
    }
  } catch (error) {
    console.error('Failed to load pricing config:', error);
  }
  
  // Return defaults if anything fails
  return DEFAULT_PRICING_CONFIG;
}

/**
 * Get intensity multiplier for a given intensity level
 */
export function getIntensityMultiplier(intensity: 'LIGHT' | 'REGULAR' | 'EXTRA', config: PricingConfig): number {
  switch (intensity) {
    case 'LIGHT': return config.intensityLightMultiplier;
    case 'EXTRA': return config.intensityExtraMultiplier;
    case 'REGULAR':
    default: return config.intensityRegularMultiplier;
  }
}

/**
 * Calculate topping price with intensity
 */
export function calculateToppingPrice(basePrice: number, intensity: 'LIGHT' | 'REGULAR' | 'EXTRA', quantity: number, config: PricingConfig): number {
  const multiplier = getIntensityMultiplier(intensity, config);
  return basePrice * multiplier * quantity;
}

/**
 * Calculate removal credit for a topping
 */
export function calculateRemovalCredit(basePrice: number, intensity: 'LIGHT' | 'REGULAR' | 'EXTRA', config: PricingConfig): number {
  if (!config.allowRemovalCredits) return 0;
  
  const multiplier = getIntensityMultiplier(intensity, config);
  return basePrice * multiplier * config.removalCreditPercentage;
}

/**
 * Calculate estimated time based on order type and preparation time
 */
export function calculateEstimatedTime(orderType: 'PICKUP' | 'DELIVERY', config: PricingConfig): string {
  const baseTime = config.preparationTime;
  
  if (orderType === 'DELIVERY') {
    const min = baseTime + config.deliveryTimeBuffer;
    const max = min + 10;
    return `${min}-${max} minutes`;
  } else {
    const min = baseTime;
    const max = baseTime + 10;
    return `${min}-${max} minutes`;
  }
}

/**
 * Clear the pricing config cache (useful when settings are updated)
 */
export function clearPricingCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

export default {
  loadPricingConfig,
  getIntensityMultiplier,
  calculateToppingPrice,
  calculateRemovalCredit,
  calculateEstimatedTime,
  clearPricingCache,
  DEFAULT_PRICING_CONFIG
};
