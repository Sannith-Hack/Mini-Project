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
            connection.release();
            if (err) console.error('DB Setup Error:', err.message);
            else console.log('Connected to MySQL and Database is ready.');
        });
    }
});

module.exports = db;
