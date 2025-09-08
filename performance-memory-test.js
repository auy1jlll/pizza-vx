// Performance and Memory Test Script
const http = require('http');
const { performance } = require('perf_hooks');

console.log('🔍 PIZZA-VX PERFORMANCE & MEMORY ANALYSIS');
console.log('══════════════════════════════════════════\n');

// Memory usage tracking
function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    heapUsed: Math.round(used.heapUsed / 1024 / 1024),
    heapTotal: Math.round(used.heapTotal / 1024 / 1024),
    external: Math.round(used.external / 1024 / 1024),
    rss: Math.round(used.rss / 1024 / 1024)
  };
}

// Test API endpoint performance
async function testAPIPerformance(url, testName) {
  const start = performance.now();
  
  try {
    const response = await fetch(url);
    const end = performance.now();
    const duration = Math.round(end - start);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${testName}: ${duration}ms`);
      return { success: true, duration, data };
    } else {
      console.log(`❌ ${testName}: ${response.status} - ${duration}ms`);
      return { success: false, duration, error: response.status };
    }
  } catch (error) {
    const end = performance.now();
    const duration = Math.round(end - start);
    console.log(`❌ ${testName}: ERROR - ${duration}ms - ${error.message}`);
    return { success: false, duration, error: error.message };
  }
}

// Simulate memory leak test
async function simulateMemoryLeakTest() {
  console.log('\n🧠 MEMORY LEAK SIMULATION TEST');
  console.log('─────────────────────────────────');
  
  const initialMemory = getMemoryUsage();
  console.log('Initial Memory:', initialMemory);
  
  // Simulate multiple API calls that could cause leaks
  const results = [];
  
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch('http://localhost:3004/api/menu/categories');
      if (response.ok) {
        const data = await response.json();
        results.push(data); // Store temporarily to simulate processing
      }
    } catch (error) {
      console.log(`Request ${i + 1} failed: ${error.message}`);
    }
    
    // Small delay to simulate real usage
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Clear results to simulate proper cleanup
  results.length = 0;
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const finalMemory = getMemoryUsage();
  console.log('Final Memory:', finalMemory);
  
  const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
  console.log(`Memory Change: ${memoryIncrease}MB`);
  
  if (memoryIncrease < 5) {
    console.log('✅ Memory usage looks stable');
  } else if (memoryIncrease < 20) {
    console.log('⚠️ Moderate memory increase - monitor in production');
  } else {
    console.log('❌ Significant memory increase - possible memory leak');
  }
}

// Main performance test suite
async function runPerformanceTests() {
  console.log('📊 API PERFORMANCE TESTS');
  console.log('─────────────────────────');
  
  const baseUrl = 'http://localhost:3004';
  
  const tests = [
    { url: `${baseUrl}/api/menu/categories`, name: 'Menu Categories API' },
    { url: `${baseUrl}/api/specialty-pizzas`, name: 'Specialty Pizzas API' },
    { url: `${baseUrl}/api/settings`, name: 'Settings API' },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testAPIPerformance(test.url, test.name);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Calculate averages
  const successfulTests = results.filter(r => r.success);
  const averageResponseTime = successfulTests.length > 0 
    ? Math.round(successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length)
    : 0;
  
  console.log(`\n📈 SUMMARY:`);
  console.log(`✅ Successful tests: ${successfulTests.length}/${results.length}`);
  console.log(`⏱️ Average response time: ${averageResponseTime}ms`);
  
  if (averageResponseTime < 200) {
    console.log('✅ Performance: Excellent');
  } else if (averageResponseTime < 500) {
    console.log('⚠️ Performance: Good');
  } else {
    console.log('❌ Performance: Needs improvement');
  }
  
  return { results, averageResponseTime };
}

// Server connectivity test
async function testServerConnectivity() {
  console.log('🌐 SERVER CONNECTIVITY TEST');
  console.log('────────────────────────────');
  
  try {
    const response = await fetch('http://localhost:3004/', { 
      method: 'HEAD',
      timeout: 5000 
    });
    
    if (response.ok) {
      console.log('✅ Server is running and accessible');
      return true;
    } else {
      console.log(`❌ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Cannot connect to server: ${error.message}`);
    console.log('💡 Make sure the development server is running on port 3004');
    return false;
  }
}

// Main execution
async function main() {
  console.log(`⏰ Test started at: ${new Date().toLocaleString()}\n`);
  
  // Test server connectivity first
  const serverRunning = await testServerConnectivity();
  
  if (!serverRunning) {
    console.log('\n🛑 Stopping tests - server not accessible');
    process.exit(1);
  }
  
  console.log('');
  
  // Run performance tests
  const performanceResults = await runPerformanceTests();
  
  // Run memory leak simulation
  await simulateMemoryLeakTest();
  
  // Final recommendations
  console.log('\n🎯 PRODUCTION READINESS ASSESSMENT');
  console.log('═══════════════════════════════════');
  
  const issues = [];
  const recommendations = [];
  
  if (performanceResults.averageResponseTime > 500) {
    issues.push('Slow API response times');
    recommendations.push('Optimize database queries and add caching');
  }
  
  if (performanceResults.results.some(r => !r.success)) {
    issues.push('Some API endpoints failing');
    recommendations.push('Fix failing API endpoints before production');
  }
  
  console.log(`🔍 Issues found: ${issues.length}`);
  issues.forEach(issue => console.log(`   ❌ ${issue}`));
  
  console.log(`💡 Recommendations: ${recommendations.length}`);
  recommendations.forEach(rec => console.log(`   🔧 ${rec}`));
  
  if (issues.length === 0) {
    console.log('\n🎉 All tests passed! Application appears ready for production.');
  } else {
    console.log('\n⚠️ Please address the issues above before deploying to production.');
  }
  
  console.log(`\n⏰ Test completed at: ${new Date().toLocaleString()}`);
}

// Check if running directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  testAPIPerformance, 
  simulateMemoryLeakTest, 
  runPerformanceTests,
  getMemoryUsage
};
