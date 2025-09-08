import { chromium } from 'playwright';

const PERFORMANCE_CONFIG = {
  baseUrl: 'http://localhost:3002',
  testDuration: 30000, // 30 seconds
  routes: [
    '/',
    '/menu',
    '/management-portal/kitchen',
    '/management-portal/settings',
    '/management-portal/menu/categories'
  ]
};

class BrowserPerformanceMonitor {
  constructor() {
    this.memorySnapshots = [];
    this.performanceMetrics = [];
    this.startTime = Date.now();
  }

  async takeMemorySnapshot(page, routeName) {
    try {
      // Take heap snapshot
      const client = await page.context().newCDPSession(page);
      await client.send('HeapProfiler.enable');
      
      // Get memory usage
      const memoryUsage = await page.evaluate(() => {
        if (window.performance && window.performance.memory) {
          return {
            usedJSHeapSize: window.performance.memory.usedJSHeapSize,
            totalJSHeapSize: window.performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
            timestamp: Date.now()
          };
        }
        return null;
      });

      if (memoryUsage) {
        this.memorySnapshots.push({
          route: routeName,
          ...memoryUsage,
          relativeTime: Date.now() - this.startTime
        });
        
        console.log(`📊 ${routeName}: ${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      }

      await client.detach();
      return memoryUsage;
    } catch (error) {
      console.log(`⚠️  Memory snapshot failed for ${routeName}: ${error.message}`);
      return null;
    }
  }

  async measurePagePerformance(page, routeName) {
    const startTime = Date.now();
    
    try {
      // Navigate to page
      await page.goto(`${PERFORMANCE_CONFIG.baseUrl}${routeName}`, { 
        waitUntil: 'networkidle', 
        timeout: 30000 
      });

      const loadTime = Date.now() - startTime;

      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
      });

      this.performanceMetrics.push({
        route: routeName,
        loadTime,
        ...metrics,
        timestamp: Date.now() - this.startTime
      });

      console.log(`⚡ ${routeName}: ${loadTime}ms load time`);
      return { loadTime, ...metrics };
    } catch (error) {
      console.log(`❌ ${routeName}: Failed to load - ${error.message}`);
      return { error: error.message };
    }
  }

  detectMemoryLeaks() {
    if (this.memorySnapshots.length < 3) return null;

    const firstSnapshot = this.memorySnapshots[0];
    const lastSnapshot = this.memorySnapshots[this.memorySnapshots.length - 1];
    
    const memoryGrowth = lastSnapshot.usedJSHeapSize - firstSnapshot.usedJSHeapSize;
    const timeSpan = lastSnapshot.relativeTime - firstSnapshot.relativeTime;
    const growthRate = memoryGrowth / timeSpan; // bytes per ms

    return {
      memoryGrowth,
      timeSpan,
      growthRate: growthRate * 1000, // bytes per second
      isLeaking: memoryGrowth > 10 * 1024 * 1024, // 10MB threshold
      startMemory: firstSnapshot.usedJSHeapSize,
      endMemory: lastSnapshot.usedJSHeapSize
    };
  }

  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('🌐 BROWSER PERFORMANCE & MEMORY ANALYSIS REPORT');
    console.log('='.repeat(70));

    // Memory Analysis
    if (this.memorySnapshots.length > 0) {
      console.log('\n📊 BROWSER MEMORY ANALYSIS:');
      const leakDetection = this.detectMemoryLeaks();
      
      if (leakDetection) {
        console.log(`Initial Memory: ${(leakDetection.startMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Final Memory: ${(leakDetection.endMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Memory Growth: ${(leakDetection.memoryGrowth / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Growth Rate: ${(leakDetection.growthRate / 1024).toFixed(2)} KB/sec`);
        console.log(`Leak Status: ${leakDetection.isLeaking ? '🚨 POTENTIAL LEAK' : '✅ NORMAL'}`);
      }
    }

    // Page Performance
    if (this.performanceMetrics.length > 0) {
      console.log('\n⚡ PAGE PERFORMANCE:');
      const avgLoadTime = this.performanceMetrics.reduce((sum, metric) => sum + (metric.loadTime || 0), 0) / this.performanceMetrics.length;
      const slowestPage = this.performanceMetrics.reduce((prev, current) => (prev.loadTime || 0) > (current.loadTime || 0) ? prev : current);
      const fastestPage = this.performanceMetrics.reduce((prev, current) => (prev.loadTime || 0) < (current.loadTime || 0) ? prev : current);

      console.log(`Average Load Time: ${avgLoadTime.toFixed(2)}ms`);
      console.log(`Fastest Page: ${fastestPage.route} (${fastestPage.loadTime}ms)`);
      console.log(`Slowest Page: ${slowestPage.route} (${slowestPage.loadTime}ms)`);

      // First Paint metrics
      const avgFCP = this.performanceMetrics.reduce((sum, metric) => sum + (metric.firstContentfulPaint || 0), 0) / this.performanceMetrics.length;
      if (avgFCP > 0) {
        console.log(`Average First Contentful Paint: ${avgFCP.toFixed(2)}ms`);
      }
    }

    // React-specific recommendations
    console.log('\n💡 REACT PERFORMANCE RECOMMENDATIONS:');
    const leakDetection = this.detectMemoryLeaks();
    if (leakDetection && leakDetection.isLeaking) {
      console.log('🚨 Memory leak detected - Check for:');
      console.log('   - Uncleared intervals/timeouts in useEffect');
      console.log('   - Event listeners not removed');
      console.log('   - Missing dependency arrays in useEffect');
      console.log('   - Large objects held in state unnecessarily');
    } else {
      console.log('✅ No significant memory leaks detected');
    }

    if (this.performanceMetrics.some(metric => metric.loadTime > 3000)) {
      console.log('⚠️  Some pages are slow (>3s) - Consider:');
      console.log('   - Code splitting with React.lazy()');
      console.log('   - Implementing useMemo for expensive calculations');
      console.log('   - Using React.memo for component optimization');
    }

    console.log('\n' + '='.repeat(70));
  }
}

async function runBrowserPerformanceTest() {
  console.log('🌐 Starting Browser Performance Test with React DevTools Support...');
  console.log(`Duration: ${PERFORMANCE_CONFIG.testDuration / 1000} seconds`);
  console.log(`Base URL: ${PERFORMANCE_CONFIG.baseUrl}`);
  console.log('');

  const monitor = new BrowserPerformanceMonitor();
  let browser;

  try {
    // Launch browser with React DevTools extension support
    browser = await chromium.launch({
      headless: false, // Keep visible to see React DevTools
      args: [
        '--enable-extensions',
        '--load-extension=/path/to/react-devtools', // This would need the actual path
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Test each route
    for (const route of PERFORMANCE_CONFIG.routes) {
      console.log(`\n🔍 Testing route: ${route}`);
      
      // Measure page performance
      await monitor.measurePagePerformance(page, route);
      
      // Take memory snapshot
      await monitor.takeMemorySnapshot(page, route);
      
      // Wait a bit between tests
      await page.waitForTimeout(2000);
      
      // Simulate some user interaction to trigger React re-renders
      if (route === '/') {
        await page.evaluate(() => {
          // Scroll to trigger any lazy loading
          window.scrollTo(0, document.body.scrollHeight);
        });
      } else if (route === '/menu') {
        await page.evaluate(() => {
          // Simulate category filtering if available
          const buttons = document.querySelectorAll('button');
          buttons.forEach((btn, index) => {
            if (index % 3 === 0) btn.click();
          });
        });
      }
      
      await page.waitForTimeout(1000);
      await monitor.takeMemorySnapshot(page, `${route} (after interaction)`);
    }

    // Keep monitoring for the specified duration
    console.log('\n🕒 Monitoring for memory leaks...');
    const monitoringInterval = setInterval(async () => {
      await monitor.takeMemorySnapshot(page, 'monitoring');
    }, 3000);

    // Wait for test duration
    await page.waitForTimeout(PERFORMANCE_CONFIG.testDuration - (Date.now() - monitor.startTime));
    
    clearInterval(monitoringInterval);

    console.log('\n🏁 Browser test completed! Generating report...');
    monitor.generateReport();

  } catch (error) {
    console.error('❌ Browser test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runBrowserPerformanceTest().catch(console.error);
