const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSeed() {
    console.log('🚀 Starting Database Initializer & Seed Script...');
    let connection = null;

    try {
        // Initial connection without specifying DB to ensure DB can be created if missing
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: parseInt(process.env.DB_PORT || '3306'),
            multipleStatements: true
        });

        console.log('📖 Reading schema.sql...');
        const schemaPath = path.join(__dirname, '../docs/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('⚡ Executing schema creation...');
        await connection.query(schemaSql);
        console.log('✅ Database and tables created successfully!');

        console.log('📖 Reading seed.sql...');
        const seedPath = path.join(__dirname, '../docs/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('🌱 Inserting 20+ sample records...');
        await connection.query(seedSql);
        console.log('✅ Database seeded successfully with 20+ students, evaluations, learning plans, users, and analytics!');

    } catch (error) {
        console.error('❌ Error executing database seed:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n👉 SOLUTION: MySQL Access Denied!');
            console.error('   Please edit your .env file with your actual MySQL password:');
            console.error('   DB_PASSWORD=your_actual_mysql_password\n');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('\n👉 SOLUTION: Could not connect to MySQL server!');
            console.error('   Please ensure MySQL service/server is running on your machine.\n');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
        console.log('🏁 Database setup process complete.');
    }
}

runSeed();
