const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool using promises
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'twineval_ai',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database Connected Successfully to database:', process.env.DB_NAME || 'twineval_ai');
        connection.release();
        return true;
    } catch (error) {
        console.error('⚠️ Database Connection Warning:', error.message);
        console.error('👉 Please make sure MySQL is running and database "twineval_ai" exists.');
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
