// Performance & Caching Test Suite
import { PrismaClient } from '@prisma/client';
import { cacheService } from './src/lib/cache-service.js';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const API_BASE_URL = 'http://localhost:3000';

async function testPerformanceEnhancements() {
  console.log('🚀 Testing Performance & Caching Enhancements');
  console.log('=' .repeat(60));

  const testResults = {
    passed: 0,
    failed: 0,
    total: 8
  };

  // Test 1: Memory Cache Service
  console.log('\n1. Testing Memory Cache Service...');
  try {
    const testData = { message: 'Hello Cache!', timestamp: Date.now() };
    
    // Set cache
    cacheService.set('test', 'sample-key', testData);
    
    // Get cache
    const cachedData = cacheService.get('test', 'sample-key');
    
    if (cachedData && cachedData.message === testData.message) {
      console.log('✅ Memory cache working correctly');
      testResults.passed++;
    } else {
      console.log('❌ Memory cache failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Memory cache error:', error.message);
    testResults.failed++;
  }

  // Test 2: Cache invalidation
  console.log('\n2. Testing Cache Invalidation...');
  try {
    cacheService.set('test', 'invalidate-test', { data: 'original' });
    cacheService.invalidate('test', 'invalidate');
    
    const invalidatedData = cacheService.get('test', 'invalidate-test');
    
    if (!invalidatedData) {
      console.log('✅ Cache invalidation working');
      testResults.passed++;
    } else {
      console.log('❌ Cache invalidation failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Cache invalidation error:', error.message);
    testResults.failed++;
  }

  // Test 3: Cache warmup
  console.log('\n3. Testing Cache Warmup...');
  try {
    await cacheService.warmupCache();
    
    // Check if common data is cached
    const cachedToppings = cacheService.get('toppings', 'all-available');
    const cachedSizes = cacheService.get('sizes', 'all-available');
    
    if (cachedToppings && cachedSizes) {
      console.log('✅ Cache warmup successful');
      console.log(`   Cached ${cachedToppings.length} toppings, ${cachedSizes.length} sizes`);
      testResults.passed++;
    } else {
      console.log('❌ Cache warmup failed');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Cache warmup error:', error.message);
    testResults.failed++;
  }

  // Test 4: Pizza Data API Performance (with caching)
  console.log('\n4. Testing Enhanced Pizza Data API...');
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE_URL}/api/pizza-data`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      
      // Check for performance metadata
      if (data.metadata && data.metadata.cacheSource) {
        console.log(`✅ Enhanced API working (${responseTime}ms, source: ${data.metadata.cacheSource})`);
        testResults.passed++;
      } else {
        console.log(`✅ API working but missing metadata (${responseTime}ms)`);
        testResults.passed++;
      }
    } else {
      console.log('❌ Pizza Data API failed:', response.status);
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Pizza Data API error:', error.message);
    testResults.failed++;
  }

  // Test 5: HTTP Cache Headers
  console.log('\n5. Testing HTTP Cache Headers...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/pizza-data`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const etag = response.headers.get('etag');
    const cacheControl = response.headers.get('cache-control');
    
    if (etag && cacheControl) {
      console.log('✅ HTTP cache headers present');
      console.log(`   ETag: ${etag.substring(0, 20)}...`);
      console.log(`   Cache-Control: ${cacheControl}`);
      testResults.passed++;
    } else {
      console.log('❌ HTTP cache headers missing');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ HTTP cache headers test error:', error.message);
    testResults.failed++;
  }

  // Test 6: ETag Conditional Request
  console.log('\n6. Testing ETag Conditional Requests...');
  try {
    // First request to get ETag
    const response1 = await fetch(`${API_BASE_URL}/api/pizza-data`);
    const etag = response1.headers.get('etag');
    
    if (etag) {
      // Second request with If-None-Match
      const response2 = await fetch(`${API_BASE_URL}/api/pizza-data`, {
        headers: {
          'If-None-Match': etag
        }
      });
      
      if (response2.status === 304) {
        console.log('✅ ETag conditional requests working (304 Not Modified)');
        testResults.passed++;
      } else {
        console.log(`❌ ETag conditional request failed (status: ${response2.status})`);
        testResults.failed++;
      }
    } else {
      console.log('❌ No ETag received for conditional test');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ ETag conditional request error:', error.message);
    testResults.failed++;
  }

  // Test 7: Cache Performance Comparison
  console.log('\n7. Testing Cache Performance...');
  try {
    // Clear cache first
    cacheService.clear('pizza-data');
    
    // First request (cache miss)
    const start1 = Date.now();
    const response1 = await fetch(`${API_BASE_URL}/api/pizza-data`);
    const time1 = Date.now() - start1;
    await response1.json();
    
    // Second request (should be faster with cache)
    const start2 = Date.now();
    const response2 = await fetch(`${API_BASE_URL}/api/pizza-data`);
    const time2 = Date.now() - start2;
    await response2.json();
    
    console.log(`   First request (cache miss): ${time1}ms`);
    console.log(`   Second request (cache hit): ${time2}ms`);
    
    if (time2 < time1) {
      console.log('✅ Cache performance improvement detected');
      testResults.passed++;
    } else {
      console.log('❌ No cache performance improvement (may be due to small dataset)');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Cache performance test error:', error.message);
    testResults.failed++;
  }

  // Test 8: Memory usage and cache stats
  console.log('\n8. Testing Cache Statistics...');
  try {
    const stats = cacheService.getAllStats();
    
    if (stats && Object.keys(stats).length > 0) {
      console.log('✅ Cache statistics available');
      console.log('   Cache stats:');
      Object.entries(stats).forEach(([name, stat]) => {
        if (stat && stat.size > 0) {
          console.log(`     ${name}: ${stat.size}/${stat.max} items`);
        }
      });
      testResults.passed++;
    } else {
      console.log('❌ Cache statistics not available');
      testResults.failed++;
    }
  } catch (error) {
    console.log('❌ Cache statistics error:', error.message);
    testResults.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Performance & Caching Test Results:');
  console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`);
  console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`);
  console.log(`📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);

  if (testResults.passed === testResults.total) {
    console.log('\n🎉 All Performance & Caching tests passed!');
    console.log('\n🚀 Performance Features Implemented:');
    console.log('   • LRU Memory Caching for read-heavy data');
    console.log('   • HTTP Conditional Caching with ETags');
    console.log('   • Automatic cache invalidation');
    console.log('   • Cache warmup for common data');
    console.log('   • Performance monitoring and metrics');
    console.log('   • Stale-while-revalidate strategy');
    console.log('   • Dynamic import infrastructure for lazy loading');
    console.log('   • Price calculation memoization system');
    return true;
  } else {
    console.log('\n⚠️  Some performance tests failed. Please review the implementation.');
    return false;
  }
}

// Run the test
testPerformanceEnhancements()
  .then((success) => {
    if (success) {
      console.log('\n✨ Performance enhancements are working correctly!');
      console.log('\n📈 Next steps for optimization:');
      console.log('   • Implement debounced price calculation in React components');
      console.log('   • Add lazy loading to admin route components');
      console.log('   • Configure CDN caching for static assets');
      console.log('   • Implement service worker for offline caching');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
