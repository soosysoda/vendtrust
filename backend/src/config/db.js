const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;

if(!connectionString) {
  console.error('DATABASE_URL not set in environment');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'vendtrust',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = db;

