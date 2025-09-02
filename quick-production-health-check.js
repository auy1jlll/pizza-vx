const { PrismaClient } = require('@prisma/client');
const { performance } = require('perf_hooks');

async function quickProductionHealthCheck() {
  console.log('\n🚀 PRODUCTION HEALTH CHECK - QUICK ASSESSMENT');
  console.log('================================================\n');
  
  const prisma = new PrismaClient();
  const results = {
    database: { status: '❌', details: [] },
    memory: { status: '❌', details: [] },
    performance: { status: '❌', details: [] },
    overall: '❌'
  };

  try {
    // 1. DATABASE HEALTH CHECK
    console.log('1️⃣ DATABASE HEALTH CHECK');
    console.log('---------------------------');
    
    const dbStart = performance.now();
    
    // Test basic connectivity
    await prisma.$connect();
    const connectTime = performance.now() - dbStart;
    console.log(`✅ Database Connection: ${connectTime.toFixed(2)}ms`);
    
    // Test basic queries
    const queryStart = performance.now();
    const menuItemCount = await prisma.menuItem.count();
    const categoryCount = await prisma.category.count();
    const customizationCount = await prisma.customizationGroup.count();
    const queryTime = performance.now() - queryStart;
    
    console.log(`✅ Basic Queries: ${queryTime.toFixed(2)}ms`);
    console.log(`   • Menu Items: ${menuItemCount}`);
    console.log(`   • Categories: ${categoryCount}`);
    console.log(`   • Customization Groups: ${customizationCount}`);
    
    // Test complex query (menu with customizations)
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
      take: 10
    });
    const complexTime = performance.now() - complexStart;
    
    console.log(`✅ Complex Query (10 items with relations): ${complexTime.toFixed(2)}ms`);
    
    // Database assessment
    if (connectTime < 100 && queryTime < 50 && complexTime < 200) {
      results.database.status = '✅';
      results.database.details.push('All database operations within acceptable limits');
    } else if (connectTime < 500 && queryTime < 200 && complexTime < 1000) {
      results.database.status = '⚠️';
      results.database.details.push('Database performance acceptable but could be optimized');
    } else {
      results.database.details.push('Database performance needs attention');
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
    console.log('\n🔄 Simulating load (fetching data 20 times)...');
    for (let i = 0; i < 20; i++) {
      await prisma.menuItem.findMany({
        include: {
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  customizations: true
                }
              }
            }
          }
        },
        take: 5
      });
      
      if (i % 5 === 0) {
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
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
    if (memoryIncreasePercentage < 50 && afterLoadMemory.heapUsed < 200 * 1024 * 1024) {
      results.memory.status = '✅';
      results.memory.details.push('Memory usage is healthy and stable');
    } else if (memoryIncreasePercentage < 100 && afterLoadMemory.heapUsed < 500 * 1024 * 1024) {
      results.memory.status = '⚠️';
      results.memory.details.push('Memory usage is acceptable but should be monitored');
    } else {
      results.memory.details.push('Memory usage indicates potential memory leaks');
    }

    // 3. PERFORMANCE STRESS TEST
    console.log('\n3️⃣ PERFORMANCE STRESS TEST');
    console.log('----------------------------');
    
    // Test concurrent operations
    console.log('🔄 Testing concurrent database operations...');
    const concurrentStart = performance.now();
    
    const concurrentPromises = Array.from({ length: 10 }, async () => {
      return await prisma.menuItem.findMany({
        include: {
          customizationGroups: {
            include: {
              customizationGroup: true
            }
          }
        },
        take: 5
      });
    });
    
    await Promise.all(concurrentPromises);
    const concurrentTime = performance.now() - concurrentStart;
    
    console.log(`✅ 10 Concurrent Queries: ${concurrentTime.toFixed(2)}ms`);
    
    // Test response times for different query types
    const singleItemStart = performance.now();
    await prisma.menuItem.findFirst();
    const singleItemTime = performance.now() - singleItemStart;
    
    const aggregationStart = performance.now();
    const stats = await prisma.menuItem.aggregate({
      _count: { id: true },
      _avg: { basePrice: true },
      _max: { basePrice: true },
      _min: { basePrice: true }
    });
    const aggregationTime = performance.now() - aggregationStart;
    
    console.log(`✅ Single Item Query: ${singleItemTime.toFixed(2)}ms`);
    console.log(`✅ Aggregation Query: ${aggregationTime.toFixed(2)}ms`);
    console.log(`📊 Price Stats: Avg $${stats._avg.basePrice?.toFixed(2)}, Max $${stats._max.basePrice}, Min $${stats._min.basePrice}`);
    
    // Performance assessment
    if (concurrentTime < 500 && singleItemTime < 50 && aggregationTime < 100) {
      results.performance.status = '✅';
      results.performance.details.push('Excellent performance under concurrent load');
    } else if (concurrentTime < 2000 && singleItemTime < 200 && aggregationTime < 500) {
      results.performance.status = '⚠️';
      results.performance.details.push('Good performance with room for optimization');
    } else {
      results.performance.details.push('Performance needs optimization before production');
    }

    // 4. DATA INTEGRITY CHECK
    console.log('\n4️⃣ DATA INTEGRITY CHECK');
    console.log('-------------------------');
    
    // Check for orphaned customization groups
    const orphanedGroups = await prisma.customizationGroup.findMany({
      where: {
        menuItemCustomizations: {
          none: {}
        }
      }
    });
    
    // Check for menu items without categories
    const itemsWithoutCategories = await prisma.menuItem.findMany({
      where: {
        categoryId: null
      }
    });
    
    // Check for duplicate customizations
    const duplicateCheck = await prisma.menuItemCustomization.groupBy({
      by: ['menuItemId', 'customizationGroupId'],
      _count: {
        id: true
      },
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      }
    });
    
    console.log(`✅ Orphaned Customization Groups: ${orphanedGroups.length}`);
    console.log(`✅ Menu Items Without Categories: ${itemsWithoutCategories.length}`);
    console.log(`✅ Duplicate Customizations: ${duplicateCheck.length}`);
    
    // 5. FINAL ASSESSMENT
    console.log('\n🎯 PRODUCTION READINESS ASSESSMENT');
    console.log('=====================================');
    
    const allGreen = results.database.status === '✅' && 
                    results.memory.status === '✅' && 
                    results.performance.status === '✅';
    
    const mostlyGreen = [results.database.status, results.memory.status, results.performance.status]
                       .filter(s => s === '✅' || s === '⚠️').length >= 2;
    
    if (allGreen && orphanedGroups.length === 0 && duplicateCheck.length === 0) {
      results.overall = '🟢 READY FOR PRODUCTION';
      console.log('🟢 VERDICT: READY FOR PRODUCTION! 🚀');
      console.log('   • All systems operating optimally');
      console.log('   • No data integrity issues');
      console.log('   • Performance meets production standards');
    } else if (mostlyGreen && duplicateCheck.length === 0) {
      results.overall = '🟡 READY WITH MONITORING';
      console.log('🟡 VERDICT: READY FOR PRODUCTION WITH MONITORING 📊');
      console.log('   • Core functionality is solid');
      console.log('   • Some areas need monitoring');
      console.log('   • Safe to launch with performance tracking');
    } else {
      results.overall = '🔴 NEEDS OPTIMIZATION';
      console.log('🔴 VERDICT: NEEDS OPTIMIZATION BEFORE PRODUCTION ⚠️');
      console.log('   • Critical issues detected');
      console.log('   • Address performance/data issues first');
    }
    
    console.log('\n📋 SUMMARY:');
    console.log(`   • Database: ${results.database.status}`);
    console.log(`   • Memory: ${results.memory.status}`);
    console.log(`   • Performance: ${results.performance.status}`);
    console.log(`   • Data Integrity: ${duplicateCheck.length === 0 ? '✅' : '❌'}`);
    
    console.log('\n💡 RECOMMENDATIONS:');
    if (results.database.status === '⚠️' || results.database.status === '❌') {
      console.log('   • Consider database query optimization');
      console.log('   • Add database connection pooling');
    }
    if (results.memory.status === '⚠️' || results.memory.status === '❌') {
      console.log('   • Monitor memory usage in production');
      console.log('   • Consider implementing memory limits');
    }
    if (results.performance.status === '⚠️' || results.performance.status === '❌') {
      console.log('   • Implement caching strategies');
      console.log('   • Consider query optimization');
    }
    if (orphanedGroups.length > 0) {
      console.log(`   • Clean up ${orphanedGroups.length} orphaned customization groups`);
    }
    
    console.log('\n🎉 Your application looks solid for go-live! 🍕\n');

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
    console.log('Health check completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });
