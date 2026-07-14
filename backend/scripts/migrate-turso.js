require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { createTursoClient } = require('../turso-client');

function remoteCompatibleSchema(sql) {
  return sql
    .replace(/^\s*PRAGMA\s+[^;]+;\s*$/gim, '')
    .trim();
}

async function main() {
  const client = createTursoClient();
  const schemaPath = path.resolve(__dirname, '..', 'database.sql');
  const schema = remoteCompatibleSchema(fs.readFileSync(schemaPath, 'utf8'));

  await client.execute('PRAGMA foreign_keys = ON');
  await client.executeMultiple(schema);
  const tables = await client.execute({
    sql: "SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    args: []
  });

  console.log(`Turso schema is ready (${Number(tables.rows[0].count)} application tables).`);
  client.close();
}

main().catch((error) => {
  console.error('Turso schema migration failed:', error.message);
  process.exitCode = 1;
});
