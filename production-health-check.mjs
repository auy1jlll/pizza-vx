// Import Prisma client properly
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

async function quickProductionHealthCheck() {
  console.log('\n🚀 PRODUCTION HEALTH CHECK - QUICK ASSESSMENT');
  console.log('================================================\n');
  
  const prisma = new PrismaClient();
  let results = {
    database: { status: '❌', details: [], times: [] },
    memory: { status: '❌', details: [] },
    performance: { status: '❌', details: [] },
    overall: '❌'
  };

  try {
    // 1. DATABASE HEALTH CHECK
    console.log('1️⃣ DATABASE HEALTH CHECK');
    console.log('---------------------------');
    
    const dbStart = performance.now();
    await prisma.$connect();
    const connectTime = performance.now() - dbStart;
    console.log(`✅ Database Connection: ${connectTime.toFixed(2)}ms`);
    results.database.times.push({ operation: 'connect', time: connectTime });
    
    // Test basic queries with error handling
    try {
      const queryStart = performance.now();
      const menuItemCount = await prisma.menuItem.count();
      const categoryCount = await prisma.category.count();
      const queryTime = performance.now() - queryStart;
      
      console.log(`✅ Basic Queries: ${queryTime.toFixed(2)}ms`);
      console.log(`   • Menu Items: ${menuItemCount}`);
      console.log(`   • Categories: ${categoryCount}`);
      
      results.database.times.push({ operation: 'basic_queries', time: queryTime });
      
      // Test complex query
      const complexStart = performance.now();
      const menuWithCustomizations = await prisma.menuItem.findMany({
        include: {
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  customizations: true
                }
              }
            }
          },
          category: true
        },
        take: 5
      });
      const complexTime = performance.now() - complexStart;
      
      console.log(`✅ Complex Query (5 items with relations): ${complexTime.toFixed(2)}ms`);
      console.log(`   • Items loaded: ${menuWithCustomizations.length}`);
      
      results.database.times.push({ operation: 'complex_query', time: complexTime });
      
      // Database assessment
      if (connectTime < 100 && queryTime < 50 && complexTime < 200) {
        results.database.status = '✅';
        results.database.details.push('All database operations within excellent limits');
      } else if (connectTime < 300 && queryTime < 150 && complexTime < 500) {
        results.database.status = '⚠️';
        results.database.details.push('Database performance good but could be optimized');
      } else {
        results.database.status = '❌';
        results.database.details.push('Database performance needs attention');
      }
      
    } catch (dbError) {
      console.error(`❌ Database query error:`, dbError.message);
      results.database.details.push(`Database error: ${dbError.message}`);
    }

    // 2. MEMORY HEALTH CHECK
    console.log('\n2️⃣ MEMORY HEALTH CHECK');
    console.log('------------------------');
    
    const initialMemory = process.memoryUsage();
    console.log(`📊 Initial Memory Usage:`);
    console.log(`   • RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   • Heap Used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   • Heap Total: ${(initialMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    
    // Simulate some load
    console.log('\n🔄 Simulating load (fetching data 10 times)...');
    try {
      for (let i = 0; i < 10; i++) {
        await prisma.menuItem.findMany({
          include: {
            customizationGroups: true
          },
          take: 3
        });
        
        if (i % 3 === 0 && global.gc) {
          global.gc();
        }
      }
      
      const afterLoadMemory = process.memoryUsage();
      const memoryIncrease = afterLoadMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`📊 Memory After Load:`);
      console.log(`   • RSS: ${(afterLoadMemory.rss / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   • Heap Used: ${(afterLoadMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   • Memory Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
      
      // Memory assessment
      const memoryIncreasePercentage = (memoryIncrease / initialMemory.heapUsed) * 100;
      const heapUsedMB = afterLoadMemory.heapUsed / 1024 / 1024;
      
      if (memoryIncreasePercentage < 50 && heapUsedMB < 150) {
        results.memory.status = '✅';
        results.memory.details.push('Memory usage is excellent and stable');
      } else if (memoryIncreasePercentage < 100 && heapUsedMB < 300) {
        results.memory.status = '⚠️';
        results.memory.details.push('Memory usage is acceptable, monitor in production');
      } else {
        results.memory.status = '❌';
        results.memory.details.push('Memory usage indicates potential issues');
      }
      
    } catch (memError) {
      console.error(`❌ Memory test error:`, memError.message);
      results.memory.details.push('Memory test failed');
    }

    // 3. PERFORMANCE TEST
    console.log('\n3️⃣ PERFORMANCE STRESS TEST');
    console.log('----------------------------');
    
    try {
      // Test concurrent operations
      console.log('🔄 Testing concurrent database operations...');
      const concurrentStart = performance.now();
      
      const concurrentPromises = Array.from({ length: 5 }, async () => {
        return await prisma.menuItem.findMany({
          include: { category: true },
          take: 3
        });
      });
      
      await Promise.all(concurrentPromises);
      const concurrentTime = performance.now() - concurrentStart;
      
      console.log(`✅ 5 Concurrent Queries: ${concurrentTime.toFixed(2)}ms`);
      
      // Test different query types
      const singleStart = performance.now();
      await prisma.menuItem.findFirst();
      const singleTime = performance.now() - singleStart;
      
      console.log(`✅ Single Item Query: ${singleTime.toFixed(2)}ms`);
      
      // Performance assessment
      if (concurrentTime < 300 && singleTime < 50) {
        results.performance.status = '✅';
        results.performance.details.push('Excellent performance under load');
      } else if (concurrentTime < 1000 && singleTime < 200) {
        results.performance.status = '⚠️';
        results.performance.details.push('Good performance with optimization opportunities');
      } else {
        results.performance.status = '❌';
        results.performance.details.push('Performance needs optimization');
      }
      
    } catch (perfError) {
      console.error(`❌ Performance test error:`, perfError.message);
      results.performance.details.push('Performance test failed');
    }

    // 4. FINAL ASSESSMENT
    console.log('\n🎯 PRODUCTION READINESS ASSESSMENT');
    console.log('=====================================');
    
    const statusValues = [results.database.status, results.memory.status, results.performance.status];
    const greenCount = statusValues.filter(s => s === '✅').length;
    const yellowCount = statusValues.filter(s => s === '⚠️').length;
    const redCount = statusValues.filter(s => s === '❌').length;
    
    console.log(`📊 Status Summary:`);
    console.log(`   • Database: ${results.database.status}`);
    console.log(`   • Memory: ${results.memory.status}`);
    console.log(`   • Performance: ${results.performance.status}`);
    
    if (greenCount === 3) {
      results.overall = '🟢 EXCELLENT - READY FOR PRODUCTION';
      console.log('\n🟢 VERDICT: EXCELLENT - READY FOR PRODUCTION! 🚀');
      console.log('   ✅ All systems operating optimally');
      console.log('   ✅ Performance meets production standards');
      console.log('   ✅ Memory usage is healthy');
      console.log('   ✅ Safe to launch immediately');
    } else if (greenCount >= 2 && redCount === 0) {
      results.overall = '🟡 GOOD - READY FOR PRODUCTION WITH MONITORING';
      console.log('\n🟡 VERDICT: GOOD - READY FOR PRODUCTION WITH MONITORING 📊');
      console.log('   ✅ Core functionality is solid');
      console.log('   ⚠️  Some areas benefit from monitoring');
      console.log('   ✅ Safe to launch with performance tracking');
    } else if (redCount <= 1) {
      results.overall = '🟠 FAIR - LAUNCH WITH CAUTION';
      console.log('\n🟠 VERDICT: FAIR - LAUNCH WITH CAUTION ⚠️');
      console.log('   ⚠️  Some issues detected');
      console.log('   📊 Monitor closely after launch');
      console.log('   🔧 Plan optimization post-launch');
    } else {
      results.overall = '🔴 NEEDS OPTIMIZATION BEFORE PRODUCTION';
      console.log('\n🔴 VERDICT: NEEDS OPTIMIZATION BEFORE PRODUCTION ❌');
      console.log('   ❌ Multiple critical issues detected');
      console.log('   🔧 Address issues before launch');
    }
    
    console.log('\n💡 RECOMMENDATIONS FOR GO-LIVE:');
    console.log('   🔍 Set up application monitoring (memory, CPU, response times)');
    console.log('   📊 Implement logging for database performance');
    console.log('   🚨 Set up alerts for high memory usage or slow queries');
    console.log('   📈 Monitor user load and scale accordingly');
    console.log('   🔄 Regular database maintenance and cleanup');
    
    console.log('\n🎉 Your pizza app is looking delicious for production! 🍕\n');

  } catch (error) {
    console.error('❌ CRITICAL ERROR during health check:', error.message);
    results.overall = '🔴 CRITICAL ISSUES DETECTED';
  } finally {
    await prisma.$disconnect();
  }
  
  return results;
}

// Run the check
quickProductionHealthCheck()
  .then(results => {
    console.log('✅ Health check completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  });
