require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Setup Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'kali',
    database: 'stressdb'
});

db.connect((err) => {
    if (err) console.error('MySQL Error:', err.message);
    else console.log('Connected to MySQL on 3001.');
});

// Calculate Stress Level Helper
function calculateStressLevel(sleep, study, assignments, mood) {
    let stress = 0;
    if (Number(sleep) < 6) stress += 2;
    if (Number(study) > 8) stress += 2;
    if (Number(assignments) > 5) stress += 2;
    if (mood === "Anxious") stress += 3;
    return (stress <= 3) ? "LOW" : (stress <= 6) ? "MEDIUM" : "HIGH";
}

// Routes
app.get('/hello', (req, res) => res.send('AI Stress Detector is Running!'));

// 1. Submit Data & Get AI Suggestion
app.post('/submit', async (req, res) => {
    const { name, sleep, study, assignments, mood } = req.body;
    const level = calculateStressLevel(sleep, study, assignments, mood);
    let finalSuggestion = "Focus on balance and self-care.";

    if (process.env.GEMINI_API_KEY) {
        try {
            const prompt = `Student: ${name}. Sleep: ${sleep}hr, Study: ${study}hr, Assignments: ${assignments}, Mood: ${mood}. Stress: ${level}. 
            Provide 3 short, empathetic, practical tips for this specific situation. Use 40 words max.`;
            const result = await model.generateContent(prompt);
            finalSuggestion = result.response.text();
        } catch (e) { console.error('AI Error:', e.message); }
    }

    const query = 'INSERT INTO students (name, sleep, study, assignments, mood, stress_level, suggestion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, sleep, study, assignments, mood, level, finalSuggestion], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ name, level, suggestion: finalSuggestion, data: { sleep, study, assignments } });
    });
});

// 2. Get User History
app.get('/history/:name', (req, res) => {
    const query = 'SELECT * FROM students WHERE name = ? ORDER BY created_at DESC LIMIT 5';
    db.query(query, [req.params.name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. Admin Stats (Total Summary)
app.get('/admin-stats', (req, res) => {
    const query = `
        SELECT 
            stress_level, COUNT(*) as count 
        FROM students 
        GROUP BY stress_level
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
