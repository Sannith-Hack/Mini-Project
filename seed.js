require('dotenv').config();
const mysql = require('mysql2/promise');

const seedData = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || process.env.DB_PASS || 'kali',
            database: process.env.DB_NAME || 'stressdb',
            port: process.env.DB_PORT || 3306,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
        });

        console.log("Connected to database. Seeding data...");

        const moods = ["Normal", "Anxious", "Happy", "Tired"];
        const students = [];

        for(let i=1; i<=50; i++) {
            const name = `Student_${i}`;
            const sleep = Math.floor(Math.random() * 6) + 4; // 4 to 9 hours
            const study = Math.floor(Math.random() * 8) + 2; // 2 to 9 hours
            const assignments = Math.floor(Math.random() * 8); // 0 to 7
            const mood = moods[Math.floor(Math.random() * moods.length)];
            
            // Calculate level
            let stress = 0;
            if (sleep < 6) stress += 2;
            if (study > 8) stress += 2;
            if (assignments > 5) stress += 2;
            if (mood === "Anxious") stress += 3;
            
            const level = (stress <= 3) ? "LOW" : (stress <= 6) ? "MEDIUM" : "HIGH";
            const suggestion = "Keep up the good work. Make sure to stay hydrated and take regular breaks.";
            
            students.push([name, sleep, study, assignments, mood, level, suggestion]);
        }

        const query = 'INSERT INTO students (name, sleep, study, assignments, mood, stress_level, suggestion) VALUES ?';
        await connection.query(query, [students]);
        
        console.log("Successfully inserted 50 fake student records!");
        await connection.end();
    } catch (err) {
        console.error("Seeding failed:", err.message);
    }
};

seedData();
