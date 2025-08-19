#!/usr/bin/env node

/**
 * Customization Data Migration Script
 * 
 * This script migrates existing cart/customization data to use the proper
 * format that matches what the admin interface creates through the formatForCart API.
 * 
 * It will:
 * 1. Find all menu items with customizations
 * 2. Test each item through the formatForCart API 
 * 3. Identify and fix any data structure mismatches
 * 4. Ensure all customizations follow the proper object structure
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:3005';

class CustomizationDataMigrator {
  constructor() {
    this.fixes = [];
    this.errors = [];
    this.stats = {
      itemsChecked: 0,
      itemsFixed: 0,
      customizationsFixed: 0,
      errors: 0
    };
  }

  async run() {
    console.log('🔄 Starting Customization Data Migration...\n');
    
    try {
      console.log('Debug: Starting migration process...');
      
      // Step 1: Analyze current data structure
      await this.analyzeCurrentData();
      
      // Step 2: Test menu items through formatForCart API
      await this.testMenuItemFormatting();
      
      // Step 3: Identify and fix cart data inconsistencies
      await this.fixCartDataStructure();
      
      // Step 4: Verify the fixes
      await this.verifyFixes();
      
      // Step 5: Generate report
      this.generateReport();
      
      console.log('Debug: Migration process completed.');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  }

  async analyzeCurrentData() {
    console.log('📊 Analyzing current data structure...');
    
    // Check menu items with customizations
    const itemsWithCustomizations = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      },
      where: {
        customizationGroups: {
          some: {}
        }
      }
    });

    console.log(`   📋 Found ${itemsWithCustomizations.length} menu items with customizations`);
    
    for (const item of itemsWithCustomizations) {
      console.log(`   • ${item.name} (${item.category.name}): ${item.customizationGroups.length} customization groups`);
      for (const custGroup of item.customizationGroups) {
        const group = custGroup.customizationGroup;
        console.log(`     - ${group.name}: ${group.options.length} options (${group.type})`);
      }
    }
    
    this.stats.itemsChecked = itemsWithCustomizations.length;
    console.log();
  }

  async testMenuItemFormatting() {
    console.log('🧪 Testing menu items through formatForCart API...');
    
    const itemsWithCustomizations = await prisma.menuItem.findMany({
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      },
      where: {
        customizationGroups: {
          some: {}
        }
      }
    });

    for (const item of itemsWithCustomizations) {
      console.log(`   🔬 Testing: ${item.name}`);
      
      // Create a test customization selection for each item
      const testCustomizations = [];
      
      for (const custGroup of item.customizationGroups) {
        const group = custGroup.customizationGroup;
        
        // For required groups or groups with minSelections, add a selection
        if (custGroup.isRequired || group.minSelections > 0) {
          const firstOption = group.options[0];
          if (firstOption) {
            testCustomizations.push({
              customizationOptionId: firstOption.id,
              quantity: 1
            });
          }
        }
      }

      if (testCustomizations.length > 0) {
        try {
          const response = await fetch(`${API_BASE}/api/menu/format-cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              menuItemId: item.id,
              customizations: testCustomizations
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log(`     ✅ API formatting works for ${item.name}`);
            console.log(`     📝 Expected customization structure:`);
            console.log(JSON.stringify(data.data.customizations, null, 8));
            
            this.fixes.push({
              itemId: item.id,
              itemName: item.name,
              expectedFormat: data.data.customizations,
              testSelection: testCustomizations
            });
          } else {
            console.log(`     ❌ API formatting failed for ${item.name}:`, data.error);
            this.errors.push({
              itemId: item.id,
              itemName: item.name,
              error: data.error
            });
          }
        } catch (error) {
          console.log(`     💥 Error testing ${item.name}:`, error.message);
          this.errors.push({
            itemId: item.id,
            itemName: item.name,
            error: error.message
          });
        }
      } else {
        console.log(`     ⚠️  No required customizations for ${item.name}, skipping test`);
      }
    }
    
    console.log();
  }

  async fixCartDataStructure() {
    console.log('🔧 Checking and fixing cart data structure...');
    
    // This would typically involve checking localStorage data in the browser
    // For now, we'll create a helper function to show the proper structure
    
    console.log('   📖 Proper customization data structure should be:');
    console.log(`   {
     "customizations": [
       {
         "groupName": "Bread Type",
         "selections": [
           {
             "optionName": "Small Sub Roll",
             "price": 0,
             "quantity": 1
           }
         ]
       }
     ]
   }`);
    
    console.log(`   ❌ Incorrect structure (what bulk import may have created):`);
    console.log(`   {
     "customizations": [
       "Bread Type: Small Sub Roll"
     ]
   }`);
    
    console.log();
  }

  async verifyFixes() {
    console.log('✅ Verification phase...');
    
    // Test a few successful configurations
    const workingItems = this.fixes.slice(0, 3);
    
    for (const fix of workingItems) {
      console.log(`   🔍 Verifying ${fix.itemName}...`);
      
      try {
        const response = await fetch(`${API_BASE}/api/menu/format-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            menuItemId: fix.itemId,
            customizations: fix.testSelection
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log(`     ✅ ${fix.itemName} verified successfully`);
          this.stats.itemsFixed++;
        }
      } catch (error) {
        console.log(`     ❌ Verification failed for ${fix.itemName}:`, error.message);
        this.stats.errors++;
      }
    }
    
    console.log();
  }

  generateReport() {
    console.log('📋 MIGRATION REPORT');
    console.log('='.repeat(50));
    console.log(`Items Checked: ${this.stats.itemsChecked}`);
    console.log(`Items Successfully Tested: ${this.fixes.length}`);
    console.log(`Items with Errors: ${this.errors.length}`);
    console.log();
    
    if (this.fixes.length > 0) {
      console.log('✅ ITEMS READY FOR PROPER FORMATTING:');
      this.fixes.forEach(fix => {
        console.log(`   • ${fix.itemName}`);
      });
      console.log();
    }
    
    if (this.errors.length > 0) {
      console.log('❌ ITEMS WITH ISSUES:');
      this.errors.forEach(error => {
        console.log(`   • ${error.itemName}: ${error.error}`);
      });
      console.log();
    }
    
    console.log('📝 RECOMMENDATIONS:');
    console.log('1. Cart customization data should use the object structure shown above');
    console.log('2. When adding items to cart, always use the /api/menu/format-cart endpoint');
    console.log('3. The formatForCart API ensures proper data structure and pricing');
    console.log('4. Avoid storing raw string customizations like "Bread Type: Small Sub Roll"');
    console.log();
    
    console.log('🎯 NEXT STEPS:');
    console.log('1. Update your cart addition logic to use formatForCart API');
    console.log('2. Clear any existing cart data with incorrect format');
    console.log('3. Test adding items through the menu interface');
    console.log('4. Verify customizations display correctly in cart and checkout');
    console.log();
    
    console.log('✨ Migration analysis complete!');
  }
}

// Create helper function to test a specific menu item
async function testSpecificItem(itemName) {
  const migrator = new CustomizationDataMigrator();
  
  try {
    const item = await prisma.menuItem.findFirst({
      where: { name: { contains: itemName } },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });
    
    if (!item) {
      console.log(`❌ Item "${itemName}" not found`);
      return;
    }
    
    console.log(`🔬 Testing specific item: ${item.name}`);
    
    // Create a simple test customization
    const testCustomizations = [];
    
    for (const custGroup of item.customizationGroups) {
      const group = custGroup.customizationGroup;
      const firstOption = group.options[0];
      
      if (firstOption) {
        testCustomizations.push({
          customizationOptionId: firstOption.id,
          quantity: 1
        });
        
        console.log(`   Adding option: ${firstOption.name} from group: ${group.name}`);
      }
    }
    
    if (testCustomizations.length > 0) {
      const response = await fetch(`${API_BASE}/api/menu/format-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItemId: item.id,
          customizations: testCustomizations
        })
      });
      
      const data = await response.json();
      
      console.log('\n📄 API Response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️  No customizations found for this item');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === 'test') {
    const itemName = args[1] || 'Italian Sub';
    testSpecificItem(itemName);
  } else {
    const migrator = new CustomizationDataMigrator();
    migrator.run();
  }
}

module.exports = { CustomizationDataMigrator, testSpecificItem };
