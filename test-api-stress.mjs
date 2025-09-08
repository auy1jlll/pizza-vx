import fetch from 'node-fetch';

class APIStressTest {
  constructor() {
    this.baseUrl = 'http://localhost:3002';
    this.results = [];
    this.errors = [];
  }

  async testEndpoint(url, name, iterations = 5) {
    console.log(`🔥 Stress testing ${name} (${iterations} iterations)...`);
    const endpointResults = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      try {
        const response = await fetch(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        endpointResults.push({
          iteration: i + 1,
          responseTime,
          status: response.status,
          success: response.ok
        });

        process.stdout.write(`✅ ${i + 1}/${iterations} (${responseTime}ms) `);
      } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        endpointResults.push({
          iteration: i + 1,
          responseTime,
          status: 'ERROR',
          success: false,
          error: error.message
        });

        this.errors.push({ endpoint: name, error: error.message });
        process.stdout.write(`❌ ${i + 1}/${iterations} (${responseTime}ms) `);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(''); // New line after dots

    this.results.push({
      endpoint: name,
      url,
      results: endpointResults,
      avgResponseTime: endpointResults.reduce((sum, r) => sum + r.responseTime, 0) / endpointResults.length,
      successRate: (endpointResults.filter(r => r.success).length / endpointResults.length) * 100,
      minResponseTime: Math.min(...endpointResults.map(r => r.responseTime)),
      maxResponseTime: Math.max(...endpointResults.map(r => r.responseTime))
    });
  }

  async testConcurrency(url, name, concurrentRequests = 3) {
    console.log(`⚡ Testing ${name} concurrency (${concurrentRequests} simultaneous requests)...`);
    
    const promises = Array(concurrentRequests).fill().map(async (_, i) => {
      const startTime = Date.now();
      try {
        const response = await fetch(url);
        const endTime = Date.now();
        return {
          id: i + 1,
          responseTime: endTime - startTime,
          status: response.status,
          success: response.ok
        };
      } catch (error) {
        const endTime = Date.now();
        return {
          id: i + 1,
          responseTime: endTime - startTime,
          status: 'ERROR',
          success: false,
          error: error.message
        };
      }
    });

    const concurrentResults = await Promise.all(promises);
    
    concurrentResults.forEach(result => {
      console.log(`  Request ${result.id}: ${result.responseTime}ms (${result.status})`);
    });

    return {
      endpoint: name,
      concurrentResults,
      avgConcurrentResponseTime: concurrentResults.reduce((sum, r) => sum + r.responseTime, 0) / concurrentResults.length,
      concurrentSuccessRate: (concurrentResults.filter(r => r.success).length / concurrentResults.length) * 100
    };
  }

  generateStressTestReport() {
    console.log('\n' + '='.repeat(70));
    console.log('🔥 API STRESS TEST REPORT');
    console.log('='.repeat(70));

    // Overall Results
    console.log('\n📊 STRESS TEST RESULTS:');
    this.results.forEach(result => {
      console.log(`\n🎯 ${result.endpoint}:`);
      console.log(`   Average Response Time: ${result.avgResponseTime.toFixed(2)}ms`);
      console.log(`   Success Rate: ${result.successRate.toFixed(1)}%`);
      console.log(`   Response Time Range: ${result.minResponseTime}ms - ${result.maxResponseTime}ms`);
      
      if (result.successRate < 100) {
        console.log(`   ⚠️  ${100 - result.successRate}% failure rate detected`);
      }
    });

    // Error Summary
    if (this.errors.length > 0) {
      console.log('\n🚨 ERRORS ENCOUNTERED:');
      this.errors.forEach(error => {
        console.log(`   ${error.endpoint}: ${error.error}`);
      });
    } else {
      console.log('\n✅ NO ERRORS ENCOUNTERED');
    }

    // Performance Assessment
    console.log('\n💡 PERFORMANCE ASSESSMENT:');
    const avgOverallResponseTime = this.results.reduce((sum, r) => sum + r.avgResponseTime, 0) / this.results.length;
    const overallSuccessRate = this.results.reduce((sum, r) => sum + r.successRate, 0) / this.results.length;

    console.log(`Overall Average Response Time: ${avgOverallResponseTime.toFixed(2)}ms`);
    console.log(`Overall Success Rate: ${overallSuccessRate.toFixed(1)}%`);

    if (avgOverallResponseTime < 500 && overallSuccessRate > 95) {
      console.log('🎉 EXCELLENT PERFORMANCE - Ready for production!');
    } else if (avgOverallResponseTime < 1000 && overallSuccessRate > 90) {
      console.log('✅ GOOD PERFORMANCE - Minor optimizations recommended');
    } else {
      console.log('⚠️  PERFORMANCE CONCERNS - Investigation needed');
    }

    console.log('\n' + '='.repeat(70));
  }
}

async function runAPIStressTest() {
  console.log('🚀 Starting API Stress Test for Performance & Memory Analysis...\n');
  
  const stressTest = new APIStressTest();

  // Test critical endpoints under stress
  const endpoints = [
    { url: '/api/settings', name: 'Settings API', iterations: 8 },
    { url: '/api/menu/categories', name: 'Categories API', iterations: 6 },
    { url: '/api/specialty-pizzas', name: 'Specialty Pizzas API', iterations: 6 },
    { url: '/api/management-portal/kitchen/orders', name: 'Kitchen Orders API', iterations: 4 }
  ];

  // Sequential stress testing
  for (const endpoint of endpoints) {
    await stressTest.testEndpoint(
      `${stressTest.baseUrl}${endpoint.url}`,
      endpoint.name,
      endpoint.iterations
    );
    
    // Small delay between endpoint tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Concurrency testing on most critical endpoints
  console.log('\n🔥 CONCURRENCY TESTING:');
  const concurrentResults = await stressTest.testConcurrency(
    `${stressTest.baseUrl}/api/menu/categories`,
    'Categories API Concurrency',
    3
  );

  console.log(`\nConcurrency Results: ${concurrentResults.avgConcurrentResponseTime.toFixed(2)}ms avg, ${concurrentResults.concurrentSuccessRate}% success`);

  // Generate comprehensive report
  stressTest.generateStressTestReport();

  console.log('\n🏁 Stress testing completed!');
}

runAPIStressTest().catch(console.error);
