// Performance Enhancement: Memoized Price Calculation Service
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

export interface PizzaConfiguration {
  sizeId: string;
  crustId: string;
  sauceId: string;
  toppings: Array<{ id: string; quantity: number }>;
  specialtyPizzaId?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  crustPrice: number;
  saucePrice: number;
  toppingsPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
}

export interface PizzaData {
  sizes: Array<{ id: string; name: string; basePrice: number }>;
  crusts: Array<{ id: string; name: string; priceModifier: number }>;
  sauces: Array<{ id: string; name: string; priceModifier: number }>;
  toppings: Array<{ id: string; name: string; price: number }>;
  specialtyPizzas?: Array<{ id: string; name: string; basePrice: number }>;
}

// LRU Cache for price calculations
class PriceCache {
  private cache = new Map<string, PriceBreakdown>();
  private maxSize = 1000;

  private generateKey(config: PizzaConfiguration): string {
    const toppingsKey = config.toppings
      .map(t => `${t.id}:${t.quantity}`)
      .sort()
      .join(',');
    
    return `${config.sizeId}|${config.crustId}|${config.sauceId}|${toppingsKey}|${config.specialtyPizzaId || ''}`;
  }

  get(config: PizzaConfiguration): PriceBreakdown | undefined {
    const key = this.generateKey(config);
    const value = this.cache.get(key);
    
    if (value) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, value);
      console.log(`[PriceCache] HIT: ${key}`);
    } else {
      console.log(`[PriceCache] MISS: ${key}`);
    }
    
    return value;
  }

  set(config: PizzaConfiguration, price: PriceBreakdown): void {
    const key = this.generateKey(config);
    
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, price);
    console.log(`[PriceCache] SET: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    console.log('[PriceCache] CLEARED');
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // TODO: Track hit rate
    };
  }
}

// Global price cache instance
const priceCache = new PriceCache();

// Core price calculation function
export function calculatePizzaPrice(
  config: PizzaConfiguration,
  data: PizzaData,
  taxRate: number = 0.0825 // Updated to match database setting (8.25%)
): PriceBreakdown {
  // Check cache first
  const cached = priceCache.get(config);
  if (cached) {
    return cached;
  }

  // Calculate from scratch
  const size = data.sizes.find(s => s.id === config.sizeId);
  const crust = data.crusts.find(c => c.id === config.crustId);
  const sauce = data.sauces.find(s => s.id === config.sauceId);
  
  if (!size || !crust || !sauce) {
    throw new Error('Invalid pizza configuration: missing required components');
  }

  let basePrice = size.basePrice;
  
  // Check if this is a specialty pizza
  if (config.specialtyPizzaId) {
    const specialtyPizza = data.specialtyPizzas?.find(p => p.id === config.specialtyPizzaId);
    if (specialtyPizza) {
      basePrice = specialtyPizza.basePrice;
    }
  }

  const crustPrice = crust.priceModifier;
  const saucePrice = sauce.priceModifier;
  
  // Calculate toppings price
  let toppingsPrice = 0;
  for (const topping of config.toppings) {
    const toppingData = data.toppings.find(t => t.id === topping.id);
    if (toppingData) {
      toppingsPrice += toppingData.price * topping.quantity;
    }
  }

  const subtotal = basePrice + crustPrice + saucePrice + toppingsPrice;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const breakdown: PriceBreakdown = {
    basePrice,
    crustPrice,
    saucePrice,
    toppingsPrice,
    subtotal,
    tax,
    total
  };

  // Cache the result
  priceCache.set(config, breakdown);

  return breakdown;
}

// Debounced price calculation hook for React components
export function useDebouncedPriceCalculation(
  config: PizzaConfiguration,
  data: PizzaData | null,
  debounceMs: number = 300
) {
  const debouncedCalculate = useCallback(
    debounce((config: PizzaConfiguration, data: PizzaData) => {
      return calculatePizzaPrice(config, data);
    }, debounceMs),
    [debounceMs]
  );

  const priceBreakdown = useMemo(() => {
    if (!data || !config.sizeId || !config.crustId || !config.sauceId) {
      return null;
    }

    try {
      return calculatePizzaPrice(config, data);
    } catch (error) {
      console.error('[Price] Calculation error:', error);
      return null;
    }
  }, [config, data]);

  return priceBreakdown;
}

// Optimized price calculation hook with memoization
export function useMemoizedPriceCalculation(
  config: PizzaConfiguration,
  data: PizzaData | null
) {
  const priceBreakdown = useMemo(() => {
    if (!data || !config.sizeId || !config.crustId || !config.sauceId) {
      return null;
    }

    try {
      return calculatePizzaPrice(config, data);
    } catch (error) {
      console.error('[Price] Calculation error:', error);
      return null;
    }
  }, [
    config.sizeId,
    config.crustId,
    config.sauceId,
    JSON.stringify(config.toppings), // Deep comparison for toppings array
    config.specialtyPizzaId,
    data
  ]);

  return priceBreakdown;
}

// Batch price calculation for multiple pizzas (e.g., cart)
export function calculateBatchPrices(
  configurations: PizzaConfiguration[],
  data: PizzaData,
  taxRate?: number
): PriceBreakdown[] {
  return configurations.map(config => 
    calculatePizzaPrice(config, data, taxRate)
  );
}

// Order total calculation with discounts
export function calculateOrderTotal(
  priceBreakdowns: PriceBreakdown[],
  discountAmount: number = 0,
  deliveryFee: number = 0
): {
  subtotal: number;
  tax: number;
  discount: number;
  deliveryFee: number;
  total: number;
} {
  const subtotal = priceBreakdowns.reduce((sum, price) => sum + price.subtotal, 0);
  const tax = priceBreakdowns.reduce((sum, price) => sum + price.tax, 0);
  const total = subtotal + tax - discountAmount + deliveryFee;

  return {
    subtotal,
    tax,
    discount: discountAmount,
    deliveryFee,
    total: Math.max(0, total) // Ensure non-negative total
  };
}

// Cache management utilities
export const PriceCacheManager = {
  clear: () => priceCache.clear(),
  getStats: () => priceCache.getStats(),
  
  // Warm up cache with common configurations
  warmup: (data: PizzaData) => {
    console.log('[PriceCache] Warming up cache...');
    
    const commonConfigs: PizzaConfiguration[] = [
      // Pepperoni pizza variations
      {
        sizeId: data.sizes[0]?.id || '',
        crustId: data.crusts[0]?.id || '',
        sauceId: data.sauces[0]?.id || '',
        toppings: [{ id: data.toppings.find(t => t.name.toLowerCase().includes('pepperoni'))?.id || '', quantity: 1 }]
      },
      // Cheese pizza
      {
        sizeId: data.sizes[1]?.id || '',
        crustId: data.crusts[1]?.id || '',
        sauceId: data.sauces[0]?.id || '',
        toppings: []
      },
      // Supreme pizza
      {
        sizeId: data.sizes[2]?.id || '',
        crustId: data.crusts[0]?.id || '',
        sauceId: data.sauces[0]?.id || '',
        toppings: [
          { id: data.toppings[0]?.id || '', quantity: 1 },
          { id: data.toppings[1]?.id || '', quantity: 1 },
          { id: data.toppings[2]?.id || '', quantity: 1 }
        ]
      }
    ];

    commonConfigs.forEach(config => {
      try {
        calculatePizzaPrice(config, data);
      } catch (error) {
        // Ignore errors during warmup
      }
    });
    
    console.log('[PriceCache] Warmup completed');
  }
};
