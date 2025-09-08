// Dynamic Rate Limiter that reads configuration from database settings
import { SimpleRateLimiter } from './simple-rate-limit';

interface RateLimiterConfig {
  windowMs: number;
  max: number;
}

class ConfigurableRateLimiter {
  private limiter: SimpleRateLimiter;
  private lastConfigUpdate: number = 0;
  private configCacheDuration: number = 60000; // 1 minute cache
  private defaultConfig: RateLimiterConfig;
  private configKey: string;

  constructor(configKey: string, defaultConfig: RateLimiterConfig) {
    this.configKey = configKey;
    this.defaultConfig = defaultConfig;
    this.limiter = new SimpleRateLimiter(defaultConfig);
  }

  private async loadConfig(): Promise<RateLimiterConfig> {
    try {
      // Check if we need to refresh the config
      const now = Date.now();
      if (now - this.lastConfigUpdate < this.configCacheDuration) {
        return this.defaultConfig; // Use cached/current config
      }

      // Fetch settings from API
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/api/admin/settings`);
      if (!response.ok) {
        console.warn(`Failed to load rate limit config for ${this.configKey}, using defaults`);
        return this.defaultConfig;
      }

      const data = await response.json();
      const settings = data.settings || {};

      let windowMs = this.defaultConfig.windowMs;
      let max = this.defaultConfig.max;

      // Map config keys to setting keys
      if (this.configKey === 'admin') {
        const windowSeconds = parseInt(settings.adminRateLimitWindowSeconds || '900');
        windowMs = windowSeconds * 1000;
        max = parseInt(settings.adminRateLimitMaxRequests || '200');
      } else if (this.configKey === 'general') {
        const windowSeconds = parseInt(settings.rateLimitWindowSeconds || '900');
        windowMs = windowSeconds * 1000;
        max = parseInt(settings.rateLimitMaxRequests || '100');
      }

      const newConfig = { windowMs, max };
      
      // Update the limiter if config changed
      if (newConfig.windowMs !== this.defaultConfig.windowMs || newConfig.max !== this.defaultConfig.max) {
        console.log(`🔄 Updating ${this.configKey} rate limiter: ${max} requests per ${windowMs/1000} seconds`);
        this.limiter = new SimpleRateLimiter(newConfig);
        this.defaultConfig = newConfig;
      }

      this.lastConfigUpdate = now;
      return newConfig;
    } catch (error) {
      console.error(`Error loading rate limit config for ${this.configKey}:`, error);
      return this.defaultConfig;
    }
  }

  async check(route: string, ip?: string) {
    // Load fresh config if needed
    await this.loadConfig();
    return this.limiter.check(route, ip);
  }
}

// Create configurable rate limiters
export const configurableAdminLimiter = new ConfigurableRateLimiter('admin', { 
  windowMs: 15 * 60 * 1000, 
  max: 200 
});

export const configurableGeneralLimiter = new ConfigurableRateLimiter('general', { 
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

// Keep existing static limiters for compatibility
export const orderLimiter = new SimpleRateLimiter({ windowMs: 5 * 60 * 1000, max: 5 });
export const authLimiter = new SimpleRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

// Export the old adminLimiter for backward compatibility, but it now uses configurable version
export const adminLimiter = {
  check: (route: string, ip?: string) => configurableAdminLimiter.check(route, ip)
};
