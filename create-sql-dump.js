const { Client } = require('pg');
const fs = require('fs');

async function createSQLDump() {
  const client = new Client({
    connectionString: "postgresql://auy1jll:_Zx-nake@6172@localhost:5432/pizzax"
  });

  try {
    await client.connect();
    console.log('✅ Connected to local database');

    let sqlDump = '';

    // Get all table names
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log(`📋 Found ${tablesResult.rows.length} tables`);

    // Disable constraints during import
    sqlDump += '-- Disable foreign key checks\n';
    sqlDump += 'SET session_replication_role = replica;\n\n';

    // For each table, get the schema and data
    for (const table of tablesResult.rows) {
      const tableName = table.tablename;
      console.log(`📝 Processing table: ${tableName}`);

      // Get table schema
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [tableName]);

      // Create DROP and CREATE statements
      sqlDump += `-- Table: ${tableName}\n`;
      sqlDump += `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n`;
      
      let createTable = `CREATE TABLE "${tableName}" (\n`;
      const columns = [];
      
      for (const col of schemaResult.rows) {
        let colDef = `  "${col.column_name}" ${col.data_type.toUpperCase()}`;
        
        if (col.data_type === 'character varying') {
          // Get character maximum length
          const lengthResult = await client.query(`
            SELECT character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = $1 AND column_name = $2
          `, [tableName, col.column_name]);
          
          if (lengthResult.rows[0]?.character_maximum_length) {
            colDef = `  "${col.column_name}" VARCHAR(${lengthResult.rows[0].character_maximum_length})`;
          } else {
            colDef = `  "${col.column_name}" TEXT`;
          }
        } else if (col.data_type === 'integer') {
          colDef = `  "${col.column_name}" INTEGER`;
        } else if (col.data_type === 'timestamp without time zone') {
          colDef = `  "${col.column_name}" TIMESTAMP`;
        } else if (col.data_type === 'boolean') {
          colDef = `  "${col.column_name}" BOOLEAN`;
        } else if (col.data_type === 'numeric') {
          colDef = `  "${col.column_name}" DECIMAL`;
        } else if (col.data_type === 'text') {
          colDef = `  "${col.column_name}" TEXT`;
        }

        if (col.is_nullable === 'NO') {
          colDef += ' NOT NULL';
        }

        if (col.column_default) {
          if (col.column_default.includes('nextval')) {
            colDef += ' SERIAL PRIMARY KEY';
          } else {
            colDef += ` DEFAULT ${col.column_default}`;
          }
        }

        columns.push(colDef);
      }

      createTable += columns.join(',\n') + '\n);\n\n';
      sqlDump += createTable;

      // Get table data
      const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
      
      if (dataResult.rows.length > 0) {
        console.log(`  📊 ${dataResult.rows.length} rows`);
        
        const columnNames = schemaResult.rows.map(col => `"${col.column_name}"`).join(', ');
        
        for (const row of dataResult.rows) {
          const values = schemaResult.rows.map(col => {
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
    fs.writeFileSync('local-database-dump.sql', sqlDump);
    console.log('✅ SQL dump created: local-database-dump.sql');
    console.log(`📁 File size: ${(fs.statSync('local-database-dump.sql').size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error creating SQL dump:', error.message);
  } finally {
    await client.end();
  }
}

createSQLDump();
