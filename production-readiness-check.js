const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function performanceHealthCheck() {
  console.log('🚀 PRODUCTION READINESS CHECK - Performance & Memory Audit\n');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  let issues = [];
  let warnings = [];
  let passed = [];

  try {
    // 1. DATABASE PERFORMANCE CHECK
    console.log('\n📊 DATABASE PERFORMANCE ANALYSIS');
    console.log('-'.repeat(40));
    
    const dbStart = Date.now();
    
    // Test critical queries performance
    const tests = [
      { name: 'Menu Categories Query', query: () => prisma.menuCategory.findMany({ include: { _count: { select: { menuItems: true } } } }) },
      { name: 'Menu Items Query', query: () => prisma.menuItem.findMany({ take: 50, include: { category: true, customizationGroups: true } }) },
      { name: 'Customization Groups Query', query: () => prisma.customizationGroup.findMany({ include: { options: true, _count: { select: { menuItemCustomizations: true } } } }) },
      { name: 'Settings Query', query: () => prisma.appSetting.findMany() },
      { name: 'Orders Query', query: () => prisma.order.findMany({ take: 20, include: { items: true } }) }
    ];

    for (const test of tests) {
      const queryStart = Date.now();
      try {
        const result = await test.query();
        const queryTime = Date.now() - queryStart;
        const resultCount = Array.isArray(result) ? result.length : 1;
        
        if (queryTime < 100) {
          passed.push(`✅ ${test.name}: ${queryTime}ms (${resultCount} records) - EXCELLENT`);
        } else if (queryTime < 500) {
          warnings.push(`⚠️  ${test.name}: ${queryTime}ms (${resultCount} records) - ACCEPTABLE`);
        } else {
          issues.push(`❌ ${test.name}: ${queryTime}ms (${resultCount} records) - TOO SLOW`);
        }
      } catch (error) {
        issues.push(`❌ ${test.name}: FAILED - ${error.message}`);
      }
    }

    const dbTime = Date.now() - dbStart;
    console.log(`   Database total test time: ${dbTime}ms\n`);

    // 2. DATA INTEGRITY CHECK
    console.log('🔍 DATA INTEGRITY ANALYSIS');
    console.log('-'.repeat(40));

    // Check for orphaned records
    const orphanChecks = [
      { name: 'Menu Items without Categories', query: () => prisma.menuItem.count({ where: { category: null } }) },
      { name: 'Customization Options without Groups', query: () => prisma.customizationOption.count({ where: { group: null } }) },
      { name: 'Order Items without Orders', query: () => prisma.orderItem.count({ where: { order: null } }) }
    ];

    for (const check of orphanChecks) {
      try {
        const count = await check.query();
        if (count === 0) {
          passed.push(`✅ ${check.name}: 0 orphaned records`);
        } else {
          issues.push(`❌ ${check.name}: ${count} orphaned records found`);
        }
      } catch (error) {
        warnings.push(`⚠️  ${check.name}: Could not check - ${error.message}`);
      }
    }

    // Check for duplicate customizations (our recent fix)
    const allItems = await prisma.menuItem.findMany({
      include: { customizationGroups: { include: { customizationGroup: true } } }
    });

    let duplicateConnections = 0;
    allItems.forEach(item => {
      const groupCounts = new Map();
      item.customizationGroups.forEach(cg => {
        const key = cg.customizationGroup.id;
        groupCounts.set(key, (groupCounts.get(key) || 0) + 1);
      });
      
      for (const [groupId, count] of groupCounts) {
        if (count > 1) duplicateConnections += count - 1;
      }
    });

    if (duplicateConnections === 0) {
      passed.push(`✅ Duplicate Customizations: 0 duplicates found`);
    } else {
      issues.push(`❌ Duplicate Customizations: ${duplicateConnections} duplicates found`);
    }

    // 3. MEMORY USAGE SIMULATION
    console.log('\n🧠 MEMORY USAGE SIMULATION');
    console.log('-'.repeat(40));

    const memStart = process.memoryUsage();
    
    // Simulate heavy data loading
    const heavyData = [];
    for (let i = 0; i < 5; i++) {
      const menuData = await prisma.menuItem.findMany({
        include: {
          category: true,
          customizationGroups: {
            include: {
              customizationGroup: {
                include: { options: true }
              }
            }
          }
        }
      });
      heavyData.push(menuData);
    }

    const memAfter = process.memoryUsage();
    const memDiff = {
      rss: memAfter.rss - memStart.rss,
      heapUsed: memAfter.heapUsed - memStart.heapUsed,
      heapTotal: memAfter.heapTotal - memStart.heapTotal
    };

    console.log(`   Memory usage for heavy data loading:`);
    console.log(`   RSS: ${(memDiff.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Used: ${(memDiff.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Total: ${(memDiff.heapTotal / 1024 / 1024).toFixed(2)} MB`);

    if (memDiff.heapUsed / 1024 / 1024 < 50) {
      passed.push(`✅ Memory Usage: ${(memDiff.heapUsed / 1024 / 1024).toFixed(2)} MB - EXCELLENT`);
    } else if (memDiff.heapUsed / 1024 / 1024 < 100) {
      warnings.push(`⚠️  Memory Usage: ${(memDiff.heapUsed / 1024 / 1024).toFixed(2)} MB - ACCEPTABLE`);
    } else {
      issues.push(`❌ Memory Usage: ${(memDiff.heapUsed / 1024 / 1024).toFixed(2)} MB - TOO HIGH`);
    }

    // 4. DATABASE CONNECTION POOL TEST
    console.log('\n🔗 DATABASE CONNECTION POOL TEST');
    console.log('-'.repeat(40));

    const connectionStart = Date.now();
    const connectionPromises = [];
    
    // Test 10 concurrent database operations
    for (let i = 0; i < 10; i++) {
      connectionPromises.push(
        prisma.appSetting.findFirst({ where: { key: 'app_name' } })
      );
    }

    try {
      await Promise.all(connectionPromises);
      const connectionTime = Date.now() - connectionStart;
      
      if (connectionTime < 1000) {
        passed.push(`✅ Connection Pool: ${connectionTime}ms for 10 concurrent queries - EXCELLENT`);
      } else if (connectionTime < 2000) {
        warnings.push(`⚠️  Connection Pool: ${connectionTime}ms for 10 concurrent queries - ACCEPTABLE`);
      } else {
        issues.push(`❌ Connection Pool: ${connectionTime}ms for 10 concurrent queries - TOO SLOW`);
      }
    } catch (error) {
      issues.push(`❌ Connection Pool: FAILED - ${error.message}`);
    }

    // 5. LARGE DATASET HANDLING
    console.log('\n📈 LARGE DATASET HANDLING TEST');
    console.log('-'.repeat(40));

    const largeDataStart = Date.now();
    try {
      // Test pagination performance
      const page1 = await prisma.menuItem.findMany({ take: 50, skip: 0 });
      const page2 = await prisma.menuItem.findMany({ take: 50, skip: 50 });
      const largeDataTime = Date.now() - largeDataStart;
      
      if (largeDataTime < 200) {
        passed.push(`✅ Pagination: ${largeDataTime}ms for 100 items - EXCELLENT`);
      } else if (largeDataTime < 500) {
        warnings.push(`⚠️  Pagination: ${largeDataTime}ms for 100 items - ACCEPTABLE`);
      } else {
        issues.push(`❌ Pagination: ${largeDataTime}ms for 100 items - TOO SLOW`);
      }
    } catch (error) {
      issues.push(`❌ Pagination: FAILED - ${error.message}`);
    }

    // 6. MEMORY LEAK DETECTION
    console.log('\n🔍 MEMORY LEAK DETECTION');
    console.log('-'.repeat(40));

    const initialMem = process.memoryUsage();
    
    // Simulate multiple operations that could cause leaks
    for (let i = 0; i < 20; i++) {
      const data = await prisma.menuCategory.findMany({ include: { menuItems: true } });
      // Intentionally not storing the data to simulate proper cleanup
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMem = process.memoryUsage();
    const memLeak = finalMem.heapUsed - initialMem.heapUsed;

    if (Math.abs(memLeak) < 5 * 1024 * 1024) { // Less than 5MB difference
      passed.push(`✅ Memory Leak Test: ${(memLeak / 1024 / 1024).toFixed(2)} MB difference - NO LEAKS DETECTED`);
    } else {
      issues.push(`❌ Memory Leak Test: ${(memLeak / 1024 / 1024).toFixed(2)} MB difference - POSSIBLE MEMORY LEAK`);
    }

  } catch (error) {
    issues.push(`❌ Critical Error: ${error.message}`);
  }

  const totalTime = Date.now() - startTime;

  // FINAL REPORT
  console.log('\n' + '='.repeat(60));
  console.log('🎯 PRODUCTION READINESS REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n✅ PASSED TESTS (${passed.length}):`);
  passed.forEach(item => console.log(`   ${item}`));
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(item => console.log(`   ${item}`));
  }
  
  if (issues.length > 0) {
    console.log(`\n❌ CRITICAL ISSUES (${issues.length}):`);
    issues.forEach(item => console.log(`   ${item}`));
  }

  console.log(`\n📊 PERFORMANCE SUMMARY:`);
  console.log(`   Total test time: ${totalTime}ms`);
  console.log(`   Current memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Tests passed: ${passed.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log(`   Critical issues: ${issues.length}`);

  // FINAL VERDICT
  console.log('\n🚀 PRODUCTION READINESS VERDICT:');
  if (issues.length === 0 && warnings.length <= 2) {
    console.log('✅ READY FOR PRODUCTION! Your app is performing excellently.');
  } else if (issues.length === 0) {
    console.log('⚠️  MOSTLY READY - Address warnings for optimal performance.');
  } else {
    console.log('❌ NOT READY - Critical issues must be resolved before production.');
  }

  console.log('\n' + '='.repeat(60));

  await prisma.$disconnect();
}

performanceHealthCheck().catch(console.error);
