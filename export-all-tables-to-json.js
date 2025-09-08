const fs = require('fs');
const path = require('path');

// Lazy-load dotenv if available to read .env without requiring it to be installed
try {
  require('dotenv').config();
} catch (_) {
  // dotenv is optional; ignore if not installed
}

const { Client } = require('pg');

async function exportAllTablesToJson() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Please set it in .env or the shell.');
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const tablesResult = await client.query(
      `
        select table_name
        from information_schema.tables
        where table_schema = 'public' and table_type = 'BASE TABLE'
        order by table_name
      `
    );

    const tableNames = tablesResult.rows.map(r => r.table_name);
    const exportObject = {
      timestamp: new Date().toISOString(),
      database_url_host: new URL(databaseUrl).host,
      schema: 'public',
      tables: {},
    };

    for (const tableName of tableNames) {
      const safeIdent = '"' + tableName.replace(/"/g, '""') + '"';
      const { rows } = await client.query(`select * from ${safeIdent}`);
      exportObject.tables[tableName] = rows;
    }

    const outfile = path.join(
      process.cwd(),
      `full_database_export_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    );

    fs.writeFileSync(outfile, JSON.stringify(exportObject, null, 2));
    console.log(`Exported ${Object.keys(exportObject.tables).length} tables to: ${outfile}`);
  } finally {
    await client.end();
  }
}

exportAllTablesToJson()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Export failed:', err?.message || err);
    process.exit(1);
  });



