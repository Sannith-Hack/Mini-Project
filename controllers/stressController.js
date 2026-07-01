const db = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

function calculateStressLevel(sleep, study, assignments, mood) {
    let stress = 0;
    if (Number(sleep) < 6) stress += 2;
    if (Number(study) > 8) stress += 2;
    if (Number(assignments) > 5) stress += 2;
    if (mood === "Anxious") stress += 3;
    return (stress <= 3) ? "LOW" : (stress <= 6) ? "MEDIUM" : "HIGH";
}

exports.submitAssessment = async (req, res) => {
    const { sleep, study, assignments, mood } = req.body;
    const name = req.user.username;
    
    // Basic Input Validation
    if (sleep < 0 || sleep > 24 || study < 0 || study > 24 || assignments < 0) {
        return res.status(400).json({ error: 'Invalid input values.' });
    }

    const level = calculateStressLevel(sleep, study, assignments, mood);
    let finalSuggestion = "";

    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.length < 10) {
        finalSuggestion = "Please add a valid GEMINI_API_KEY to your .env file to see AI-generated advice! For now: focus on your sleep and take regular study breaks.";
    } else {
        try {
            const prompt = `Student: ${name}. Stress: ${level}. Sleep: ${sleep}h, Study: ${study}h, Assignments: ${assignments}, Mood: ${mood}. Role: Helpful College Counselor. Task: Provide 3 short, practical, and empathetic tips. Constraint: ONLY output the tips. DO NOT include internal reasoning, word counts, or "thought" blocks. Keep it under 45 words.`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().replace(/<thought>[\s\S]*?<\/thought>/g, '').replace(/\(thought\)[\s\S]*?\n/g, '').trim();
            finalSuggestion = text;
        } catch (e) {
            console.error('AI API Error:', e.message);
            finalSuggestion = "AI is currently unavailable. Tip: Try to maintain a consistent sleep schedule and break your assignments into smaller tasks.";
        }
    }

    const query = 'INSERT INTO students (name, sleep, study, assignments, mood, stress_level, suggestion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, sleep, study, assignments, mood, level, finalSuggestion], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ name, level, suggestion: finalSuggestion });
    });
};

exports.getHistory = (req, res) => {
    db.query('SELECT sleep, study, assignments, mood, stress_level, suggestion, created_at FROM students WHERE name = ? ORDER BY created_at DESC LIMIT 10', [req.user.username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getAdminStats = (req, res) => {
    db.query('SELECT stress_level, COUNT(*) as count FROM students GROUP BY stress_level', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
    });
};

exports.exportCSV = (req, res) => {
    db.query('SELECT name, sleep, study, assignments, mood, stress_level, created_at FROM students ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        let csv = 'Name,Sleep,Study,Assignments,Mood,Stress Level,Date\n';
        results.forEach(row => {
            const date = new Date(row.created_at).toLocaleString().replace(/,/g, '');
            csv += `${row.name},${row.sleep},${row.study},${row.assignments},${row.mood},${row.stress_level},${date}\n`;
        });
        
        res.header('Content-Type', 'text/csv');
        res.attachment('mindflow_global_data.csv');
        return res.send(csv);
    });
};
