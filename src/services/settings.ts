import { BaseService } from './base';

export interface SettingValue {
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
}

export class SettingsService extends BaseService {
  
  // Get multiple settings by keys
  async getSettings(keys: string[]): Promise<Record<string, string>> {
    try {
      const settings = await this.db.appSetting.findMany({
        where: {
          key: { in: keys }
        }
      });

      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      this.handleError(error, 'Get Settings');
    }
  }

  // Get all settings
  async getAllSettings(): Promise<Record<string, any>> {
    try {
      const settings = await this.db.appSetting.findMany();

      return settings.reduce((acc, setting) => {
        let value: any = setting.value;
        
        // Convert based on type
        switch (setting.type) {
          case 'NUMBER':
            value = parseFloat(setting.value);
            break;
          case 'BOOLEAN':
            value = setting.value.toLowerCase() === 'true';
            break;
          case 'JSON':
            try {
              value = JSON.parse(setting.value);
            } catch {
              value = setting.value;
            }
            break;
          default:
            value = setting.value;
        }
        
        acc[setting.key] = value;
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      this.handleError(error, 'Get All Settings');
    }
  }

  // Update settings
  async updateSettings(updates: Record<string, any>): Promise<void> {
    try {
      await this.withTransaction(async (tx) => {
        for (const [key, value] of Object.entries(updates)) {
          // Determine type and convert value to string
          let stringValue: string;
          let type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' = 'STRING';

          if (typeof value === 'number') {
            stringValue = value.toString();
            type = 'NUMBER';
          } else if (typeof value === 'boolean') {
            stringValue = value.toString();
            type = 'BOOLEAN';
          } else if (typeof value === 'object' && value !== null) {
            stringValue = JSON.stringify(value);
            type = 'JSON';
          } else {
            stringValue = String(value);
            type = 'STRING';
          }

          await tx.appSetting.upsert({
            where: { key },
            update: { 
              value: stringValue,
              type,
              updatedAt: new Date()
            },
            create: { 
              key,
              value: stringValue,
              type
            }
          });
        }
      });
    } catch (error) {
      this.handleError(error, 'Update Settings');
    }
  }

  // Get single setting with type conversion
  async getSetting<T = string>(key: string, defaultValue?: T): Promise<T> {
    try {
      const setting = await this.db.appSetting.findUnique({
        where: { key }
      });

      if (!setting) {
        return defaultValue as T;
      }

      // Convert based on type
      switch (setting.type) {
        case 'NUMBER':
          return parseFloat(setting.value) as T;
        case 'BOOLEAN':
          return (setting.value.toLowerCase() === 'true') as T;
        case 'JSON':
          try {
            return JSON.parse(setting.value) as T;
          } catch {
            return setting.value as T;
          }
        default:
          return setting.value as T;
      }
    } catch (error) {
      this.handleError(error, 'Get Setting');
    }
  }

  // Pricing-specific helpers
  async getTaxRate(): Promise<number> {
    return this.getSetting<number>('taxRate', 8.25);
  }

  async getDeliveryFee(): Promise<number> {
    return this.getSetting<number>('deliveryFee', 3.99);
  }

  async getMinimumOrder(): Promise<number> {
    return this.getSetting<number>('minimumOrder', 15.00);
  }
}
