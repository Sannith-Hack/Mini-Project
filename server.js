require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// ---- New imports for Google OAuth ----
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const stressRoutes = require('./routes/stressRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(helmet());

// ---- Session and Passport middleware ----
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
