import pg from 'pg';
import env from './env.js';

const { Pool } = pg;

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD
});

export default {
  query: (text, params) => pool.query(text, params)
}; 