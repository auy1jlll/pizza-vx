// Performance Enhancement: Memory Cache Service with LRU
import { LRUCache } from 'lru-cache';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  max?: number; // Maximum number of items
}

export class CacheService {
  private static instance: CacheService;
  private caches: Map<string, LRUCache<string, any>>;

  private constructor() {
    this.caches = new Map();
    this.initializeDefaultCaches();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private initializeDefaultCaches(): void {
    // Prevent duplicate initialization if singleton reused (e.g. hot reload)
    if (this.caches.size > 0) {
      return; // Already initialized
    }
    // Toppings cache - Updated infrequently
    this.createCache('toppings', {
      ttl: 1000 * 60 * 30, // 30 minutes
      max: 100
    });

    // Specialty pizzas cache - Updated occasionally
    this.createCache('specialty-pizzas', {
      ttl: 1000 * 60 * 20, // 20 minutes
      max: 50
    });

    // Sizes cache - Rarely updated
    this.createCache('sizes', {
      ttl: 1000 * 60 * 60, // 1 hour
      max: 20
    });

    // Crusts cache - Rarely updated
    this.createCache('crusts', {
      ttl: 1000 * 60 * 60, // 1 hour
      max: 20
    });

    // Sauces cache - Rarely updated
    this.createCache('sauces', {
      ttl: 1000 * 60 * 60, // 1 hour
      max: 20
    });

    // Settings cache - Very rarely updated
    this.createCache('settings', {
      ttl: 1000 * 60 * 60 * 2, // 2 hours
      max: 50
    });

    // Pizza data cache - For complex aggregated data
    this.createCache('pizza-data', {
      ttl: 1000 * 60 * 15, // 15 minutes
      max: 10
    });

    // User preferences cache
    this.createCache('user-preferences', {
      ttl: 1000 * 60 * 10, // 10 minutes
      max: 1000
    });
  }

  public createCache(name: string, options: CacheOptions = {}): void {
    const cache = new LRUCache<string, any>({
      ttl: options.ttl || 1000 * 60 * 15, // Default 15 minutes
      max: options.max || 100,
      allowStale: false,
      updateAgeOnGet: true,
      updateAgeOnHas: false
    });

    this.caches.set(name, cache);
    console.log(`[Cache] Created cache: ${name} (TTL: ${options.ttl}ms, Max: ${options.max})`);
  }

  public get<T>(cacheName: string, key: string): T | undefined {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      console.warn(`[Cache] Cache not found: ${cacheName}`);
      return undefined;
    }

    const value = cache.get(key);
    if (value !== undefined) {
      console.log(`[Cache] HIT: ${cacheName}:${key}`);
    } else {
      console.log(`[Cache] MISS: ${cacheName}:${key}`);
    }
    
    return value;
  }

  public set<T>(cacheName: string, key: string, value: T): boolean {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      console.warn(`[Cache] Cache not found: ${cacheName}`);
      return false;
    }

    cache.set(key, value);
    console.log(`[Cache] SET: ${cacheName}:${key}`);
    return true;
  }

  public delete(cacheName: string, key: string): boolean {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      console.warn(`[Cache] Cache not found: ${cacheName}`);
      return false;
    }

    const deleted = cache.delete(key);
    if (deleted) {
      console.log(`[Cache] DELETE: ${cacheName}:${key}`);
    }
    return deleted;
  }

  public clear(cacheName: string): void {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      console.warn(`[Cache] Cache not found: ${cacheName}`);
      return;
    }

    cache.clear();
    console.log(`[Cache] CLEAR: ${cacheName}`);
  }

  public invalidate(cacheName: string, pattern?: string): void {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      console.warn(`[Cache] Cache not found: ${cacheName}`);
      return;
    }

    if (!pattern) {
      cache.clear();
      console.log(`[Cache] INVALIDATE ALL: ${cacheName}`);
      return;
    }

    // Invalidate keys matching pattern
    const keysToDelete: string[] = [];
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => cache.delete(key));
    console.log(`[Cache] INVALIDATE PATTERN: ${cacheName}:${pattern} (${keysToDelete.length} keys)`);
  }

  public getStats(cacheName: string): any {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      return null;
    }

    return {
      size: cache.size,
      max: cache.max,
      ttl: cache.ttl,
      calculatedSize: cache.calculatedSize
    };
  }

  public getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    for (const [name, cache] of this.caches) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }

  // Helper method for caching async operations
  public async getOrSet<T>(
    cacheName: string,
    key: string,
    factory: () => Promise<T>,
    ttlOverride?: number
  ): Promise<T> {
    const cached = this.get<T>(cacheName, key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    
    // Set with custom TTL if provided
    if (ttlOverride) {
      const cache = this.caches.get(cacheName);
      if (cache) {
        cache.set(key, value, { ttl: ttlOverride });
        console.log(`[Cache] SET with custom TTL: ${cacheName}:${key} (${ttlOverride}ms)`);
      }
    } else {
      this.set(cacheName, key, value);
    }

    return value;
  }

  // Warmup cache with commonly used data
  public async warmupCache(): Promise<void> {
    console.log('[Cache] Starting cache warmup...');
    
    try {
  // Use shared Prisma instance
  const { default: prisma } = await import('@/lib/prisma');

      // Warmup toppings
      const toppings = await prisma.pizzaTopping.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      this.set('toppings', 'all-available', toppings);

      // Warmup sizes
      const sizes = await prisma.pizzaSize.findMany({
        where: { isActive: true },
        orderBy: { diameter: 'asc' }
      });
      this.set('sizes', 'all-available', sizes);

      // Warmup crusts
      const crusts = await prisma.pizzaCrust.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      this.set('crusts', 'all-available', crusts);

      // Warmup sauces
      const sauces = await prisma.pizzaSauce.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      this.set('sauces', 'all-available', sauces);

      // Warmup specialty pizzas
      const specialtyPizzas = await prisma.specialtyPizza.findMany({
        where: { isActive: true },
        include: {
          sizes: {
            include: {
              pizzaSize: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });
      this.set('specialty-pizzas', 'all-available', specialtyPizzas);

  console.log('[Cache] Cache warmup completed successfully');
    } catch (error) {
      console.error('[Cache] Cache warmup failed:', error);
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Export cache keys for consistency
export const CACHE_KEYS = {
  TOPPINGS: {
    ALL_AVAILABLE: 'all-available',
    BY_CATEGORY: (category: string) => `category-${category}`,
    BY_ID: (id: string) => `id-${id}`
  },
  SPECIALTY_PIZZAS: {
    ALL_AVAILABLE: 'all-available',
    BY_ID: (id: string) => `id-${id}`,
    WITH_SIZES: 'with-sizes'
  },
  SIZES: {
    ALL_AVAILABLE: 'all-available',
    BY_ID: (id: string) => `id-${id}`
  },
  CRUSTS: {
    ALL_AVAILABLE: 'all-available',
    BY_ID: (id: string) => `id-${id}`
  },
  SAUCES: {
    ALL_AVAILABLE: 'all-available',
    BY_ID: (id: string) => `id-${id}`
  },
  SETTINGS: {
    ALL: 'all',
    BY_KEY: (key: string) => `key-${key}`
  },
  PIZZA_DATA: {
    COMPLETE: 'complete-data'
  },
  USER_PREFERENCES: {
    BY_USER: (userId: string) => `user-${userId}`
  }
} as const;
