require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

// Setup Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');
// Use 'gemini-1.5-flash' which is the current stable recommended model
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kali',
    multipleStatements: true
});

db.connect((err) => {
    if (err) console.error('MySQL Connection Error:', err.message);
    else {
        db.query("CREATE DATABASE IF NOT EXISTS stressdb; USE stressdb; CREATE TABLE IF NOT EXISTS students(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), sleep INT, study INT, assignments INT, mood VARCHAR(20), stress_level VARCHAR(20), suggestion TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);", (err) => {
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
        db.query('SELECT stress_level, created_at FROM students WHERE name = ? ORDER BY created_at DESC LIMIT 5', [req.params.name], (err, results) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
