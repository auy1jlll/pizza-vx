// Kitchen Display Configuration Helper
export class KitchenConfig {
  private static lastConfigUpdate: number = 0;
  private static configCacheDuration: number = 30000; // 30 seconds cache
  private static cachedPollingInterval: number = 35; // Default 35 seconds

  static async getPollingInterval(): Promise<number> {
    try {
      const now = Date.now();
      
      // Return cached value if still fresh
      if (now - this.lastConfigUpdate < this.configCacheDuration) {
        return this.cachedPollingInterval * 1000; // Convert to milliseconds
      }

      // Fetch fresh settings
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        console.warn('Failed to load kitchen polling config, using default 35 seconds');
        return this.cachedPollingInterval * 1000;
      }

      const data = await response.json();
      const settings = data.settings || {};
      
      const pollingSeconds = parseInt(settings.kitchenPollingIntervalSeconds || '35');
      
      // Update cache
      if (pollingSeconds !== this.cachedPollingInterval) {
        console.log(`🔄 Kitchen display polling interval updated: ${pollingSeconds} seconds`);
        this.cachedPollingInterval = pollingSeconds;
      }
      
      this.lastConfigUpdate = now;
      return pollingSeconds * 1000; // Convert to milliseconds
      
    } catch (error) {
      console.error('Error loading kitchen polling config:', error);
      return this.cachedPollingInterval * 1000; // Default fallback
    }
  }

  static getPollingIntervalSync(): number {
    return this.cachedPollingInterval * 1000; // Convert to milliseconds
  }
}
