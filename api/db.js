require('dotenv').config();
const { Pool } = require('pg');

// Pool configurado para Neon/Postgres (usa DATABASE_URL en api/.env)
// Neon recomienda ssl: { rejectUnauthorized: false } para conexiones remotas.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
