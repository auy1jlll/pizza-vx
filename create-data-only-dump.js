const { Client } = require('pg');
const fs = require('fs');

async function createDataOnlyDump() {
  const client = new Client({
    connectionString: "postgresql://auy1jll:_Zx-nake@6172@localhost:5432/pizzax"
  });

  try {
    await client.connect();
    console.log('✅ Connected to local database');

    let sqlDump = '';
    
    // Disable constraints during import
    sqlDump += '-- Disable foreign key checks\n';
    sqlDump += 'SET session_replication_role = replica;\n\n';

    // Clear existing data first
    sqlDump += '-- Clear existing data\n';
    sqlDump += 'TRUNCATE TABLE cart_item_customizations, cart_item_pizza_toppings, cart_items CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE customer_addresses, customer_favorites, customer_profiles CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE email_logs, email_settings, email_templates CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE item_modifiers, jwt_blacklist, jwt_secrets CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE menu_item_customizations CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE order_item_customizations, order_item_toppings, order_items CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE orders CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE price_snapshots, pricing_history CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE refresh_tokens CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE menu_items CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE menu_categories CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE customization_options CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE customization_groups CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE specialty_pizza_sizes, specialty_calzone_sizes CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE specialty_pizzas, specialty_calzones CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE pizza_toppings, pizza_sizes, pizza_sauces, pizza_crusts CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE promotions CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE employee_profiles CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE users CASCADE;\n';
    sqlDump += 'TRUNCATE TABLE app_settings CASCADE;\n';
    sqlDump += '\n';

    // Tables in dependency order
    const tableOrder = [
      'app_settings',
      'users', 
      'employee_profiles',
      'customer_profiles',
      'customer_addresses',
      'customer_favorites',
      'pizza_sizes',
      'pizza_crusts', 
      'pizza_sauces',
      'pizza_toppings',
      'menu_categories',
      'menu_items',
      'customization_groups',
      'customization_options',
      'menu_item_customizations',
      'specialty_pizzas',
      'specialty_pizza_sizes',
      'specialty_calzones',
      'specialty_calzone_sizes',
      'promotions',
      'orders',
      'order_items',
      'order_item_toppings',
      'order_item_customizations',
      'cart_items',
      'cart_item_customizations',
      'cart_item_pizza_toppings'
    ];

    for (const tableName of tableOrder) {
      console.log(`📝 Processing table: ${tableName}`);

      // Get table columns
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [tableName]);

      // Get table data
      const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
      
      if (dataResult.rows.length > 0) {
        console.log(`  📊 ${dataResult.rows.length} rows`);
        
        const columnNames = columnsResult.rows.map(col => `"${col.column_name}"`).join(', ');
        
        for (const row of dataResult.rows) {
          const values = columnsResult.rows.map(col => {
            const value = row[col.column_name];
            if (value === null) return 'NULL';
            if (typeof value === 'string') {
              return `'${value.replace(/'/g, "''")}'`;
            }
            if (typeof value === 'boolean') {
              return value ? 'TRUE' : 'FALSE';
            }
            if (value instanceof Date) {
              return `'${value.toISOString()}'`;
            }
            if (Array.isArray(value)) {
              return `'${JSON.stringify(value)}'`;
            }
            return value;
          }).join(', ');

          sqlDump += `INSERT INTO "${tableName}" (${columnNames}) VALUES (${values});\n`;
        }
        sqlDump += '\n';
      } else {
        console.log(`  📊 0 rows`);
      }
    }

    // Re-enable constraints
    sqlDump += '-- Re-enable foreign key checks\n';
    sqlDump += 'SET session_replication_role = DEFAULT;\n';

    // Write to file
    fs.writeFileSync('data-only-dump.sql', sqlDump);
    console.log('✅ Data-only SQL dump created: data-only-dump.sql');
    console.log(`📁 File size: ${(fs.statSync('data-only-dump.sql').size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error creating data dump:', error.message);
  } finally {
    await client.end();
  }
}

createDataOnlyDump();
