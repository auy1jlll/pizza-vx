import { chromium } from 'playwright';

async function testMemoryLeaks() {
  console.log('🧪 Starting Memory Leak Detection Test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the app
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  console.log('📊 Taking initial memory snapshot...');
  
  // Test kitchen display (high-risk for memory leaks due to polling)
  console.log('\n🔍 Testing Kitchen Display (polling component)...');
  await page.goto('http://localhost:3002/management-portal/kitchen');
  await page.waitForLoadState('networkidle');

  // Monitor memory usage for 15 seconds
  const memorySnapshots = [];
  
  for (let i = 0; i < 5; i++) {
    const memory = await page.evaluate(() => {
      if (window.performance && window.performance.memory) {
        return {
          used: window.performance.memory.usedJSHeapSize,
          total: window.performance.memory.totalJSHeapSize,
          timestamp: Date.now()
        };
      }
      return null;
    });
    
    if (memory) {
      memorySnapshots.push(memory);
      console.log(`Memory check ${i + 1}: ${(memory.used / 1024 / 1024).toFixed(2)} MB`);
    }
    
    await page.waitForTimeout(3000); // Wait 3 seconds between checks
  }

  // Test navigation component
  console.log('\n🔍 Testing Menu Navigation (filtering component)...');
  await page.goto('http://localhost:3002/menu');
  await page.waitForLoadState('networkidle');

  // Simulate category filtering multiple times
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      // Find and click category buttons to test filtering
      const buttons = document.querySelectorAll('button');
      buttons.forEach((btn, index) => {
        if (index % 2 === 0 && btn.textContent.length > 2) {
          btn.click();
        }
      });
    });
    await page.waitForTimeout(1000);
  }

  // Take final memory snapshot
  const finalMemory = await page.evaluate(() => {
    if (window.performance && window.performance.memory) {
      return {
        used: window.performance.memory.usedJSHeapSize,
        total: window.performance.memory.totalJSHeapSize,
        timestamp: Date.now()
      };
    }
    return null;
  });

  // Analyze results
  if (memorySnapshots.length > 1 && finalMemory) {
    const initialMemory = memorySnapshots[0];
    const memoryGrowth = finalMemory.used - initialMemory.used;
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 MEMORY LEAK ANALYSIS RESULTS');
    console.log('='.repeat(50));
    console.log(`Initial Memory: ${(initialMemory.used / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Final Memory: ${(finalMemory.used / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Memory Growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB`);
    
    if (memoryGrowth > 5 * 1024 * 1024) { // 5MB threshold
      console.log('🚨 POTENTIAL MEMORY LEAK DETECTED!');
      console.log('   - Check useEffect cleanup functions');
      console.log('   - Verify polling intervals are cleared');
      console.log('   - Review event listener cleanup');
    } else {
      console.log('✅ Memory usage appears stable');
    }
    
    console.log('='.repeat(50));
  }

  await browser.close();
  console.log('🏁 Memory leak test completed!');
}

testMemoryLeaks().catch(console.error);
