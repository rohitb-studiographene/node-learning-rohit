import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "auth_db",
    password: "rohit"
});

export default pool; 