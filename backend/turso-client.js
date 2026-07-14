const { createClient } = require('@libsql/client/web');

function requiredEnvironment(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`Set ${name} before starting the Turso database client.`);
  return value;
}

function createTursoClient() {
  const url = requiredEnvironment('TURSO_DATABASE_URL');
  const authToken = requiredEnvironment('TURSO_AUTH_TOKEN');

  if (!/^libsqls?:\/\//i.test(url) && !/^https?:\/\//i.test(url)) {
    throw new Error('TURSO_DATABASE_URL must use a libsql://, libsqls://, https://, or http:// URL.');
  }

  return createClient({ url, authToken });
}

module.exports = { createTursoClient };
