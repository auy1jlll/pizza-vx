import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

interface RetryOptions {
  retries?: number;
  delay?: number;
  backoff?: boolean;
}

/**
 * Enhanced database operations with retry logic and better error handling
 */
export class EnhancedPrismaClient {
  private client: PrismaClient;
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private readonly healthCheckInterval: number = 30000; // 30 seconds

  constructor() {
    this.client = prisma;
    this.setupHealthCheck();
  }

  private setupHealthCheck() {
    // Periodic health check in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => this.checkHealth(), this.healthCheckInterval);
    }
  }

  private async checkHealth(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      this.isHealthy = true;
      this.lastHealthCheck = Date.now();
      return true;
    } catch (error) {
      console.warn('Database health check failed:', error);
      this.isHealthy = false;
      return false;
    }
  }

  private async waitForDelay(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private shouldRetry(error: any): boolean {
    // Retry on connection errors, timeouts, and temporary failures
    const retryableErrors = [
      'P1001', // Can't reach database server
      'P1002', // Database server was reached but timed out
      'P1008', // Operations timed out
      'P1017', // Server has closed the connection
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND'
    ];

    if (error?.code && retryableErrors.includes(error.code)) {
      return true;
    }

    if (error?.message) {
      const message = error.message.toLowerCase();
      return message.includes('connection') ||
             message.includes('timeout') ||
             message.includes('server has gone away') ||
             message.includes('lost connection');
    }

    return false;
  }

  /**
   * Execute a database operation with automatic retry logic
   */
  async executeWithRetry<T>(
    operation: (client: PrismaClient) => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const { retries = 3, delay = 1000, backoff = true } = options;
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Check if we need to reconnect
        if (!this.isHealthy && Date.now() - this.lastHealthCheck > 5000) {
          await this.checkHealth();
        }

        const result = await operation(this.client);
        
        // Mark as healthy on successful operation
        if (!this.isHealthy) {
          this.isHealthy = true;
        }

        return result;
      } catch (error) {
        lastError = error;
        console.error(`Database operation failed (attempt ${attempt + 1}/${retries + 1}):`, error);

        // Don't retry on the last attempt or non-retryable errors
        if (attempt === retries || !this.shouldRetry(error)) {
          break;
        }

        // Calculate delay with exponential backoff
        const currentDelay = backoff ? delay * Math.pow(2, attempt) : delay;
        console.log(`Retrying in ${currentDelay}ms...`);
        
        await this.waitForDelay(currentDelay);
      }
    }

    // If we get here, all retries failed
    this.isHealthy = false;
    throw lastError;
  }

  /**
   * Execute a transaction with retry logic
   */
  async transactionWithRetry<T>(
    fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    return this.executeWithRetry(async (client) => {
      return client.$transaction(fn, {
        timeout: 30000, // 30 second timeout
        maxWait: 10000, // 10 second max wait for connection
      });
    }, options);
  }

  /**
   * Safe query execution with validation
   */
  async safeQuery<T>(
    query: (client: PrismaClient) => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await this.executeWithRetry(query, { retries: 2 });
    } catch (error) {
      console.error('Safe query failed:', error);
      return fallback;
    }
  }

  /**
   * Batch operations with error isolation
   */
  async batchOperations<T>(
    operations: ((client: PrismaClient) => Promise<T>)[],
    options: { continueOnError?: boolean } = {}
  ): Promise<(T | Error)[]> {
    const { continueOnError = false } = options;
    const results: (T | Error)[] = [];

    for (const operation of operations) {
      try {
        const result = await this.executeWithRetry(operation, { retries: 1 });
        results.push(result);
      } catch (error) {
        results.push(error);
        if (!continueOnError) {
          throw error;
        }
      }
    }

    return results;
  }

  /**
   * Get database health status
   */
  getHealthStatus(): { healthy: boolean; lastCheck: Date | null } {
    return {
      healthy: this.isHealthy,
      lastCheck: this.lastHealthCheck ? new Date(this.lastHealthCheck) : null
    };
  }

  /**
   * Force a health check
   */
  async forceHealthCheck(): Promise<boolean> {
    return this.checkHealth();
  }

  /**
   * Get the underlying Prisma client (use sparingly)
   */
  getClient(): PrismaClient {
    return this.client;
  }
}

// Export singleton instance
export const enhancedPrisma = new EnhancedPrismaClient();
export default enhancedPrisma;