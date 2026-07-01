require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Setup Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');
// Use 'gemini-1.5-flash' which is the current stable recommended model
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection (Configured for TiDB / Render deployment)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'kali',
    port: process.env.DB_PORT || 3306,
    // TiDB Serverless requires SSL, so we enable it if DB_SSL is set to 'true' in Render
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    multipleStatements: true
});

const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const dbSetupQuery = `
CREATE DATABASE IF NOT EXISTS stressdb;
USE stressdb;
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

db.connect((err) => {
    if (err) console.error('MySQL Connection Error:', err.message);
    else {
        db.query(dbSetupQuery, (err) => {
            if (err) console.error('DB Setup Error:', err.message);
            else console.log('Connected to MySQL and Database is ready.');
        });
    }
});

function calculateStressLevel(sleep, study, assignments, mood) {
    let stress = 0;
    if (Number(sleep) < 6) stress += 2;
    if (Number(study) > 8) stress += 2;
    if (Number(assignments) > 5) stress += 2;
    if (mood === "Anxious") stress += 3;
    return (stress <= 3) ? "LOW" : (stress <= 6) ? "MEDIUM" : "HIGH";
}

app.post('/submit', async (req, res) => {
    const { name, sleep, study, assignments, mood } = req.body;
    const level = calculateStressLevel(sleep, study, assignments, mood);
    
    let finalSuggestion = "";

    console.log(`--- AI Request for ${name} ---`);

    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.length < 10) {
        console.log("WARNING: Valid Gemini API Key not found in .env file.");
        finalSuggestion = "Please add a valid GEMINI_API_KEY to your .env file to see AI-generated advice! For now: focus on your sleep and take regular study breaks.";
    } else {
        try {
            const prompt = `Student: ${name}. Stress: ${level}. Sleep: ${sleep}h, Study: ${study}h, Assignments: ${assignments}, Mood: ${mood}. 
            Role: Helpful College Counselor.
            Task: Provide 3 short, practical, and empathetic tips.
            Constraint: ONLY output the tips. DO NOT include internal reasoning, word counts, or "thought" blocks. Keep it under 45 words.`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            // Clean the response: Remove anything that looks like reasoning/thoughts
            let text = response.text().replace(/<thought>[\s\S]*?<\/thought>/g, '').replace(/\(thought\)[\s\S]*?\n/g, '').trim();
            finalSuggestion = text;
            console.log("AI Suggestion Success (Cleaned)!");
        } catch (e) {
            console.error('AI API Error:', e.message);
            finalSuggestion = "AI is currently unavailable. Tip: Try to maintain a consistent sleep schedule and break your assignments into smaller tasks.";
        }
    }

    db.query('USE stressdb', () => {
        const query = 'INSERT INTO students (name, sleep, study, assignments, mood, stress_level, suggestion) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [name, sleep, study, assignments, mood, level, finalSuggestion], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ name, level, suggestion: finalSuggestion });
        });
    });
});

app.get('/history/:name', (req, res) => {
    db.query('USE stressdb', () => {
        db.query('SELECT sleep, study, assignments, mood, stress_level, suggestion, created_at FROM students WHERE name = ? ORDER BY created_at DESC LIMIT 10', [req.params.name], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });
});

app.get('/admin-stats', (req, res) => {
    db.query('USE stressdb', () => {
        db.query('SELECT stress_level, COUNT(*) as count FROM students GROUP BY stress_level', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    
    const hashedPassword = hashPassword(password);
    db.query('USE stressdb', () => {
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Username already exists' });
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    
    const hashedPassword = hashPassword(password);
    db.query('USE stressdb', () => {
        db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashedPassword], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                res.json({ success: true, username: results[0].username });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
