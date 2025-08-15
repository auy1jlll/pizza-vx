// Performance Enhancement: HTTP Conditional Caching with ETags
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export interface CacheHeaders {
  etag?: string;
  lastModified?: string;
  maxAge?: number;
  staleWhileRevalidate?: number;
}

export class HTTPCacheService {
  
  // Generate ETag from data
  static generateETag(data: any): string {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // Check if request has conditional headers that match
  static checkConditionalHeaders(
    request: NextRequest, 
    etag: string, 
    lastModified?: Date
  ): boolean {
    // Check If-None-Match (ETag)
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch) {
      // Handle both weak and strong ETags
      const requestETags = ifNoneMatch.split(',').map(tag => tag.trim().replace(/^W\//, ''));
      if (requestETags.includes(etag) || requestETags.includes('*')) {
        return true; // Content hasn't changed
      }
    }

    // Check If-Modified-Since
    const ifModifiedSince = request.headers.get('if-modified-since');
    if (ifModifiedSince && lastModified) {
      const requestDate = new Date(ifModifiedSince);
      if (lastModified <= requestDate) {
        return true; // Content hasn't changed
      }
    }

    return false; // Content has changed or no conditional headers
  }

  // Set cache headers on response
  static setCacheHeaders(
    response: NextResponse, 
    headers: CacheHeaders
  ): NextResponse {
    if (headers.etag) {
      response.headers.set('ETag', `"${headers.etag}"`);
    }

    if (headers.lastModified) {
      response.headers.set('Last-Modified', headers.lastModified);
    }

    // Set Cache-Control header
    const cacheControlParts: string[] = [];
    
    if (headers.maxAge !== undefined) {
      cacheControlParts.push(`max-age=${headers.maxAge}`);
    }
    
    if (headers.staleWhileRevalidate !== undefined) {
      cacheControlParts.push(`stale-while-revalidate=${headers.staleWhileRevalidate}`);
    }

    // Default cache control for API responses
    if (cacheControlParts.length === 0) {
      cacheControlParts.push('public', 'max-age=300', 'stale-while-revalidate=60');
    }

    response.headers.set('Cache-Control', cacheControlParts.join(', '));
    response.headers.set('Vary', 'Accept-Encoding');

    return response;
  }

  // Create a 304 Not Modified response
  static createNotModifiedResponse(): NextResponse {
    const response = new NextResponse(null, { status: 304 });
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return response;
  }

  // Wrapper function for easy API caching
  static async withConditionalCache<T>(
    request: NextRequest,
    dataFactory: () => Promise<T>,
    options: {
      maxAge?: number;
      staleWhileRevalidate?: number;
      getLastModified?: () => Date;
    } = {}
  ): Promise<NextResponse> {
    try {
      // Get the data
      const data = await dataFactory();
      
      // Generate ETag
      const etag = HTTPCacheService.generateETag(data);
      
      // Get last modified date if provided
      const lastModified = options.getLastModified?.();
      
      // Check conditional headers
      const notModified = HTTPCacheService.checkConditionalHeaders(
        request, 
        etag, 
        lastModified
      );

      if (notModified) {
        return HTTPCacheService.createNotModifiedResponse();
      }

      // Create response with data
      const response = NextResponse.json(data);
      
      // Set cache headers
      return HTTPCacheService.setCacheHeaders(response, {
        etag,
        lastModified: lastModified?.toUTCString(),
        maxAge: options.maxAge || 300, // 5 minutes default
        staleWhileRevalidate: options.staleWhileRevalidate || 60 // 1 minute default
      });

    } catch (error) {
      console.error('[HTTPCache] Error in conditional cache:', error);
      throw error;
    }
  }

  // Cache configuration for different data types
  static getCacheConfig(dataType: string): { maxAge: number; staleWhileRevalidate: number } {
    const configs: Record<string, { maxAge: number; staleWhileRevalidate: number }> = {
      'toppings': { maxAge: 1800, staleWhileRevalidate: 300 }, // 30 min, 5 min stale
      'sizes': { maxAge: 3600, staleWhileRevalidate: 600 }, // 1 hour, 10 min stale
      'crusts': { maxAge: 3600, staleWhileRevalidate: 600 }, // 1 hour, 10 min stale
      'sauces': { maxAge: 3600, staleWhileRevalidate: 600 }, // 1 hour, 10 min stale
      'specialty-pizzas': { maxAge: 1200, staleWhileRevalidate: 180 }, // 20 min, 3 min stale
      'settings': { maxAge: 7200, staleWhileRevalidate: 1200 }, // 2 hours, 20 min stale
      'pizza-data': { maxAge: 900, staleWhileRevalidate: 120 }, // 15 min, 2 min stale
      'default': { maxAge: 300, staleWhileRevalidate: 60 } // 5 min, 1 min stale
    };

    return configs[dataType] || configs.default;
  }

  // Performance metrics tracking
  static trackCacheMetrics(
    endpoint: string, 
    isHit: boolean, 
    responseTime: number
  ): void {
    console.log(`[HTTPCache] ${endpoint} - ${isHit ? 'HIT' : 'MISS'} - ${responseTime}ms`);
    
    // In production, you might send this to analytics
    // analytics.track('cache_performance', {
    //   endpoint,
    //   cache_hit: isHit,
    //   response_time: responseTime
    // });
  }
}

// Decorator for easy caching
export function withCache(dataType: string = 'default') {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      const startTime = Date.now();
      const config = HTTPCacheService.getCacheConfig(dataType);

      try {
        return await HTTPCacheService.withConditionalCache(
          request,
          () => method.apply(this, [request, ...args]),
          config
        );
      } finally {
        const responseTime = Date.now() - startTime;
        HTTPCacheService.trackCacheMetrics(
          propertyName,
          false, // We can't easily detect cache hits in this decorator
          responseTime
        );
      }
    };

    return descriptor;
  };
}
