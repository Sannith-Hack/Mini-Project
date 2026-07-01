require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const rateLimit = require('express-rate-limit');
// ---- New imports for Google OAuth ----
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const stressRoutes = require('./routes/stressRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// CORS whitelist (comma‑separated origins in CORS_ORIGIN env var)
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
app.use(cors({
  origin: (origin, callback) => {
    // Allow non‑browser requests like Postman or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
// Ensure static assets are served from public folder, but do NOT automatically serve index.html for '/'
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
// Logging middleware
app.use(morgan('combined'));

// ---- Session and Passport middleware ----
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_session_secret_change_in_prod',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting for Auth
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/auth', limiter);

// Routes
app.use('/api/auth', authRoutes);
// Google auth routes
const googleAuthRoutes = require('./routes/googleAuth');
app.use('/api/auth', googleAuthRoutes);
app.use('/api/stress', stressRoutes);

// Explicit route handlers for pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
