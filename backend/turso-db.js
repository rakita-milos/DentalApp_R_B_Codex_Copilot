const { createTursoClient } = require('./turso-client');

let client;

function database() {
  if (!client) client = createTursoClient();
  return client;
}

async function execute(sql, args = []) {
  return database().execute({ sql, args });
}

async function get(sql, args = []) {
  const result = await execute(sql, args);
  return result.rows[0] || null;
}

async function all(sql, args = []) {
  const result = await execute(sql, args);
  return result.rows;
}

async function run(sql, args = []) {
  return execute(sql, args);
}

async function write(statements) {
  return database().batch(
    statements.map(({ sql, args = [] }) => ({ sql, args })),
    'write'
  );
}

async function close() {
  if (!client) return;
  client.close();
  client = undefined;
}

module.exports = { all, close, execute, get, run, write };
