require('dotenv').config();
const mysql = require('mysql2/promise');

const isRemoteDb = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'menthfy_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 2,
    queueLimit: 0,
    ssl: (process.env.DB_SSL === 'true' || isRemoteDb) ? { rejectUnauthorized: false } : undefined,
});

module.exports = pool;
