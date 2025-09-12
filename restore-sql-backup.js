const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreFromSQL() {
  console.log('🔄 Restoring database from SQL backup files...');
  
  try {
    const backupDir = path.join(__dirname, 'backups91125');
    const dataFile = path.join(backupDir, '02-data.sql');
    
    // Check if backup files exist
    if (!fs.existsSync(dataFile)) {
      throw new Error(`Data file not found: ${dataFile}`);
    }
    
    console.log('📂 Reading SQL backup files...');
    
    // Read the data SQL file
    const dataSql = fs.readFileSync(dataFile, 'utf8');
    
    console.log('🗑️ Clearing existing data...');
    
    // Clear data in the correct order (respecting foreign key constraints)
    const clearQueries = [
      'DELETE FROM cart_item_pizza_toppings;',
      'DELETE FROM cart_item_customizations;',
      'DELETE FROM cart_items;',
      'DELETE FROM order_item_toppings;',
      'DELETE FROM order_item_customizations;',
      'DELETE FROM order_items;',
      'DELETE FROM orders;',
      'DELETE FROM menu_item_customizations;',
      'DELETE FROM customization_options;',
      'DELETE FROM customization_groups;',
      'DELETE FROM pizza_toppings;',
      'DELETE FROM menu_items;',
      'DELETE FROM menu_categories;',
      'DELETE FROM specialty_pizza_sizes;',
      'DELETE FROM specialty_pizzas;',
      'DELETE FROM specialty_calzone_sizes;',
      'DELETE FROM specialty_calzones;',
      'DELETE FROM pizza_sizes;',
      'DELETE FROM pizza_crusts;',
      'DELETE FROM pizza_sauces;',
      'DELETE FROM customer_addresses;',
      'DELETE FROM customer_favorites;',
      'DELETE FROM customer_profiles;',
      'DELETE FROM employee_profiles;',
      'DELETE FROM users;',
      'DELETE FROM app_settings;',
      'DELETE FROM email_logs;',
      'DELETE FROM email_templates;',
      'DELETE FROM email_settings;',
      'DELETE FROM promotions;',
      'DELETE FROM refresh_tokens;',
      'DELETE FROM jwt_blacklist;',
      'DELETE FROM jwt_secrets;',
      'DELETE FROM price_snapshots;',
      'DELETE FROM pricing_history;',
    ];
    
    for (const query of clearQueries) {
      try {
        await prisma.$executeRawUnsafe(query);
      } catch (error) {
        // Continue if table doesn't exist or other non-critical errors
        console.log(`⚠️ Warning clearing table: ${error.message}`);
      }
    }
    
    console.log('✅ Existing data cleared');
    
    console.log('📥 Converting PostgreSQL COPY format to INSERT statements...');
    
    // Parse COPY statements and convert to INSERT
    const lines = dataSql.split('\n');
    const insertStatements = [];
    let currentTable = null;
    let currentColumns = null;
    let inCopyBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for COPY statement
      const copyMatch = line.match(/^COPY\s+public\.(\w+)\s+\(([^)]+)\)\s+FROM\s+stdin;?/i);
      if (copyMatch) {
        currentTable = copyMatch[1];
        currentColumns = copyMatch[2].split(',').map(col => col.trim().replace(/"/g, ''));
        inCopyBlock = true;
        continue;
      }
      
      // Check for end of COPY block
      if (line === '\\.' || line === '\\.') {
        inCopyBlock = false;
        currentTable = null;
        currentColumns = null;
        continue;
      }
      
      // Process data lines
      if (inCopyBlock && line && !line.startsWith('--') && currentTable && currentColumns) {
        try {
          // Split by tabs (PostgreSQL COPY format uses tabs)
          const values = line.split('\t');
          
          if (values.length === currentColumns.length) {
            // Format values for SQL
            const formattedValues = values.map(value => {
              if (value === '\\N' || value === '') return 'NULL';
              if (value.match(/^\d{4}-\d{2}-\d{2}/)) return `'${value}'`; // Dates
              if (value.match(/^[\d.-]+$/)) return value; // Numbers
              if (value.startsWith('{') || value.startsWith('[')) return `'${value.replace(/'/g, "''")}'`; // JSON
              return `'${value.replace(/'/g, "''")}'`; // Strings
            });
            
            const insertSQL = `INSERT INTO "${currentTable}" ("${currentColumns.join('", "')}") VALUES (${formattedValues.join(', ')})`;
            insertStatements.push(insertSQL);
          }
        } catch (error) {
          console.log(`⚠️ Error processing line for table ${currentTable}: ${error.message}`);
        }
      }
    }
    
    console.log(`🔢 Generated ${insertStatements.length} INSERT statements from COPY format`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute the INSERT statements
    for (let i = 0; i < insertStatements.length; i++) {
      try {
        await prisma.$executeRawUnsafe(insertStatements[i]);
        successCount++;
        
        if ((i + 1) % 50 === 0) {
          console.log(`⏳ Progress: ${i + 1}/${insertStatements.length} statements executed`);
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 10) { // Only show first 10 errors to avoid spam
          console.log(`⚠️ Error in statement ${i + 1}: ${error.message.substring(0, 100)}...`);
        }
      }
    }
    
    console.log(`\n📊 Restore Summary:`);
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    console.log(`📈 Success rate: ${((successCount / insertStatements.length) * 100).toFixed(1)}%`);
    
    // Verify the restore by checking some key tables
    console.log('\n🔍 Verifying restored data...');
    
    const verification = {
      users: await prisma.user.count(),
      menuCategories: await prisma.menuCategory.count(),
      menuItems: await prisma.menuItem.count(),
      pizzaSizes: await prisma.pizzaSize.count(),
      pizzaToppings: await prisma.pizzaTopping.count(),
      appSettings: await prisma.appSetting.count(),
    };
    
    console.log('\n📈 Data verification:');
    Object.entries(verification).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records`);
    });
    
    if (Object.values(verification).every(count => count > 0)) {
      console.log('\n🎉 DATABASE RESTORATION SUCCESSFUL!');
      console.log('✅ All key tables have been populated with data');
    } else {
      console.log('\n⚠️ PARTIAL RESTORATION');
      console.log('Some tables may not have been restored completely');
    }
    
  } catch (error) {
    console.error('❌ Error restoring database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the restore
if (require.main === module) {
  restoreFromSQL()
    .then(() => {
      console.log('✅ Restore process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Restore failed:', error.message);
      process.exit(1);
    });
}

module.exports = { restoreFromSQL };