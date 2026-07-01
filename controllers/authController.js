const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Username already exists' });
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Registered successfully' });
        });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password);
            if (match) {
                const token = jwt.sign({ username: results[0].username }, JWT_SECRET, { expiresIn: '2h' });
                res.json({ success: true, username: results[0].username, token });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
};
