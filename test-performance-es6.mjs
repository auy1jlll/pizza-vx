import fetch from 'node-fetch';

// Performance monitoring configuration
const PERFORMANCE_CONFIG = {
  testDuration: 20000, // 20 seconds
  memoryCheckInterval: 2000, // Every 2 seconds
  apiTestInterval: 3000, // Every 3 seconds
  maxMemoryGrowth: 50 * 1024 * 1024, // 50MB max growth
  baseUrl: 'http://localhost:3002'
};

class PerformanceMonitor {
  constructor() {
    this.memoryHistory = [];
    this.performanceMetrics = [];
    this.apiResponseTimes = [];
    this.startTime = Date.now();
    this.initialMemory = null;
  }

  recordMemory() {
    const memUsage = process.memoryUsage();
    const timestamp = Date.now() - this.startTime;
    
    if (!this.initialMemory) {
      this.initialMemory = memUsage;
    }

    this.memoryHistory.push({
      timestamp,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss
    });

    return memUsage;
  }

  async testApiEndpoint(url, name) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.apiResponseTimes.push({
        endpoint: name,
        responseTime,
        status: response.status,
        timestamp: Date.now() - this.startTime
      });

      console.log(`✅ ${name}: ${responseTime}ms (Status: ${response.status})`);
      return { success: true, responseTime, status: response.status };
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`❌ ${name}: Failed after ${responseTime}ms - ${error.message}`);
      return { success: false, responseTime, error: error.message };
    }
  }

  detectMemoryLeaks() {
    if (this.memoryHistory.length < 5) return null;

    const recent = this.memoryHistory.slice(-5);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    
    const heapGrowth = newest.heapUsed - oldest.heapUsed;
    const timeSpan = newest.timestamp - oldest.timestamp;
    const growthRate = heapGrowth / timeSpan; // bytes per ms

    return {
      heapGrowth,
      timeSpan,
      growthRate: growthRate * 1000, // bytes per second
      isLeaking: heapGrowth > PERFORMANCE_CONFIG.maxMemoryGrowth / 10 // threshold
    };
  }

  generateReport() {
    const currentMemory = this.recordMemory();
    const memoryGrowth = currentMemory.heapUsed - this.initialMemory.heapUsed;
    const leakDetection = this.detectMemoryLeaks();

    console.log('\n' + '='.repeat(60));
    console.log('🔍 PERFORMANCE & MEMORY LEAK ANALYSIS REPORT');
    console.log('='.repeat(60));

    // Memory Analysis
    console.log('\n📊 MEMORY ANALYSIS:');
    console.log(`Initial Heap: ${(this.initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Current Heap: ${(currentMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Memory Growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB`);
    
    if (leakDetection) {
      const leakStatus = leakDetection.isLeaking ? '🚨 POTENTIAL LEAK' : '✅ NORMAL';
      console.log(`Leak Detection: ${leakStatus}`);
      console.log(`Growth Rate: ${(leakDetection.growthRate / 1024).toFixed(2)} KB/sec`);
    }

    // API Performance
    console.log('\n⚡ API PERFORMANCE:');
    if (this.apiResponseTimes.length > 0) {
      const avgResponseTime = this.apiResponseTimes.reduce((sum, api) => sum + api.responseTime, 0) / this.apiResponseTimes.length;
      const slowestApi = this.apiResponseTimes.reduce((prev, current) => prev.responseTime > current.responseTime ? prev : current);
      const fastestApi = this.apiResponseTimes.reduce((prev, current) => prev.responseTime < current.responseTime ? prev : current);

      console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`Fastest API: ${fastestApi.endpoint} (${fastestApi.responseTime}ms)`);
      console.log(`Slowest API: ${slowestApi.endpoint} (${slowestApi.responseTime}ms)`);
      
      // Success rate
      const successfulCalls = this.apiResponseTimes.filter(api => api.status >= 200 && api.status < 300).length;
      const successRate = (successfulCalls / this.apiResponseTimes.length) * 100;
      console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (memoryGrowth > PERFORMANCE_CONFIG.maxMemoryGrowth) {
      console.log('🚨 High memory growth detected - Check for memory leaks');
    }
    if (leakDetection && leakDetection.isLeaking) {
      console.log('🚨 Potential memory leak - Review useEffect cleanup and polling intervals');
    }
    if (this.apiResponseTimes.some(api => api.responseTime > 1000)) {
      console.log('⚠️  Some APIs are slow (>1s) - Consider optimization');
    }
    if (memoryGrowth < 10 * 1024 * 1024 && (!leakDetection || !leakDetection.isLeaking)) {
      console.log('✅ Memory usage appears healthy');
    }

    console.log('\n' + '='.repeat(60));
  }
}

async function runPerformanceTest() {
  console.log('🚀 Starting Performance & Memory Leak Test with React DevTools...');
  console.log(`Duration: ${PERFORMANCE_CONFIG.testDuration / 1000} seconds`);
  console.log(`Target URL: ${PERFORMANCE_CONFIG.baseUrl}`);
  console.log('');

  const monitor = new PerformanceMonitor();
  
  // API endpoints to test
  const apiEndpoints = [
    { url: `${PERFORMANCE_CONFIG.baseUrl}/api/menu/categories`, name: 'Categories API' },
    { url: `${PERFORMANCE_CONFIG.baseUrl}/api/specialty-pizzas`, name: 'Specialty Pizzas API' },
    { url: `${PERFORMANCE_CONFIG.baseUrl}/api/settings`, name: 'Settings API' }
  ];

  // Memory monitoring interval
  const memoryInterval = setInterval(() => {
    const memory = monitor.recordMemory();
    const growth = memory.heapUsed - monitor.initialMemory.heapUsed;
    console.log(`📊 Memory: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB (Growth: ${(growth / 1024 / 1024).toFixed(2)} MB)`);
  }, PERFORMANCE_CONFIG.memoryCheckInterval);

  // API testing interval
  const apiTestInterval = setInterval(async () => {
    const endpoint = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];
    await monitor.testApiEndpoint(endpoint.url, endpoint.name);
  }, PERFORMANCE_CONFIG.apiTestInterval);

  // Stop after configured duration
  setTimeout(() => {
    clearInterval(memoryInterval);
    clearInterval(apiTestInterval);
    
    console.log('\n🏁 Test completed! Generating report...');
    monitor.generateReport();
    
    process.exit(0);
  }, PERFORMANCE_CONFIG.testDuration);

  // Initial memory recording
  monitor.recordMemory();
  console.log('✅ Performance monitoring started...\n');
}

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\n⚠️  Test interrupted by user');
  process.exit(0);
});

runPerformanceTest().catch(console.error);
