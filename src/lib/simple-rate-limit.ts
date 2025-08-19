// Simple in-memory rate limiter tailored for Next.js App Router
// Avoids express-rate-limit dependency issues.

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  windowMs: number; // duration of window in ms
  max: number;      // max requests per window
  keyGenerator?: (keyParts: { ip: string | undefined; route: string }) => string;
}

export class SimpleRateLimiter {
  private buckets = new Map<string, Bucket>();
  private windowMs: number;
  private max: number;
  private keyGen: (keyParts: { ip: string | undefined; route: string }) => string;
  private sweepEvery = 200; // perform a lightweight cleanup after this many checks
  private checks = 0;

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.keyGen = options.keyGenerator || (({ ip, route }) => `${ip || 'unknown'}:${route}`);
  }

  private sweep(now: number) {
    // Remove expired buckets to prevent unbounded memory growth
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }

  check(route: string, ip?: string) {
    const key = this.keyGen({ ip, route });
    const now = Date.now();
    // periodic cleanup
    if (++this.checks % this.sweepEvery === 0) this.sweep(now);
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: this.max - 1, resetAt };
    }

    if (existing.count < this.max) {
      existing.count += 1;
      return { allowed: true, remaining: this.max - existing.count, resetAt: existing.resetAt };
    }

    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }
}

// Specialized instances (can add more as needed)
export const orderLimiter = new SimpleRateLimiter({ windowMs: 5 * 60 * 1000, max: 5 });
export const authLimiter = new SimpleRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
export const adminLimiter = new SimpleRateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }); // Increased from 100 to 200 for kitchen display
