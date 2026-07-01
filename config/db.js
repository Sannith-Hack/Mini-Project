require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || 'kali',
    database: process.env.DB_NAME || undefined,
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    multipleStatements: true
});

const dbName = process.env.DB_NAME || 'stressdb';
const dbSetupQuery = `
CREATE DATABASE IF NOT EXISTS \`${dbName}\`;
USE \`${dbName}\`;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(50), 
    sleep INT, 
    study INT, 
    assignments INT, 
    mood VARCHAR(20), 
    stress_level VARCHAR(20), 
    suggestion TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL Connection Error:', err.message);
    } else {
        connection.query(dbSetupQuery, (err) => {
            if (err) {
                console.error('DB Setup Error:', err.message);
                connection.release();
            } else {
                // Run auto-migration for existing tables (adds columns if missing)
                const migrationQueries = [
                    "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL",
                    "ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL"
                ];
                let completed = 0;
                migrationQueries.forEach(q => {
                    connection.query(q, (migErr) => {
                        // Ignore duplicate column name error (errno 1060 or ER_DUP_FIELDNAME)
                        if (migErr && migErr.errno !== 1060 && migErr.code !== 'ER_DUP_FIELDNAME') {
                            console.log('Migration note:', migErr.message);
                        }
                        completed++;
                        if (completed === migrationQueries.length) {
                            connection.release();
                            console.log('Connected to MySQL and Database is ready.');
                        }
                    });
                });
            }
        });
    }
});

module.exports = db;
